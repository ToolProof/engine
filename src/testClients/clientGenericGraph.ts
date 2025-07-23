import dotenv from 'dotenv';
dotenv.config();
import { ResourceMap } from '../types';
import { Client } from '@langchain/langgraph-sdk';
import { RemoteGraph } from '@langchain/langgraph/remote';
import { HumanMessage } from '@langchain/core/messages';

const urlLocal = `http://localhost:2024`;
const urlRemote = `https://deployment-typescript-48b9b40b9bac500f8fe557700e4c49d9.us.langgraph.app`;
const url = urlLocal; //process.env.URL || urlLocal;
const graphId = 'genericGraph';
const client = new Client({
    apiUrl: url,
});
const remoteGraph = new RemoteGraph({ graphId, url });

const workflow = {
        "nodes": [
            {
                "job": {
                    "id": "736e2665-f1e5-43d5-a889-48c188e25400",
                    "displayName": "load_alpha",
                    "url": "https://dummy-url.com",
                    "semanticSpec": {
                        "description": "Load input file for alpha",
                        "embedding": []
                    },
                    "syntacticSpec": {
                        "inputs": [],
                        "outputs": [
                            {
                                "id": "3c6291e3-8fa9-4e35-8da8-059669e7a6e7",
                                "displayName": "alpha",
                                "semanticSpec": {
                                    "description": "Initial input parameter alpha",
                                    "embedding": []
                                },
                                "syntacticSpec": {
                                    "format": "txt",
                                    "schema": null
                                }
                            }
                        ]
                    }
                },
                "isFakeStep": true
            },
            {
                "job": {
                    "id": "a4997e0e-b376-4103-ae8d-d71a5efdcbc1",
                    "displayName": "load_beta",
                    "url": "https://dummy-url.com",
                    "semanticSpec": {
                        "description": "Load input file for beta",
                        "embedding": []
                    },
                    "syntacticSpec": {
                        "inputs": [],
                        "outputs": [
                            {
                                "id": "8235b5d5-b3c3-4b8e-b3fc-a0b2ca2ff2a5",
                                "displayName": "beta",
                                "semanticSpec": {
                                    "description": "Initial input parameter beta",
                                    "embedding": []
                                },
                                "syntacticSpec": {
                                    "format": "txt",
                                    "schema": null
                                }
                            }
                        ]
                    }
                },
                "isFakeStep": true
            },
            {
                "job": {
                    "id": "6db35a9d-a5a7-43e0-b38e-fc987ba0793b",
                    "displayName": "job_1",
                    "url": "https://dummy-url.com/job_1",
                    "semanticSpec": {
                        "description": "Initial data processing",
                        "embedding": []
                    },
                    "syntacticSpec": {
                        "inputs": [
                            {
                                "id": "3c6291e3-8fa9-4e35-8da8-059669e7a6e7",
                                "displayName": "alpha",
                                "semanticSpec": {
                                    "description": "Initial input parameter alpha",
                                    "embedding": []
                                },
                                "syntacticSpec": {
                                    "format": "txt",
                                    "schema": null
                                }
                            },
                            {
                                "id": "8235b5d5-b3c3-4b8e-b3fc-a0b2ca2ff2a5",
                                "displayName": "beta",
                                "semanticSpec": {
                                    "description": "Initial input parameter beta",
                                    "embedding": []
                                },
                                "syntacticSpec": {
                                    "format": "txt",
                                    "schema": null
                                }
                            }
                        ],
                        "outputs": [
                            {
                                "id": "80c38e53-ecb3-4a70-8293-799aa0652a34",
                                "displayName": "gamma",
                                "semanticSpec": {
                                    "description": "Processed gamma data",
                                    "embedding": []
                                },
                                "syntacticSpec": {
                                    "format": "txt",
                                    "schema": null
                                }
                            }
                        ]
                    }
                },
                "isFakeStep": false
            },
            {
                "job": {
                    "id": "51393e9c-7b4c-44f1-88e5-4b93455eaa22",
                    "displayName": "job_2",
                    "url": "https://dummy-url.com/job_2",
                    "semanticSpec": {
                        "description": "Transform gamma data",
                        "embedding": []
                    },
                    "syntacticSpec": {
                        "inputs": [
                            {
                                "id": "80c38e53-ecb3-4a70-8293-799aa0652a34",
                                "displayName": "gamma",
                                "semanticSpec": {
                                    "description": "Processed gamma data",
                                    "embedding": []
                                },
                                "syntacticSpec": {
                                    "format": "txt",
                                    "schema": null
                                }
                            }
                        ],
                        "outputs": [
                            {
                                "id": "fea323c6-1c29-4b32-b43e-7db9c1ea3bb2",
                                "displayName": "delta",
                                "semanticSpec": {
                                    "description": "Delta stream data",
                                    "embedding": []
                                },
                                "syntacticSpec": {
                                    "format": "txt",
                                    "schema": null
                                }
                            },
                            {
                                "id": "5e25c2c0-54ad-44de-84f2-8860831dd7dd",
                                "displayName": "epsilon",
                                "semanticSpec": {
                                    "description": "Epsilon stream data",
                                    "embedding": []
                                },
                                "syntacticSpec": {
                                    "format": "txt",
                                    "schema": null
                                }
                            }
                        ]
                    }
                },
                "isFakeStep": false
            },
            {
                "job": {
                    "id": "974efd6e-740e-401b-8e87-dd9b8c83c3b0",
                    "displayName": "job_3",
                    "url": "https://dummy-url.com/job_3",
                    "semanticSpec": {
                        "description": "Process delta stream",
                        "embedding": []
                    },
                    "syntacticSpec": {
                        "inputs": [
                            {
                                "id": "fea323c6-1c29-4b32-b43e-7db9c1ea3bb2",
                                "displayName": "delta",
                                "semanticSpec": {
                                    "description": "Delta stream data",
                                    "embedding": []
                                },
                                "syntacticSpec": {
                                    "format": "txt",
                                    "schema": null
                                }
                            }
                        ],
                        "outputs": [
                            {
                                "id": "22ec587f-a4f1-48fc-99f4-aaa08d28ada5",
                                "displayName": "zeta",
                                "semanticSpec": {
                                    "description": "Processed zeta result",
                                    "embedding": []
                                },
                                "syntacticSpec": {
                                    "format": "txt",
                                    "schema": null
                                }
                            }
                        ]
                    }
                },
                "isFakeStep": false
            }
        ],
        "edges": [
            {
                "from": "736e2665-f1e5-43d5-a889-48c188e25400",
                "to": "6db35a9d-a5a7-43e0-b38e-fc987ba0793b",
                "dataFlow": [
                    "alpha"
                ]
            },
            {
                "from": "a4997e0e-b376-4103-ae8d-d71a5efdcbc1",
                "to": "6db35a9d-a5a7-43e0-b38e-fc987ba0793b",
                "dataFlow": [
                    "beta"
                ]
            },
            {
                "from": "6db35a9d-a5a7-43e0-b38e-fc987ba0793b",
                "to": "51393e9c-7b4c-44f1-88e5-4b93455eaa22",
                "dataFlow": [
                    "gamma"
                ]
            },
            {
                "from": "51393e9c-7b4c-44f1-88e5-4b93455eaa22",
                "to": "974efd6e-740e-401b-8e87-dd9b8c83c3b0",
                "dataFlow": [
                    "delta"
                ]
            },
            {
                "from": "51393e9c-7b4c-44f1-88e5-4b93455eaa22",
                "to": "cc195b1f-1e6a-4655-8aca-1ce1be82f8eb",
                "dataFlow": [
                    "epsilon"
                ]
            },
            {
                "from": "974efd6e-740e-401b-8e87-dd9b8c83c3b0",
                "to": "4eca031b-8e20-4472-8785-40c959bed0bd",
                "dataFlow": [
                    "zeta"
                ]
            }
        ]
    };
export async function runRemoteGraph() {

    try {
        // Create a thread (or use an existing thread instead)
        const thread = await client.threads.create();
        console.log('thread :', thread);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 1800000); // 30 minutes
        console.log('timeout :', timeout);

        const prefix = 'ligandokreado/1iep/';
        console.log('prefix :', prefix);

        const resourceMap: ResourceMap = {
            anchor: {
                path: `${prefix}2025-01-01T00:00:00.000Z/candidate.smi`,
                value: null,
            },
            target: {
                path: `${prefix}target.pdb`,
                value: null,
            },
            box: {
                path: `${prefix}box.pdb`,
                value: null,
            },
        }

        try {
            // console.log('Invoking the graph')
            const result = await remoteGraph.invoke({
                messages: [new HumanMessage('Graph is invoked')],
                dryModeManager: {
                    dryRunMode: true,
                    delay: 1000,
                    drySocketMode: true,
                },
                resourceMap,
                workflow,
                counter: 0,
            }, {
                configurable: { thread_id: thread.thread_id },
                signal: controller.signal,
            });

            // console.log('threadId:', thread.thread_id);
            console.log('result:', JSON.stringify(result.messages, null, 2));
            
            return result;

        } finally {
            clearTimeout(timeout);
            if (!controller.signal.aborted) {
                controller.abort();
            }
        }

    } catch (error) {
        console.error('Error invoking graph:', error);
    }

}
