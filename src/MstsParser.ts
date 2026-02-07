import { Buffer } from 'buffer';
import { MstsData } from "./utils/MstsData";
import { MstsObject } from "./types/MstsObject";
import { HazardParser } from "./parsers/Hazard/HazardParser";
import { IMstsParser } from "./parsers/IMstsParser";
import { MstsRawParser } from "./parsers/MstsRawParser";
import { RouteParser } from "./parsers/Route/RouteParser";
import { ShapeParser } from "./parsers/Shape/ShapeParser";
import { TextureParser } from "./parsers/Texture/TextureParser";
import { TelepoleParser } from "./parsers/Telepole/TelepoleParser";
import { TileParser } from "./parsers/TIle/TileParser";
import { WorldParser } from "./parsers/World/WorldParser";
import { IMstsReader } from "./readers/IMstsReader";
import { MstsBinaryReader } from "./readers/MstsBinaryReader";
import { MstsRawReader } from "./readers/MstsRawReader";
import { MstsUnicodeReader } from "./readers/MstsUnicodeReader";

export class MstsParser {

    async parse(dataBuffer: ArrayBuffer, url: string): Promise<MstsObject> {
        const reader = this.createReader(Buffer.from(dataBuffer), url);
        const data = reader.read();

        const parser = this.createParser(data, url);
        // console.time(`MSTS Parse ${url}`);
        const result = parser.parse();
        // console.timeEnd(`MSTS Parse ${url}`);

        return result;
    }

    private createReader(buffer: Buffer, url: string): IMstsReader {

        if (buffer.toString("ascii", 0, 6) === "SIMISA") {
            const isCompressed = buffer.toString("ascii", 7, 8) === "F";
            return new MstsBinaryReader(buffer.subarray(16), isCompressed);
        } else if (buffer.toString("utf-16le", 2, 16) === 'SIMISA@') {
            return new MstsUnicodeReader(buffer);
        } else if (url.split('.').at(-1) === 'raw') {
            return new MstsRawReader(buffer);
        }

        throw new Error(`MstsFileLoader: Unknown format! ${url}`);
    }

    private createParser(mstsData: MstsData, url: string): IMstsParser<MstsObject> {

        if (Array.isArray(mstsData) && typeof mstsData[0] === "string" && mstsData[0].toLowerCase() === "tpoleconfigdata") {
            return new TelepoleParser(mstsData);
        }

        switch (url.split('.').at(-1)?.toLowerCase()) {
            case 'ace':
                return new TextureParser(mstsData);
            case 's':
                return new ShapeParser(mstsData);
            case 'w':
                return new WorldParser(mstsData);
            case 'trk':
                return new RouteParser(mstsData);
            case 't':
                return new TileParser(mstsData);
            case 'haz':
                return new HazardParser(mstsData);
            case 'raw':
                return new MstsRawParser(mstsData);
        }

        throw new Error('MstsLoader: Unknown MstsObject type!');
    }
}
