import { Buffer } from "buffer";
import { IMstsReader } from "./IMstsReader";
import { MstsDataBuffer } from "../utils/MstsData";

export class MstsRawReader implements IMstsReader {

    constructor(buffer: Buffer) {
        this.buffer = buffer;
    }

    buffer: Buffer<ArrayBufferLike>;

    read(): MstsDataBuffer {
        return <MstsDataBuffer>this.buffer;
    }
}