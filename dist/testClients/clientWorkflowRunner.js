// import dotenv from 'dotenv';
// dotenv.config(); // Commented out to test
// import { WorkflowSpec, Workflow } from '../types';
// import { Client } from '@langchain/langgraph-sdk';
// import { RemoteGraph } from '@langchain/langgraph/remote';
// import { HumanMessage } from '@langchain/core/messages';
const urlLocal = `http://localhost:8123`;
const urlRemote = `https://deployment-typescript-48b9b40b9bac500f8fe557700e4c49d9.us.langgraph.app`;
const url = urlLocal; //process.env.URL || urlLocal;
const graphId = 'genericGraph';
// const client = new Client({
//     apiUrl: url,
// });
// const remoteGraph = new RemoteGraph({ graphId, url });
/*
const workflow: Workflow = {
    jobs: [
        {
            id: 'c045dbc0-bab9-4214-a62c-cbe5d26bd275',
            displayName: 'load_alpha',
            url: 'https://dummy-url.com',
            semanticSpec: {
                description: 'Load input file for alpha',
                embedding: []
            },
            syntacticSpec: {
                inputs: [],
                outputs: [
                    {
                        id: '1224ecce-30a2-4a12-bb21-91d26a49b8a7',
                        displayName: 'alpha',
                        semanticSpec: {
                            description: 'Initial input parameter alpha',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ]
            },
            isFake: false
        },
        {
            id: 'a5c1838d-f8e4-48ca-85b9-6790c378d812',
            displayName: 'load_beta',
            url: 'https://dummy-url.com',
            semanticSpec: {
                description: 'Load input file for beta',
                embedding: []
            },
            syntacticSpec: {
                inputs: [],
                outputs: [
                    {
                        id: '29974288-3637-43b4-a29f-82802496a9dd',
                        displayName: 'beta',
                        semanticSpec: {
                            description: 'Initial input parameter beta',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ]
            },
            isFake: false
        },
        {
            id: '9030f534-88b5-438c-af66-15fe24cee40b',
            displayName: 'job_1',
            url: 'https://dummy-url.com/add_1',
            semanticSpec: {
                description: 'Initial data processing',
                embedding: []
            },
            syntacticSpec: {
                inputs: [
                    {
                        id: '1224ecce-30a2-4a12-bb21-91d26a49b8a7',
                        displayName: 'alpha',
                        semanticSpec: {
                            description: 'Initial input parameter alpha',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    },
                    {
                        id: '29974288-3637-43b4-a29f-82802496a9dd',
                        displayName: 'beta',
                        semanticSpec: {
                            description: 'Initial input parameter beta',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ],
                outputs: [
                    {
                        id: 'e8bf4f73-1bcb-46d1-b045-22677c7c8588',
                        displayName: 'gamma',
                        semanticSpec: {
                            description: 'Processed gamma data',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ]
            },
            isFake: false
        },
        {
            id: 'f9f76e0a-11ba-4767-94a0-34a43e757957',
            displayName: 'job_2',
            url: 'https://dummy-url.com/job_2',
            semanticSpec: {
                description: 'Transform gamma data',
                embedding: []
            },
            syntacticSpec: {
                inputs: [
                    {
                        id: 'e8bf4f73-1bcb-46d1-b045-22677c7c8588',
                        displayName: 'gamma',
                        semanticSpec: {
                            description: 'Processed gamma data',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ],
                outputs: [
                    {
                        id: '008e8bb4-5560-4c12-bbb5-01ea0cfec649',
                        displayName: 'delta',
                        semanticSpec: {
                            description: 'Delta stream data',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    },
                    {
                        id: 'e1f2e0c9-36bd-457e-b043-ae0e7bb5d198',
                        displayName: 'epsilon',
                        semanticSpec: {
                            description: 'Epsilon stream data',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ]
            },
            isFake: false
        },
        {
            id: 'adaf8c9e-c5da-4d81-8760-1d2bae0b35ef',
            displayName: 'job_3',
            url: 'https://dummy-url.com/job_3',
            semanticSpec: {
                description: 'Process delta stream',
                embedding: []
            },
            syntacticSpec: {
                inputs: [
                    {
                        id: '008e8bb4-5560-4c12-bbb5-01ea0cfec649',
                        displayName: 'delta',
                        semanticSpec: {
                            description: 'Delta stream data',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ],
                outputs: [
                    {
                        id: '4904889f-4f02-4c1c-ad8e-5fab1e5fb033',
                        displayName: 'zeta',
                        semanticSpec: {
                            description: 'Processed zeta result',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ]
            },
            isFake: false
        },
        {
            id: 'a46cb6fb-7f26-4c3b-964e-7e1bcab0ae45',
            displayName: 'job_4',
            url: 'https://dummy-url.com/job_4',
            semanticSpec: {
                description: 'Process epsilon stream',
                embedding: []
            },
            syntacticSpec: {
                inputs: [
                    {
                        id: 'e1f2e0c9-36bd-457e-b043-ae0e7bb5d198',
                        displayName: 'epsilon',
                        semanticSpec: {
                            description: 'Epsilon stream data',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ],
                outputs: [
                    {
                        id: '86ec4175-ae5f-4019-8259-b62d7d8e10df',
                        displayName: 'eta',
                        semanticSpec: {
                            description: 'Eta processing result',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    },
                    {
                        id: '31f5afc6-a096-484b-96ef-374a71f93da3',
                        displayName: 'theta',
                        semanticSpec: {
                            description: 'Theta transformation output',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ]
            },
            isFake: false
        },
        {
            id: 'd8bbac90-bea6-49e1-bcf4-8f5dfc9e4be7',
            displayName: 'job_5',
            url: 'https://dummy-url.com/job_5',
            semanticSpec: {
                description: 'Combine zeta and eta',
                embedding: []
            },
            syntacticSpec: {
                inputs: [
                    {
                        id: '4904889f-4f02-4c1c-ad8e-5fab1e5fb033',
                        displayName: 'zeta',
                        semanticSpec: {
                            description: 'Processed zeta result',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    },
                    {
                        id: '86ec4175-ae5f-4019-8259-b62d7d8e10df',
                        displayName: 'eta',
                        semanticSpec: {
                            description: 'Eta processing result',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ],
                outputs: [
                    {
                        id: 'fcbfc159-5b2c-4dfa-9d67-150da8818021',
                        displayName: 'iota',
                        semanticSpec: {
                            description: 'Combined iota result',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ]
            },
            isFake: false
        },
        {
            id: 'e2ed41ef-1288-439b-9422-772c01ef05f0',
            displayName: 'job_6',
            url: 'https://dummy-url.com/job_6',
            semanticSpec: {
                description: 'Transform theta data',
                embedding: []
            },
            syntacticSpec: {
                inputs: [
                    {
                        id: '31f5afc6-a096-484b-96ef-374a71f93da3',
                        displayName: 'theta',
                        semanticSpec: {
                            description: 'Theta transformation output',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ],
                outputs: [
                    {
                        id: 'ee829710-7b44-4fc5-9391-6c0b00c88bc1',
                        displayName: 'kappa',
                        semanticSpec: {
                            description: 'Kappa transformation output',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    },
                    {
                        id: '0e71edda-0eba-45d8-9b1a-ac877702ad21',
                        displayName: 'lambda',
                        semanticSpec: {
                            description: 'Lambda transformation output',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ]
            },
            isFake: false
        },
        {
            id: '52b05366-6fec-4a71-90ba-169b5a54913b',
            displayName: 'job_7',
            url: 'https://dummy-url.com/job_7',
            semanticSpec: {
                description: 'Process iota with kappa',
                embedding: []
            },
            syntacticSpec: {
                inputs: [
                    {
                        id: 'fcbfc159-5b2c-4dfa-9d67-150da8818021',
                        displayName: 'iota',
                        semanticSpec: {
                            description: 'Combined iota result',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    },
                    {
                        id: 'ee829710-7b44-4fc5-9391-6c0b00c88bc1',
                        displayName: 'kappa',
                        semanticSpec: {
                            description: 'Kappa transformation output',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ],
                outputs: [
                    {
                        id: '74544cbe-41c4-47e0-b0e9-538c17608d6c',
                        displayName: 'mu',
                        semanticSpec: {
                            description: 'Mu analysis result',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ]
            },
            isFake: false
        },
        {
            id: '4e0825f7-d5b3-43bb-873c-dd7c1876c312',
            displayName: 'job_8',
            url: 'https://dummy-url.com/job_8',
            semanticSpec: {
                description: 'Lambda transformation',
                embedding: []
            },
            syntacticSpec: {
                inputs: [
                    {
                        id: '0e71edda-0eba-45d8-9b1a-ac877702ad21',
                        displayName: 'lambda',
                        semanticSpec: {
                            description: 'Lambda transformation output',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ],
                outputs: [
                    {
                        id: 'b2bfd4d8-8a84-47c7-9ad2-495b4647a3fe',
                        displayName: 'nu',
                        semanticSpec: {
                            description: 'Nu processing output',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    },
                    {
                        id: 'ab0fdcc0-5344-47c0-a133-c37eba1649d7',
                        displayName: 'xi',
                        semanticSpec: {
                            description: 'Xi processing output',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ]
            },
            isFake: false
        },
        {
            id: 'c6a0f720-1b9b-4564-829d-4793c354ac2c',
            displayName: 'job_9',
            url: 'https://dummy-url.com/job_9',
            semanticSpec: {
                description: 'Mu analysis',
                embedding: []
            },
            syntacticSpec: {
                inputs: [
                    {
                        id: '74544cbe-41c4-47e0-b0e9-538c17608d6c',
                        displayName: 'mu',
                        semanticSpec: {
                            description: 'Mu analysis result',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ],
                outputs: [
                    {
                        id: 'c2417ce2-804c-4120-ae77-9eb1092d2f60',
                        displayName: 'omicron',
                        semanticSpec: {
                            description: 'Omicron analysis result',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ]
            },
            isFake: false
        },
        {
            id: 'f6c1cb5d-c79f-4659-a9ef-fb1bf0d2666d',
            displayName: 'job_10',
            url: 'https://dummy-url.com/job_10',
            semanticSpec: {
                description: 'Nu and xi combination',
                embedding: []
            },
            syntacticSpec: {
                inputs: [
                    {
                        id: 'b2bfd4d8-8a84-47c7-9ad2-495b4647a3fe',
                        displayName: 'nu',
                        semanticSpec: {
                            description: 'Nu processing output',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    },
                    {
                        id: 'ab0fdcc0-5344-47c0-a133-c37eba1649d7',
                        displayName: 'xi',
                        semanticSpec: {
                            description: 'Xi processing output',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ],
                outputs: [
                    {
                        id: '74df594a-8380-44fc-a5b8-0b67b1988c21',
                        displayName: 'pi',
                        semanticSpec: {
                            description: 'Pi enhancement result',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    },
                    {
                        id: '5cea510b-5abe-4229-bd59-fe2a9adac23a',
                        displayName: 'rho',
                        semanticSpec: {
                            description: 'Rho transformation result',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ]
            },
            isFake: false
        },
        {
            id: 'cad019ba-90c1-4e11-9c17-5834859dc127',
            displayName: 'job_11',
            url: 'https://dummy-url.com/job_11',
            semanticSpec: {
                description: 'Omicron processing',
                embedding: []
            },
            syntacticSpec: {
                inputs: [
                    {
                        id: 'c2417ce2-804c-4120-ae77-9eb1092d2f60',
                        displayName: 'omicron',
                        semanticSpec: {
                            description: 'Omicron analysis result',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ],
                outputs: [
                    {
                        id: 'f5dfba00-10b7-412b-a82e-0459721ec5f1',
                        displayName: 'sigma',
                        semanticSpec: {
                            description: 'Sigma processing result',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ]
            },
            isFake: false
        },
        {
            id: '1f698a5a-3410-4968-b32d-7fed33c1db44',
            displayName: 'job_12',
            url: 'https://dummy-url.com/job_12',
            semanticSpec: {
                description: 'Pi enhancement',
                embedding: []
            },
            syntacticSpec: {
                inputs: [
                    {
                        id: '74df594a-8380-44fc-a5b8-0b67b1988c21',
                        displayName: 'pi',
                        semanticSpec: {
                            description: 'Pi enhancement result',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ],
                outputs: [
                    {
                        id: 'cf0b35d8-c540-44c1-be22-8925cbe5e54f',
                        displayName: 'tau',
                        semanticSpec: {
                            description: 'Tau enhancement result',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ]
            },
            isFake: false
        },
        {
            id: '74ac4724-101f-4718-b0e5-dc9ec3a34975',
            displayName: 'job_13',
            url: 'https://dummy-url.com/job_13',
            semanticSpec: {
                description: 'Rho transformation',
                embedding: []
            },
            syntacticSpec: {
                inputs: [
                    {
                        id: '5cea510b-5abe-4229-bd59-fe2a9adac23a',
                        displayName: 'rho',
                        semanticSpec: {
                            description: 'Rho transformation result',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ],
                outputs: [
                    {
                        id: '46072571-5232-4159-85e3-c69abe57f902',
                        displayName: 'upsilon',
                        semanticSpec: {
                            description: 'Upsilon analysis result',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ]
            },
            isFake: false
        },
        {
            id: '29840213-5496-43b1-aaed-8afae0a58063',
            displayName: 'job_14',
            url: 'https://dummy-url.com/job_14',
            semanticSpec: {
                description: 'Sigma and tau merge',
                embedding: []
            },
            syntacticSpec: {
                inputs: [
                    {
                        id: 'f5dfba00-10b7-412b-a82e-0459721ec5f1',
                        displayName: 'sigma',
                        semanticSpec: {
                            description: 'Sigma processing result',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    },
                    {
                        id: 'cf0b35d8-c540-44c1-be22-8925cbe5e54f',
                        displayName: 'tau',
                        semanticSpec: {
                            description: 'Tau enhancement result',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ],
                outputs: [
                    {
                        id: '1a660aa1-eff0-4923-84ab-aa6c016975c4',
                        displayName: 'phi',
                        semanticSpec: {
                            description: 'Phi merge result',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ]
            },
            isFake: false
        },
        {
            id: 'afec97ab-90ee-48d9-a7b7-ac1532d8acd7',
            displayName: 'job_15',
            url: 'https://dummy-url.com/job_15',
            semanticSpec: {
                description: 'Upsilon analysis',
                embedding: []
            },
            syntacticSpec: {
                inputs: [
                    {
                        id: '46072571-5232-4159-85e3-c69abe57f902',
                        displayName: 'upsilon',
                        semanticSpec: {
                            description: 'Upsilon analysis result',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ],
                outputs: [
                    {
                        id: 'f2b1bb1a-5b1a-4ebb-ae5c-8fa5baa4646a',
                        displayName: 'chi',
                        semanticSpec: {
                            description: 'Chi analysis result',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ]
            },
            isFake: false
        },
        {
            id: '934b3f4e-7237-4e02-a60b-518a29625b1a',
            displayName: 'job_16',
            url: 'https://dummy-url.com/job_16',
            semanticSpec: {
                description: 'Phi processing',
                embedding: []
            },
            syntacticSpec: {
                inputs: [
                    {
                        id: '1a660aa1-eff0-4923-84ab-aa6c016975c4',
                        displayName: 'phi',
                        semanticSpec: {
                            description: 'Phi merge result',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ],
                outputs: [
                    {
                        id: 'd75e511c-812d-42ea-9448-f0e7223ad1e6',
                        displayName: 'psi',
                        semanticSpec: {
                            description: 'Psi processing result',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ]
            },
            isFake: false
        },
        {
            id: '1711c79f-39a0-45ba-9b9d-69e532d3b6d2',
            displayName: 'job_17',
            url: 'https://dummy-url.com/job_17',
            semanticSpec: {
                description: 'Chi and psi combination',
                embedding: []
            },
            syntacticSpec: {
                inputs: [
                    {
                        id: 'f2b1bb1a-5b1a-4ebb-ae5c-8fa5baa4646a',
                        displayName: 'chi',
                        semanticSpec: {
                            description: 'Chi analysis result',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    },
                    {
                        id: 'd75e511c-812d-42ea-9448-f0e7223ad1e6',
                        displayName: 'psi',
                        semanticSpec: {
                            description: 'Psi processing result',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ],
                outputs: [
                    {
                        id: '58012b5d-b08c-431c-9373-7a2ada255752',
                        displayName: 'omega',
                        semanticSpec: {
                            description: 'Omega combination result',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ]
            },
            isFake: false
        },
        {
            id: '2f46d89e-935e-4b39-b356-cded392d3046',
            displayName: 'job_18',
            url: 'https://dummy-url.com/job_18',
            semanticSpec: {
                description: 'Independent alpha generator',
                embedding: []
            },
            syntacticSpec: {
                inputs: [],
                outputs: [
                    {
                        id: '177087b2-74f7-445f-af64-dc5fbe10cfb8',
                        displayName: 'alpha_prime',
                        semanticSpec: {
                            description: 'Enhanced alpha prime',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ]
            },
            isFake: false
        },
        {
            id: '9b3d7f79-83fc-4ba5-a8ac-d28944303840',
            displayName: 'job_19',
            url: 'https://dummy-url.com/job_19',
            semanticSpec: {
                description: 'Alpha prime enhancement',
                embedding: []
            },
            syntacticSpec: {
                inputs: [
                    {
                        id: '177087b2-74f7-445f-af64-dc5fbe10cfb8',
                        displayName: 'alpha_prime',
                        semanticSpec: {
                            description: 'Enhanced alpha prime',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ],
                outputs: [
                    {
                        id: 'deb31076-7f0b-4583-9f9b-7c4bd615acbb',
                        displayName: 'beta_prime',
                        semanticSpec: {
                            description: 'Enhanced beta prime',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ]
            },
            isFake: false
        },
        {
            id: 'd6e2db8c-c0b1-4aaa-ae75-ab874735522d',
            displayName: 'job_20',
            url: 'https://dummy-url.com/job_20',
            semanticSpec: {
                description: 'Final omega processing',
                embedding: []
            },
            syntacticSpec: {
                inputs: [
                    {
                        id: '58012b5d-b08c-431c-9373-7a2ada255752',
                        displayName: 'omega',
                        semanticSpec: {
                            description: 'Omega combination result',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    },
                    {
                        id: 'deb31076-7f0b-4583-9f9b-7c4bd615acbb',
                        displayName: 'beta_prime',
                        semanticSpec: {
                            description: 'Enhanced beta prime',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ],
                outputs: [
                    {
                        id: '9b35b38b-a82f-4f60-b723-761f0bb9db4a',
                        displayName: 'omega_prime',
                        semanticSpec: {
                            description: 'Enhanced omega prime',
                            embedding: []
                        },
                        syntacticSpec: {
                            format: 'txt',
                            schema: null
                        }
                    }
                ]
            },
            isFake: false
        },
    ],
    links: [
        {
            from: 'c045dbc0-bab9-4214-a62c-cbe5d26bd275',
            to: '9030f534-88b5-438c-af66-15fe24cee40b',
            dataFlow: [
                'alpha'
            ]
        },
        {
            from: 'a5c1838d-f8e4-48ca-85b9-6790c378d812',
            to: '9030f534-88b5-438c-af66-15fe24cee40b',
            dataFlow: [
                'beta'
            ]
        },
        {
            from: '9030f534-88b5-438c-af66-15fe24cee40b',
            to: 'f9f76e0a-11ba-4767-94a0-34a43e757957',
            dataFlow: [
                'gamma'
            ]
        },
        {
            from: 'f9f76e0a-11ba-4767-94a0-34a43e757957',
            to: 'adaf8c9e-c5da-4d81-8760-1d2bae0b35ef',
            dataFlow: [
                'delta'
            ]
        },
        {
            from: 'f9f76e0a-11ba-4767-94a0-34a43e757957',
            to: 'a46cb6fb-7f26-4c3b-964e-7e1bcab0ae45',
            dataFlow: [
                'epsilon'
            ]
        },
        {
            from: 'adaf8c9e-c5da-4d81-8760-1d2bae0b35ef',
            to: 'd8bbac90-bea6-49e1-bcf4-8f5dfc9e4be7',
            dataFlow: [
                'zeta'
            ]
        },
        {
            from: 'a46cb6fb-7f26-4c3b-964e-7e1bcab0ae45',
            to: 'd8bbac90-bea6-49e1-bcf4-8f5dfc9e4be7',
            dataFlow: [
                'eta'
            ]
        },
        {
            from: 'a46cb6fb-7f26-4c3b-964e-7e1bcab0ae45',
            to: 'e2ed41ef-1288-439b-9422-772c01ef05f0',
            dataFlow: [
                'theta'
            ]
        },
        {
            from: 'd8bbac90-bea6-49e1-bcf4-8f5dfc9e4be7',
            to: '52b05366-6fec-4a71-90ba-169b5a54913b',
            dataFlow: [
                'iota'
            ]
        },
        {
            from: 'e2ed41ef-1288-439b-9422-772c01ef05f0',
            to: '52b05366-6fec-4a71-90ba-169b5a54913b',
            dataFlow: [
                'kappa'
            ]
        },
        {
            from: 'e2ed41ef-1288-439b-9422-772c01ef05f0',
            to: '4e0825f7-d5b3-43bb-873c-dd7c1876c312',
            dataFlow: [
                'lambda'
            ]
        },
        {
            from: '52b05366-6fec-4a71-90ba-169b5a54913b',
            to: 'c6a0f720-1b9b-4564-829d-4793c354ac2c',
            dataFlow: [
                'mu'
            ]
        },
        {
            from: '4e0825f7-d5b3-43bb-873c-dd7c1876c312',
            to: 'f6c1cb5d-c79f-4659-a9ef-fb1bf0d2666d',
            dataFlow: [
                'nu',
                'xi'
            ]
        },
        {
            from: 'c6a0f720-1b9b-4564-829d-4793c354ac2c',
            to: 'cad019ba-90c1-4e11-9c17-5834859dc127',
            dataFlow: [
                'omicron'
            ]
        },
        {
            from: 'f6c1cb5d-c79f-4659-a9ef-fb1bf0d2666d',
            to: '1f698a5a-3410-4968-b32d-7fed33c1db44',
            dataFlow: [
                'pi'
            ]
        },
        {
            from: 'f6c1cb5d-c79f-4659-a9ef-fb1bf0d2666d',
            to: '74ac4724-101f-4718-b0e5-dc9ec3a34975',
            dataFlow: [
                'rho'
            ]
        },
        {
            from: 'cad019ba-90c1-4e11-9c17-5834859dc127',
            to: '29840213-5496-43b1-aaed-8afae0a58063',
            dataFlow: [
                'sigma'
            ]
        },
        {
            from: '1f698a5a-3410-4968-b32d-7fed33c1db44',
            to: '29840213-5496-43b1-aaed-8afae0a58063',
            dataFlow: [
                'tau'
            ]
        },
        {
            from: '74ac4724-101f-4718-b0e5-dc9ec3a34975',
            to: 'afec97ab-90ee-48d9-a7b7-ac1532d8acd7',
            dataFlow: [
                'upsilon'
            ]
        },
        {
            from: '29840213-5496-43b1-aaed-8afae0a58063',
            to: '934b3f4e-7237-4e02-a60b-518a29625b1a',
            dataFlow: [
                'phi'
            ]
        },
        {
            from: 'afec97ab-90ee-48d9-a7b7-ac1532d8acd7',
            to: '1711c79f-39a0-45ba-9b9d-69e532d3b6d2',
            dataFlow: [
                'chi'
            ]
        },
        {
            from: '934b3f4e-7237-4e02-a60b-518a29625b1a',
            to: '1711c79f-39a0-45ba-9b9d-69e532d3b6d2',
            dataFlow: [
                'psi'
            ]
        },
        {
            from: '2f46d89e-935e-4b39-b356-cded392d3046',
            to: '9b3d7f79-83fc-4ba5-a8ac-d28944303840',
            dataFlow: [
                'alpha_prime'
            ]
        },
        {
            from: '1711c79f-39a0-45ba-9b9d-69e532d3b6d2',
            to: 'd6e2db8c-c0b1-4aaa-ae75-ab874735522d',
            dataFlow: [
                'omega'
            ]
        },
        {
            from: '9b3d7f79-83fc-4ba5-a8ac-d28944303840',
            to: 'd6e2db8c-c0b1-4aaa-ae75-ab874735522d',
            dataFlow: [
                'beta_prime'
            ]
        }
    ]
}
*/
/*
const workflowSpec: WorkflowSpec = {
    workflow: workflow,
    inputMaps: [
        { // ATTENTION: must be runtime-validated against the workflow
            alpha: 'alpha_path',
            beta: 'beta_path',
        }
    ]
}
*/
export async function runRemoteGraph() {
    console.log('runRemoteGraph called but temporarily disabled for testing');
    return;
    // Commented out for testing
    /*
    try {
        // Create a thread (or use an existing thread instead)
        const thread = await client.threads.create();
        console.log('thread :', thread);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 1800000); // 30 minutes
        console.log('timeout :', timeout);

        try {
            // console.log('Invoking the graph')
            const result = await remoteGraph.invoke({
                messages: [new HumanMessage('Graph is invoked')],
                dryModeManager: {
                    dryRunMode: true,
                    delay: 1000,
                    drySocketMode: true,
                },
                workflowSpec: workflowSpec,
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
    */
}
