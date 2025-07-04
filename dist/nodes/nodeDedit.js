import { NodeBase } from '../types.js';
import { Storage } from '@google-cloud/storage';
import { AIMessage } from '@langchain/core/messages';
import WebSocket from 'ws';
export class NodeDedit extends NodeBase {
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
                    node: 'NodeDedit',
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
                messages: [new AIMessage('NodeDedit completed in DryRun mode')],
            };
        }
        try {
            const storage = new Storage();
            const resourceMapAugmentedWithPath = {};
            for (const inputSpec of this.spec.units) {
                const value = state.resourceMap[inputSpec.key].value;
                const timestamp = new Date().toISOString();
                const outputPath = inputSpec.path.replace('timestamp', timestamp);
                await storage
                    .bucket(process.env.BUCKET_NAME)
                    .file(outputPath)
                    .save(value, {
                    contentType: 'text/plain',
                });
                resourceMapAugmentedWithPath[inputSpec.key] = {
                    ...state.resourceMap[inputSpec.key],
                    path: `${outputPath}`,
                };
            }
            return {
                messages: [new AIMessage('NodeDedit completed')],
                resourceMap: {
                    ...state.resourceMap,
                    ...resourceMapAugmentedWithPath,
                }
            };
        }
        catch (error) {
            console.error('Error in NodeDedit:', error);
            return {
                messages: [new AIMessage('NodeDedit failed')],
            };
        }
    }
}
