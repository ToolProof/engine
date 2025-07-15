"""
NodeLow implementation for low-level data processing.

This module provides the Python implementation of the NodeLow class
which handles low-level data processing with generic typing support.
"""

import asyncio
import json
import websockets
from typing import Any, Callable, Dict, List, Optional, TypedDict, TypeVar, Generic

from ..types import NodeBase, GraphState, ResourceMap, AIMessage, RunnableConfig


# Generic type for outputs
OutputsType = TypeVar('OutputsType', bound=List[str])


class TSpec(TypedDict, Generic[OutputsType]):
    """Type specification for NodeLow."""
    inputs: List[str]
    outputs: OutputsType
    inter_morphism: Callable[..., Dict[str, Any]]


class NodeLow(NodeBase, Generic[OutputsType]):
    """
    Node for low-level data processing.
    
    This node processes input data using a specified inter-morphism function
    and produces outputs according to the specification.
    """
    
    def __init__(self, spec: TSpec[OutputsType]):
        super().__init__()
        self._spec = spec
    
    @property
    def spec(self) -> TSpec[OutputsType]:
        return self._spec
    
    async def _send_websocket_notification(self) -> None:
        """Send WebSocket notification if not in dry socket mode."""
        try:
            uri = "wss://service-websocket-384484325421.europe-west2.run.app"
            async with websockets.connect(uri) as websocket:
                message = json.dumps({"node": "NodeLow"})
                await websocket.send(message)
        except Exception as error:
            print(f"WebSocket Error: {error}")
    
    async def invoke(
        self, 
        state: GraphState, 
        options: Optional[RunnableConfig] = None
    ) -> Dict[str, Any]:
        """
        Process the graph state using low-level data processing.
        
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
                "messages": [AIMessage("NodeLow completed in DryRun mode")]
            }
        
        try:
            # Collect input values in the order specified
            inputs = []
            for key, resource in state.resource_map.items():
                if key in self.spec["inputs"]:
                    inputs.append(resource["value"])
            
            # Call the inter-morphism function
            inter_morphism = self.spec["inter_morphism"]
            if asyncio.iscoroutinefunction(inter_morphism):
                result = await inter_morphism(*inputs)
            else:
                result = inter_morphism(*inputs)
            
            # Create extra resources from the outputs
            extra_resources: ResourceMap = {}
            for output_key in self.spec["outputs"]:
                extra_resources[output_key] = {
                    "path": "",  # No path for computed values
                    "value": result[output_key]
                }
            
            return {
                "messages": [AIMessage("NodeLow completed")],
                "resource_map": {
                    **state.resource_map,
                    **extra_resources
                }
            }
            
        except Exception as error:
            print(f"Error in NodeLow: {error}")
            return {
                "messages": [AIMessage("NodeLow failed")]
            }
