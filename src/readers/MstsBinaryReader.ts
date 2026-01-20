import * as pako from 'pako';
import { MstsDataBuffer } from '../utils/MstsData';
import { IMstsReader } from './IMstsReader';
import { Buffer } from "buffer";

export class MstsBinaryReader implements IMstsReader {

    buffer: Buffer;
    isCompressed: boolean;

    constructor(buffer: Buffer, isCompressed: boolean) {
        this.buffer = buffer;
        this.isCompressed = isCompressed;
    }

    read(): MstsDataBuffer {
        if (!this.isCompressed) {
            return this.buffer as MstsDataBuffer;
        }

        const inflated = pako.inflate(this.buffer);

        return Buffer.from(inflated.buffer, inflated.byteOffset, inflated.byteLength) as MstsDataBuffer;
    }
}
