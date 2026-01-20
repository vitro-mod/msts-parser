import { BaseParser } from "../BaseParser";
import { MstsTile } from "../../types/MstsTile";
import { IMstsParser } from "../IMstsParser";
import { BinaryTileParser } from "./BinaryTileParser";

export class TileParser extends BaseParser implements IMstsParser<MstsTile> {

    async parse(): Promise<MstsTile> {

        if (this.isMstsDataBuffer(this.data)) {
            return new BinaryTileParser(this.data).parse();
        }

        throw new Error("Unsupported MstsData type");
    }
}