# Testing Guide for Python Implementation

This document explains how to test the converted Python files and set up the testing environment.

## Project Structure

The Python implementation is organized as follows:

```
py/
├── __init__.py
├── requirements.txt           # Python dependencies
├── src/
│   ├── __init__.py
│   ├── types.py              # Core type definitions
│   ├── nodes/
│   │   ├── __init__.py
│   │   ├── node_down.py      # Download and process resources
│   │   ├── node_high.py      # High-level service integration
│   │   ├── node_low.py       # Low-level data processing
│   │   └── node_up.py        # Upload to cloud storage
│   └── registries/
│       ├── __init__.py
│       └── registries.py     # Transport registry
└── tests/
    ├── __init__.py
    ├── test_types.py
    ├── test_registries.py
    ├── test_node_down.py
    ├── test_node_high.py
    ├── test_node_low.py
    └── test_node_up.py
```

## Environment Setup

### 1. Install Python Dependencies

```bash
# Navigate to the py directory
cd py

# Create a virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Environment Variables

Set up the following environment variables for testing:

```bash
export BUCKET_NAME="your-gcs-bucket-name"
export GOOGLE_APPLICATION_CREDENTIALS="path/to/service-account.json"
```

For testing purposes, you can use mock values:

```bash
export BUCKET_NAME="test-bucket"
```

## Running Tests

### Install the Package in Development Mode

First, install the package in development mode to make imports work correctly:

```bash
# From the py directory
source venv/bin/activate
pip install -e .
```

### Test Imports and Basic Functionality

```bash
# Test that all imports work correctly
python test_imports.py

# Run the example usage script
python example_usage.py
```

### Running Unit Tests

Note: The unit tests are currently configured but may need import adjustments. For now, you can test the functionality using the example scripts above.

```bash
# Test individual modules directly
python -c "from src.types import GraphState; print('Types module works!')"
python -c "from src.nodes.node_down import NodeDown; print('NodeDown works!')"
python -c "from src.registries.registries import transport_registry; print('Registries work!')"
```

### Run Tests with Coverage

```bash
pip install pytest-cov
python -m pytest tests/ --cov=src --cov-report=html
```

## Test Categories

### Unit Tests

Each module has comprehensive unit tests covering:

1. **src/types.py**: Type definitions and data structures
2. **src/registries/registries.py**: Transport functions and error handling
3. **src/nodes/node_*.py**: Node functionality including:
   - Normal operation
   - Dry run mode
   - Error handling
   - WebSocket notifications (mocked)
   - Async operations

### Integration Tests

To run integration tests with real services:

1. Set up actual Google Cloud Storage bucket
2. Configure service account credentials
3. Run tests with real WebSocket endpoints

```bash
# Run with real GCS (requires proper credentials)
INTEGRATION_TESTS=true python -m pytest tests/ -v -k "not mock"
```

## Manual Testing

### Testing Individual Nodes

```python
import asyncio
import sys
import os

# Add the py directory to Python path
sys.path.insert(0, os.path.abspath('.'))

from src.types import GraphState, DryModeManager
from src.nodes.node_down import NodeDown

# Example: Test NodeDown
async def test_node_down():
    spec = {
        "units": [
            {
                "key": "test_data",
                "intra_morphisms": {
                    "transport": lambda path: f"Content from {path}",
                    "transform": lambda content: content.upper()
                }
            }
        ]
    }
    
    state = GraphState(
        resource_map={
            "test_data": {"path": "/test/path", "value": None}
        },
        dry_mode_manager=DryModeManager(dry_socket_mode=True)
    )
    
    node = NodeDown(spec)
    result = await node.invoke(state)
    print(result)

# Run the test
asyncio.run(test_node_down())
```

### Testing with Real Services

For testing with actual external services:

1. **WebSocket Testing**: Use a real WebSocket endpoint or set up a test server
2. **HTTP Services**: Test with actual service endpoints or mock servers
3. **Google Cloud Storage**: Use a test bucket with proper credentials

## Common Issues and Solutions

### 1. Import Errors

If you encounter import errors:

```bash
# Make sure you're in the py directory
cd py

# Add the current directory to PYTHONPATH
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
```

### 2. Async Test Issues

Ensure you're using `pytest-asyncio` for async tests:

```bash
pip install pytest-asyncio
```

### 3. Mock Issues

For WebSocket and HTTP mocking, ensure proper async context managers:

```python
# Correct async mocking
with patch('websockets.connect') as mock_connect:
    mock_connect.return_value.__aenter__.return_value = mock_websocket
```

### 4. Google Cloud Storage Authentication

For GCS tests, either:
- Use service account JSON file
- Use application default credentials
- Mock the storage client entirely

## Performance Testing

For performance testing of the nodes:

```python
import time
import asyncio
import sys
import os

sys.path.insert(0, os.path.abspath('.'))

from src.nodes.node_low import NodeLow
from src.types import GraphState

async def performance_test():
    # Test with large datasets
    spec = {
        "inputs": ["large_data"],
        "outputs": ["processed_data"],
        "inter_morphism": lambda x: {"processed_data": len(x)}
    }
    
    state = GraphState(
        resource_map={
            "large_data": {"path": "", "value": list(range(1000000))}
        }
    )
    
    start_time = time.time()
    node = NodeLow(spec)
    result = await node.invoke(state)
    end_time = time.time()
    
    print(f"Processing time: {end_time - start_time:.2f} seconds")

asyncio.run(performance_test())
```

## Continuous Integration

For CI/CD pipelines, use this test command:

```bash
cd py
python -m pytest tests/ --junitxml=test-results.xml --cov=src --cov-report=xml
```

This generates test results and coverage reports suitable for CI systems.

## Package Usage

To use the package in your own code:

```python
# From within the py directory
from src.nodes import NodeDown, NodeHigh, NodeLow, NodeUp
from src.registries import transport_registry
from src.types import GraphState, DryModeManager, AIMessage

# Or using the main package imports
from . import NodeDown, NodeHigh, NodeLow, NodeUp, transport_registry
```
