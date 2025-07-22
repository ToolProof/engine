"""
Example usage of the updohilo Python implementation.

This script demonstrates how to use the node classes and create a simple workflow.
"""

import asyncio
from src.types import GraphState, DryModeManager, AIMessage
from src.nodes.node_down import NodeDown
from src.nodes.node_low import NodeLow


async def main():
    """Run a simple example workflow."""
    print("Starting example workflow...")
    
    # Create a dry run state to avoid making actual API calls
    state = GraphState(
        dry_mode_manager=DryModeManager(
            dry_run_mode=True,
            dry_socket_mode=True,
            delay=0.5
        ),
        resource_map={
            "input_file": {
                "path": "/path/to/input.txt",
                "value": None
            }
        }
    )
    
    # Create a NodeDown instance
    node_down = NodeDown({
        "units": [
            {
                "key": "input_file",
                "intra_morphisms": {
                    "transport": lambda path: f"Content from {path}",
                    "transform": lambda content: content.upper()
                }
            }
        ]
    })
    
    # Run NodeDown
    print("\nRunning NodeDown...")
    result = await node_down.invoke(state)
    print(f"NodeDown result: {result}")
    
    # Update state with NodeDown result
    state.resource_map = result.get("resource_map", state.resource_map)
    state.messages.extend(result.get("messages", []))
    
    # Create a NodeLow instance
    node_low = NodeLow({
        "inputs": ["input_file"],
        "outputs": ["processed_data"],
        "inter_morphism": lambda content: {
            "processed_data": f"Processed: {content}"
        }
    })
    
    # Run NodeLow
    print("\nRunning NodeLow...")
    result = await node_low.invoke(state)
    print(f"NodeLow result: {result}")
    
    # Update state with NodeLow result
    state.resource_map = result.get("resource_map", state.resource_map)
    state.messages.extend(result.get("messages", []))
    
    # Print final state
    print("\nFinal state:")
    print(f"Messages: {[msg.content for msg in state.messages]}")
    print("Resource map:")
    for key, resource in state.resource_map.items():
        print(f"  {key}: {resource}")


if __name__ == "__main__":
    asyncio.run(main())
