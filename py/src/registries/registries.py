"""
Transport registry for handling external data sources.

This module provides Python implementations of transport functions
for fetching content from various sources.
"""

import os
import aiohttp
from typing import Dict, Callable, Awaitable


class TransportRegistry:
    """Registry for transport functions."""
    
    @staticmethod
    async def fetch_content_from_path(path: str) -> str:
        """
        Fetch content from a Google Cloud Storage path.
        
        Args:
            path: The path to the file in the storage bucket
            
        Returns:
            The content of the file as a string
            
        Raises:
            Exception: If the file cannot be fetched
        """
        bucket_name = os.getenv('BUCKET_NAME')
        if not bucket_name:
            raise ValueError("BUCKET_NAME environment variable is not set")
        
        url = f"https://storage.googleapis.com/{bucket_name}/{path}"
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if not response.ok:
                    raise Exception(f"Failed to fetch file from: (URL: {url})")
                return await response.text()


# Create a dictionary-style registry for compatibility with the TypeScript version
transport_registry: Dict[str, Callable[[str], Awaitable[str]]] = {
    "fetch_content_from_path": TransportRegistry.fetch_content_from_path
}

# Also provide direct access to the function for convenience
fetch_content_from_path = TransportRegistry.fetch_content_from_path
