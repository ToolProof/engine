"""
NodeHigh implementation for high-level service integration.

This module provides the Python implementation of the NodeHigh class
which handles integration with external services via HTTP requests.
"""

import asyncio
import json
import os
import websockets
import aiohttp
from typing import Any, Callable, Dict, List, Optional, TypedDict
from pathlib import Path

from ..types import NodeBase, GraphState, ResourceMap, AIMessage, RunnableConfig


class TSpec(TypedDict):
    """Type specification for NodeHigh."""
    inputs: List[str]
    output_dir: str
    inter_morphism: Callable[[], str]


class NodeHigh(NodeBase):
    """
    Node for high-level service integration.
    
    This node integrates with external services by sending HTTP requests
    with input data and processing the responses.
    """
    
    def __init__(self, spec: TSpec):
        super().__init__()
        self._spec = spec
    
    @property
    def spec(self) -> TSpec:
        return self._spec
    
    async def _send_websocket_notification(self) -> None:
        """Send WebSocket notification if not in dry socket mode."""
        try:
            uri = "wss://service-websocket-384484325421.europe-west2.run.app"
            async with websockets.connect(uri) as websocket:
                message = json.dumps({"node": "NodeHigh"})
                await websocket.send(message)
        except Exception as error:
            print(f"WebSocket Error: {error}")
    
    async def _call_service(
        self, 
        url: str, 
        inputs: List[str], 
        output_dir: str, 
        state: GraphState
    ) -> List[str]:
        """
        Call the external service with the provided inputs.
        
        Args:
            url: Service URL
            inputs: List of input keys
            output_dir: Output directory path
            state: Current graph state
            
        Returns:
            List of output file names
        """
        # Build payload with input paths
        payload = {}
        for input_key in inputs:
            payload[input_key] = state.resource_map[input_key]["path"]
        
        payload["outputDir"] = output_dir
        
        print(f"payload: {json.dumps(payload, indent=2)}")
        
        # Make HTTP request to the service
        timeout = aiohttp.ClientTimeout(total=30 * 60)  # 30 minutes
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.post(
                url,
                json=payload,
                headers={"Content-Type": "application/json"}
            ) as response:
                if not response.ok:
                    raise Exception(f"Service request failed: {response.status}")
                
                result = await response.json()
                print(f"result tool: {json.dumps(result, indent=2)}")
                
                return result["result"]["outputs"]
    
    async def invoke(
        self, 
        state: GraphState, 
        options: Optional[RunnableConfig] = None
    ) -> Dict[str, Any]:
        """
        Process the graph state by calling external services.
        
        Args:
            state: Current graph state
            options: Optional configuration
            
        Returns:
            Dictionary with updated messages and resource map
        """
        # Send WebSocket notification if not in dry socket mode
        if not state.dry_mode_manager.dry_socket_mode:
            await self._send_websocket_notification()
        
        # Handle dry run mode
        if state.dry_mode_manager.dry_run_mode:
            await asyncio.sleep(state.dry_mode_manager.delay)
            return {
                "messages": [AIMessage("NodeHigh completed in DryRun mode")]
            }
        
        try:
            # Get output directory from resource map
            # Convention: outputDir is a resource key, not a path
            output_dir_resource = state.resource_map[self.spec["output_dir"]]
            output_dir = str(Path(output_dir_resource["path"]).parent)
            
            # Call the external service
            outputs = await self._call_service(
                self.spec["inter_morphism"](),
                self.spec["inputs"],
                output_dir,
                state
            )
            
            # Create extra resources from the outputs
            extra_resources: ResourceMap = {}
            for file_name in outputs:
                # Use filename without extension as key
                key = Path(file_name).stem
                extra_resources[key] = {
                    "path": str(Path(output_dir) / file_name),
                    "value": None
                }
            
            return {
                "messages": [AIMessage("NodeHigh completed")],
                "resource_map": {
                    **state.resource_map,
                    **extra_resources
                }
            }
            
        except Exception as error:
            print(f"Error in NodeHigh: {error}")
            return {
                "messages": [AIMessage("NodeHigh failed")]
            }
