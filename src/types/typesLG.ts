import { WorkflowSpec } from './typesWF';
import { Annotation, MessagesAnnotation } from '@langchain/langgraph';
import { Runnable, RunnableConfig } from '@langchain/core/runnables';
import { AIMessage } from '@langchain/core/messages';
import WebSocket from 'ws';


export const GraphStateAnnotationRoot = Annotation.Root({
    ...MessagesAnnotation.spec,
    dryModeManager: Annotation<{
        dryRunMode: boolean;
        delay: number;
        drySocketMode: boolean;
    }>(
        {
            reducer: (prev, next) => next,
            default: () => ({
                dryRunMode: false,
                delay: 0,
                drySocketMode: false,
            }),
        }
    ),
    workflowSpec: Annotation<WorkflowSpec>(),
});

export type GraphState = typeof GraphStateAnnotationRoot.State;

export abstract class BaseNode extends Runnable {
    protected nodeName: string;

    constructor(nodeName: string) {
        super();
        this.nodeName = nodeName;
    }

    lc_namespace = [];

    // Template method - handles common logic
    async invoke(state: GraphState, options?: Partial<RunnableConfig<Record<string, any>>>): Promise<Partial<GraphState>> {
        
        // Handle WebSocket notification
        if (!state.dryModeManager.drySocketMode) {
            await this.sendWebSocketNotification();
        }

        // Handle dry run mode
        if (state.dryModeManager.dryRunMode) {
            await new Promise(resolve => setTimeout(resolve, state.dryModeManager.delay));
            return {
                messages: [new AIMessage(`${this.nodeName} completed in DryRun mode`)],
            };
        }

        // Execute the actual node logic
        return await this.executeNode(state, options);
    }

    // Abstract method for subclasses to implement their specific logic
    protected abstract executeNode(state: GraphState, options?: Partial<RunnableConfig<Record<string, any>>>): Promise<Partial<GraphState>>;

    private async sendWebSocketNotification(): Promise<void> {
        try {
            const ws = new WebSocket('https://service-websocket-384484325421.europe-west2.run.app');
            
            ws.on('open', () => {
                ws.send(JSON.stringify({
                    node: this.nodeName,
                }));
                ws.close();
            });

            ws.on('error', (error) => {
                console.error('WebSocket Error:', error);
            });
        } catch (error) {
            console.error('Failed to send WebSocket notification:', error);
        }
    }
}