import { NodeBase } from '../types.js';
import { AIMessage } from '@langchain/core/messages';
import WebSocket from 'ws';
export class NodeNomen extends NodeBase {
    constructor(spec) {
        super();
        this.spec = spec;
    }
    async invoke(state, options) {
        if (!state.dryModeManager.drySocketMode) {
            // Connect to WebSocket server
            const ws = new WebSocket('https://service-websocket-384484325421.europe-west2.run.app');
            ws.on('open', () => {
                ws.send(JSON.stringify({
                    node: 'NodeNomen',
                }));
                ws.close();
            });
            ws.on('error', (error) => {
                console.error('WebSocket Error:', error);
            });
        }
        if (state.dryModeManager.dryRunMode) {
            await new Promise(resolve => setTimeout(resolve, state.dryModeManager.delay));
            return {
                messages: [new AIMessage('NodeNomen completed in DryRun mode')],
            };
        }
        try {
            const inputs = [];
            Object.entries(state.resourceMap).forEach(([key, resource]) => {
                if (this.spec.inputs.includes(key)) {
                    inputs.push(resource.value);
                }
            });
            const result = await this.spec.interMorphism(...inputs);
            const extraResources = this.spec.outputs.reduce((acc, output) => {
                acc[output] = {
                    path: '',
                    value: result[output],
                };
                return acc;
            }, {});
            return {
                messages: [new AIMessage('NodeNomen completed')],
                resourceMap: {
                    ...state.resourceMap,
                    ...extraResources,
                }
            };
        }
        catch (error) {
            console.error('Error in NodeNomen:', error);
            return {
                messages: [new AIMessage('NodeNomen failed')],
            };
        }
    }
}
