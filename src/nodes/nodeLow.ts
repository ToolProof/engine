import { NodeBase, GraphState, InputMap } from '../types/typesLG.js';
import { RunnableConfig } from '@langchain/core/runnables';
import { AIMessage } from '@langchain/core/messages';
import WebSocket from 'ws';


export class NodeLow extends NodeBase {

    constructor() {
        super();
    }

    async invoke(state: GraphState, options?: Partial<RunnableConfig<Record<string, any>>>): Promise<Partial<GraphState>> {

        if (!state.dryModeManager.drySocketMode) {

            // Connect to WebSocket server
            const ws = new WebSocket('https://service-websocket-384484325421.europe-west2.run.app');

            ws.on('open', () => {
                ws.send(JSON.stringify({
                    node: 'NodeLow',
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
                messages: [new AIMessage('NodeLow completed in DryRun mode')],
            };
        }

        try {

            const inputs: any[] = [];

            Object.entries(state.resourceMap).forEach(([key, resource]) => {
                if (this.spec.inputs.includes(key)) {
                    inputs.push(resource.value);
                }
            });

            const result = await this.spec.interMorphism(...inputs);

            const extraResources: InputMap = this.spec.outputs.reduce((acc, output) => {
                acc[output] = {
                    path: '',
                    value: result[output as Outputs[number]],
                }
                return acc;
            }, {} as InputMap);

            return {
                messages: [new AIMessage('NodeLow completed')],
                resourceMap: {
                    ...state.resourceMap,
                    ...extraResources,
                }
            };
        } catch (error: any) {
            console.error('Error in NodeLow:', error);
            return {
                messages: [new AIMessage('NodeLow failed')],
            };
        }
    }

}




