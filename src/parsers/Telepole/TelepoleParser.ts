import { BaseParser } from "../BaseParser";
import { MstsTelepoleConfigData } from "../../types/MstsTelepole";
import { IMstsParser } from "../IMstsParser";
import { UnicodeTelepoleParser } from "./UnicodeTelepoleParser";

export class TelepoleParser extends BaseParser implements IMstsParser<MstsTelepoleConfigData> {

    async parse(): Promise<MstsTelepoleConfigData> {

        if (this.isMstsDataTree(this.data)) {
            return new UnicodeTelepoleParser(this.data).parse();
        }

        throw new Error("Unsupported MstsData type");
    }
}
