import { BaseParser } from "../BaseParser";
import { BinaryWorldParser } from "./BinaryWorldParser";
import { UnicodeWorldParser } from "./UnicodeWorldParser";
import { IMstsParser } from "../IMstsParser";
import { MstsWorld } from "../../types/MstsWorld";

export class WorldParser extends BaseParser implements IMstsParser<MstsWorld> {

    async parse(): Promise<MstsWorld> {

        if (this.isMstsDataTree(this.data)) {
            return new UnicodeWorldParser(this.data).parse();
        } else if (this.isMstsDataBuffer(this.data)) {
            return new BinaryWorldParser(this.data).parse();
        }

        throw new Error("Unsupported MstsData type");
    }
}
