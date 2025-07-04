import { Annotation, MessagesAnnotation } from '@langchain/langgraph';
import { Runnable } from '@langchain/core/runnables';
export const GraphStateAnnotationRoot = Annotation.Root({
    ...MessagesAnnotation.spec,
    dryModeManager: Annotation({
        reducer: (prev, next) => next,
        default: () => ({
            dryRunMode: false,
            delay: 0,
            drySocketMode: false,
        }),
    }),
    resourceMap: Annotation(),
});
export class NodeBase extends Runnable {
    constructor() {
        super(...arguments);
        this.lc_namespace = []; // ATTENTION: Assigning an empty array for now to honor the contract with the Runnable class, which implements RunnableInterface.
    }
}
