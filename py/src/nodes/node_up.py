"""
NodeUp implementation for uploading data to cloud storage.

This module provides the Python implementation of the NodeUp class
which handles uploading processed data to Google Cloud Storage.
"""

import asyncio
import json
import os
import websockets
from datetime import datetime
from typing import Any, Dict, List, Optional, TypedDict
from google.cloud import storage

from ..types import NodeBase, GraphState, ResourceMap, AIMessage, RunnableConfig


class Unit(TypedDict):
    """Type definition for an upload unit."""
    key: str
    path: str  # Path template, e.g. 'output/timestamp/${key}.txt'


class TSpec(TypedDict):
    """Type specification for NodeUp."""
    units: List[Unit]


class NodeUp(NodeBase):
    """
    Node for uploading data to cloud storage.
    
    This node uploads processed data to Google Cloud Storage
    using the specified path templates.
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
                message = json.dumps({"node": "NodeUp"})
                await websocket.send(message)
        except Exception as error:
            print(f"WebSocket Error: {error}")
    
    async def _upload_to_storage(self, content: Any, output_path: str) -> None:
        """
        Upload content to Google Cloud Storage.
        
        Args:
            content: Content to upload
            output_path: Path in the storage bucket
        """
        bucket_name = os.getenv('BUCKET_NAME')
        if not bucket_name:
            raise ValueError("BUCKET_NAME environment variable is not set")
        
        # Initialize the storage client
        storage_client = storage.Client()
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(output_path)
        
        # Convert content to string if needed
        if isinstance(content, (dict, list)):
            content_str = json.dumps(content)
        else:
            content_str = str(content)
        
        # Upload the content
        blob.upload_from_string(
            content_str,
            content_type='text/plain'
        )
    
    async def invoke(
        self, 
        state: GraphState, 
        options: Optional[RunnableConfig] = None
    ) -> Dict[str, Any]:
        """
        Process the graph state by uploading data to cloud storage.
        
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
                "messages": [AIMessage("NodeUp completed in DryRun mode")]
            }
        
        try:
            resource_map_augmented_with_path: ResourceMap = {}
            
            for unit in self.spec["units"]:
                key = unit["key"]
                path_template = unit["path"]
                
                # Get the value from the resource map
                if key not in state.resource_map:
                    raise KeyError(f"Resource key '{key}' not found in resource map")
                
                value = state.resource_map[key]["value"]
                
                # Generate timestamp and create output path
                timestamp = datetime.now().isoformat()
                output_path = path_template.replace("timestamp", timestamp)
                
                # Upload to storage
                await self._upload_to_storage(value, output_path)
                
                # Update resource map with the new path
                resource_map_augmented_with_path[key] = {
                    **state.resource_map[key],
                    "path": output_path
                }
            
            return {
                "messages": [AIMessage("NodeUp completed")],
                "resource_map": {
                    **state.resource_map,
                    **resource_map_augmented_with_path
                }
            }
            
        except Exception as error:
            print(f"Error in NodeUp: {error}")
            return {
                "messages": [AIMessage("NodeUp failed")]
            }
