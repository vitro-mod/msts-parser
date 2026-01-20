import { BaseParser } from "./BaseParser";
import { MstsRaw } from "../types/MstsRaw";
import { IMstsParser } from "./IMstsParser";

export class MstsRawParser extends BaseParser implements IMstsParser<MstsRaw> {

    async parse(): Promise<MstsRaw> {

        if (this.isMstsDataBuffer(this.data)) {
            return new MstsRaw(this.data);
        }

        throw new Error("Unsupported MstsData type");
    }
}
