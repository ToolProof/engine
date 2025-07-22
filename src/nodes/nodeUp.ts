import { NodeBase, GraphState, ResourceMap } from '../types.js';
import { Storage } from '@google-cloud/storage';
import { RunnableConfig } from '@langchain/core/runnables';
import { AIMessage } from '@langchain/core/messages';
import WebSocket from 'ws';


export class NodeUp extends NodeBase {

    constructor() {
        super();
    }

    async invoke(state: GraphState, options?: Partial<RunnableConfig<Record<string, any>>>): Promise<Partial<GraphState>> {

        if (!state.dryModeManager.drySocketMode) {

            // Connect to WebSocket server
            const ws = new WebSocket('https://service-websocket-384484325421.europe-west2.run.app');

            ws.on('open', () => {
                ws.send(JSON.stringify({
                    node: 'NodeUp',
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
                messages: [new AIMessage('NodeUp completed in DryRun mode')],
            };
        }

        try {

            const storage = new Storage();

            const resourceMapAugmentedWithPath: ResourceMap = {};

            for (const unit of this.spec.units) {
                const value = state.resourceMap[unit.key].value;

                const timestamp = new Date().toISOString();
                const outputPath = unit.path.replace('timestamp', timestamp);

                await storage
                    .bucket(process.env.BUCKET_NAME!)
                    .file(outputPath)
                    .save(value, {
                        contentType: 'text/plain',
                    });

                resourceMapAugmentedWithPath[unit.key] = {
                    ...state.resourceMap[unit.key],
                    path: `${outputPath}`,
                };
            }

            return {
                messages: [new AIMessage('NodeUp completed')],
                resourceMap: {
                    ...state.resourceMap,
                    ...resourceMapAugmentedWithPath,
                }
            };
        } catch (error: any) {
            console.error('Error in NodeUp:', error);
            return {
                messages: [new AIMessage('NodeUp failed')],
            };
        }

    }

}



