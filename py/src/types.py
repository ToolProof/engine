"""
Type definitions for the updohilo Python implementation.

This module provides Python equivalents of the TypeScript types and interfaces
used in the original updohilo project.
"""

from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional, TypedDict, Union
from dataclasses import dataclass, field
import asyncio


class Resource(TypedDict):
    """Represents a resource with a path and value."""
    path: str
    value: Any


ResourceMap = Dict[str, Resource]


@dataclass
class DryModeManager:
    """Configuration for dry run and socket modes."""
    dry_run_mode: bool = False
    delay: int = 0
    dry_socket_mode: bool = False


@dataclass
class AIMessage:
    """Simple message class to represent AI messages."""
    content: str
    
    def __init__(self, content: str):
        self.content = content


@dataclass
class GraphState:
    """State object for graph processing."""
    messages: List[AIMessage] = field(default_factory=list)
    dry_mode_manager: DryModeManager = field(default_factory=DryModeManager)
    resource_map: ResourceMap = field(default_factory=dict)


class RunnableConfig(TypedDict, total=False):
    """Configuration for runnable operations."""
    # This is a simplified version of the LangChain RunnableConfig
    # Add specific config fields as needed
    pass


class NodeBase(ABC):
    """Abstract base class for all node types."""
    
    def __init__(self):
        self.lc_namespace = []  # For compatibility with LangChain interface
    
    @property
    @abstractmethod
    def spec(self) -> Any:
        """Node specification - must be implemented by subclasses."""
        pass
    
    @abstractmethod
    async def invoke(
        self, 
        state: GraphState, 
        options: Optional[RunnableConfig] = None
    ) -> Dict[str, Any]:
        """
        Process the graph state and return updates.
        
        Args:
            state: Current graph state
            options: Optional configuration
            
        Returns:
            Dictionary with state updates
        """
        pass
