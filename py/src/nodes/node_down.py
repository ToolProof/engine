"""
NodeDown implementation for downloading and processing resources.

This module provides the Python implementation of the NodeDown class
which handles downloading content and transforming it according to specifications.
"""

import asyncio
import json
import websockets
from typing import Any, Awaitable, Callable, Dict, List, Optional, TypedDict

from ..types import NodeBase, GraphState, ResourceMap, AIMessage, RunnableConfig


class IntraMorphisms(TypedDict):
    """Type definition for intra-morphisms."""
    transport: Callable[[str], Awaitable[str]]
    transform: Callable[[str], Any]


class Unit(TypedDict):
    """Type definition for a processing unit."""
    key: str
    intra_morphisms: IntraMorphisms


class TSpec(TypedDict):
    """Type specification for NodeDown."""
    units: List[Unit]


class NodeDown(NodeBase):
    """
    Node for downloading and processing resources.
    
    This node fetches content using transport functions and transforms
    it according to the specified intra-morphisms.
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
                message = json.dumps({"node": "NodeDown"})
                await websocket.send(message)
        except Exception as error:
            print(f"WebSocket Error: {error}")
    
    async def invoke(
        self, 
        state: GraphState, 
        options: Optional[RunnableConfig] = None
    ) -> Dict[str, Any]:
        """
        Process the graph state by downloading and transforming resources.
        
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
                "messages": [AIMessage("NodeDown completed in DryRun mode")]
            }
        
        # Create a copy of the resource map for updates
        new_resource_map: ResourceMap = state.resource_map.copy()
        
        # Process each resource according to the spec
        for key in state.resource_map.keys():
            # Skip resources not in our spec
            unit_keys = [unit["key"] for unit in self.spec["units"]]
            if key not in unit_keys:
                print(f"Skipping resource: {key}")
                continue
            
            # Find the corresponding unit specification
            unit = next((u for u in self.spec["units"] if u["key"] == key), None)
            if not unit:
                raise Exception(f"No intraMorphisms defined for key: {key}")
            
            intra_morphisms = unit["intra_morphisms"]
            resource = state.resource_map[key]
            
            try:
                # Transport the content
                content = await intra_morphisms["transport"](resource["path"])
                
                # Transform the content
                transform_func = intra_morphisms["transform"]
                if asyncio.iscoroutinefunction(transform_func):
                    value = await transform_func(content)
                else:
                    value = transform_func(content)
                
                # Update the resource map with the new value
                new_resource_map[key] = {
                    **resource,
                    "value": value
                }
                
            except Exception as error:
                raise Exception(f"Error fetching or processing file: {error}")
        
        return {
            "messages": [AIMessage("NodeDown completed")],
            "resource_map": new_resource_map
        }
