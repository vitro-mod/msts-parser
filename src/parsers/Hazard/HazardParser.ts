import { BaseParser } from "../BaseParser";
import { MstsHazard } from "../../types/MstsHazard";
import { IMstsParser } from "../IMstsParser";
import { UnicodeHazardParser } from "./UnicodeHazardParser";

export class HazardParser extends BaseParser implements IMstsParser<MstsHazard> {

    parse(): Promise<MstsHazard> {

        if (this.isMstsDataTree(this.data)) {
            return new UnicodeHazardParser(this.data).parse();
        }

        throw new Error("Unsupported MstsData type");
    }
}