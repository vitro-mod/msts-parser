import { TokenID } from "./TokenID";

interface ContextFrame {
    type: TokenID;
    data: any;
    endOffset: number; // when offset reaches this value, the block is finished
}

export class ParserContext {
    private stack: Array<ContextFrame> = [];

    /**
     * Add a token to the context
     * @param type Token type
     * @param data Token data
     * @param endOffset Offset at which the block ends (offset0 + len)
     */
    push(type: TokenID, data: any, endOffset: number): void {
        this.stack.push({ type, data, endOffset });
    }

    pop(): void {
        this.stack.pop();
    }

    /**
     * Remove all blocks from the stack that have already finished
     * @param currentOffset Current offset in the buffer
     */
    popFinishedBlocks(currentOffset: number): void {
        // Remove all blocks from the end where currentOffset >= endOffset
        while (this.stack.length > 0 && currentOffset >= this.stack[this.stack.length - 1].endOffset) {
            this.stack.pop();
        }
    }

    get<TData>(type: TokenID): TData | null {
        for (let i = this.stack.length - 1; i >= 0; i--) {
            if (this.stack[i].type === type) {
                return this.stack[i].data as TData;
            }
        }
        return null;
    }

    has(type: TokenID): boolean {
        return this.stack.some(ctx => ctx.type === type);
    }

    clear(): void {
        this.stack = [];
    }
}
