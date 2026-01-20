import { MstsDataBuffer } from "../utils/MstsData";
import { MstsObject } from "../types/MstsObject";
import { IMstsParser } from "./IMstsParser";
import { TokenID } from "./TokenID";

export abstract class BinaryParser implements IMstsParser<MstsObject> {

    buffer: MstsDataBuffer;
    offset: number = 16;
    tokens: { [k: string]: string; };

    // Cache DataView for faster access (optional)
    private dataView?: DataView;

    constructor(mstsFile: MstsDataBuffer) {
        this.buffer = mstsFile;
        this.tokens = Object.fromEntries(Object.entries(TokenID).map(([key, value]) => [value, key]));
        
        // DataView for optimal primitive reading
        this.dataView = new DataView(
            mstsFile.buffer,
            mstsFile.byteOffset,
            mstsFile.byteLength
        );
    }

    abstract parse(): Promise<MstsObject>;

    getStringU(len: number): string {
        const s = this.buffer.toString("utf16le", this.offset, this.offset + 2 * len);
        this.offset += 2 * len;
        return s;
    }

    getString(): string {
        const len = this.buffer.readUInt8(this.offset);
        this.offset++;
        return this.getStringU(len);
    }

    // Optimized methods with DataView
    getInt(): number {
        const n = this.dataView!.getInt32(this.offset, true); // littleEndian
        this.offset += 4;
        return n;
    }

    getShort(): number {
        const n = this.dataView!.getUint16(this.offset, true);
        this.offset += 2;
        return n;
    }

    getFloat(): number {
        const n = this.dataView!.getFloat32(this.offset, true);
        this.offset += 4;
        return n;
    }

    getByte(): number {
        const n = this.dataView!.getUint8(this.offset);
        this.offset++;
        return n;
    }

    skip(n: number): void {
        this.offset += n;
    }
}
