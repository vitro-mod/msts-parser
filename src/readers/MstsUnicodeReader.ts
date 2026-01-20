import { MstsDataTree } from '../utils/MstsData';
import { IMstsReader } from './IMstsReader';
import { Buffer } from "buffer";

export class MstsUnicodeReader implements IMstsReader {

    buffer: Buffer;
    private text: string;
    private position: number;
    private length: number;

    constructor(buffer: Buffer) {
        this.buffer = buffer;
        this.text = buffer.toString('utf16le');
        this.position = 0;
        this.length = this.text.length;
    }

    read(): MstsDataTree {
        return this.parseList();
    }

    private parseList(): MstsDataTree {
        const rootList: MstsDataTree = [];
        const stack: MstsDataTree[] = [rootList];
        
        while (this.position < this.length) {
            const token = this.readToken();
            
            if (token === null) {
                break;
            }
            
            // Skip JINX header
            if (token.includes('JINX0')) {
                continue;
            }
            
            const currentList = stack[stack.length - 1];
            
            if (token === '(') {
                // Start of a new nested structure
                const newList: MstsDataTree = [];
                currentList.push(newList);
                stack.push(newList);
            } else if (token === ')') {
                // End of current structure
                stack.pop();
                
                // If the stack is empty, we've closed the root structure
                if (stack.length === 0) {
                    break;
                }
            } else {
                // Regular token - add to current list
                currentList.push(token);
            }
        }
        
        // Return the first element of the root (compatibility with recursive version)
        return stack[0];
    }

    private readToken(): string | null {
        this.skipWhitespace();
        
        if (this.position >= this.length) {
            return null;
        }

        const char = this.text[this.position];

        if (char === '(' || char === ')') {
            this.position++;
            return char;
        }

        if (char === '"') {
            return this.readQuotedString();
        }

        return this.readUnquotedToken();
    }

    private readQuotedString(): string {
        this.position++; // Skip opening "
        const start = this.position;
        let hasEscapes = false;
        
        // Fast pass to find the end of the string
        while (this.position < this.length && this.text[this.position] !== '"') {
            if (this.text[this.position] === '\\') {
                hasEscapes = true;
                this.position += 2; // Skip \ and the next character
            } else {
                this.position++;
            }
        }
        
        const end = this.position;
        this.position++; // Skip closing "
        
        // If there are no escape sequences, return substring directly
        if (!hasEscapes) {
            return this.text.substring(start, end);
        }
        
        // Process escape sequences
        let result = '';
        let i = start;
        while (i < end) {
            const char = this.text[i];
            if (char === '\\' && i + 1 < end) {
                i++;
                const nextChar = this.text[i];
                result += nextChar === 'n' ? '\n' : nextChar;
            } else {
                result += char;
            }
            i++;
        }
        
        return result;
    }

    private readUnquotedToken(): string {
        const start = this.position;
        
        while (this.position < this.length) {
            const char = this.text[this.position];
            
            if (this.isWhitespace(char) || char === '(' || char === ')') {
                break;
            }
            
            this.position++;
        }
        
        return this.text.substring(start, this.position);
    }

    private skipWhitespace(): void {
        while (this.position < this.length && this.isWhitespace(this.text[this.position])) {
            this.position++;
        }
    }

    private isWhitespace(char: string): boolean {
        const code = char.charCodeAt(0);
        // space, tab, \n, \r
        return code === 32 || code === 9 || code === 10 || code === 13;
    }
}
