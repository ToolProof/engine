import { NodeBase } from '../types.js';
import { AIMessage } from '@langchain/core/messages';
import * as path from 'path';
import axios from 'axios';
import WebSocket from 'ws';
export class NodeHigh extends NodeBase {
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
                    node: 'NodeHigh',
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
                messages: [new AIMessage('NodeHigh completed in DryRun mode')],
            };
        }
        try {
            const foo = async (url, inputKeys, outputDir) => {
                // Here we must invoke the service at the given URL
                // This function cannot know about anything specific to Ligandokreado
                // spec must specify all neccessary parameters
                // Maybe the tool only needs to return the output keys...
                let payload = {};
                inputKeys.forEach((key) => {
                    const toBeStrippedAway = 'https://storage.googleapis.com/'; // ATTENTION: temporary hack
                    let strippedPath = state.resourceMap[key].path.replace(toBeStrippedAway, '');
                    console.log('strippedPath:', strippedPath);
                    strippedPath = key === 'candidate' ? `${process.env.BUCKET_NAME}/${strippedPath}` : strippedPath; // ATTENTION: temporary hack
                    payload[key] = `${strippedPath}`;
                });
                payload = {
                    ...payload,
                    outputDir: `${process.env.BUCKET_NAME}/${outputDir}`,
                };
                console.log('payload:', JSON.stringify(payload, null, 2));
                const response = await axios.post(url, payload, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 30 * 60 * 1000, // 30 minutes in milliseconds
                });
                const result = response.data;
                console.log('result tool:', JSON.stringify(result, null, 2));
                return result.result.uploaded_files;
            };
            const outputDir = path.dirname(state.resourceMap[this.spec.outputDir].path); // ATTENTION: temporary hack 
            const outputFiles = await foo(this.spec.interMorphism(), this.spec.inputs, outputDir);
            const extraResources = outputFiles.reduce((acc, file) => {
                let path2 = path.join(outputDir, file);
                console.log('path2:', path2);
                path2 = `https://storage.googleapis.com/${process.env.BUCKET_NAME}/${path2}`; // ATTENTION: temporary hack
                acc[file.split('.')[0]] = {
                    path: path2,
                    value: null,
                };
                return acc;
            }, {});
            return {
                messages: [new AIMessage('NodeHigh completed')],
                resourceMap: {
                    ...state.resourceMap,
                    ...extraResources,
                }
            };
        }
        catch (error) {
            console.error('Error in NodeHigh:', error);
            return {
                messages: [new AIMessage('NodeHigh failed')],
            };
        }
    }
}
