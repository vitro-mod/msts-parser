import { BaseParser } from "../BaseParser";
import { MstsTexture } from "../../types/MstsTexture";
import { IMstsParser } from "../IMstsParser";
import { BinaryTextureParser } from "./BinaryTextureParser";

export class TextureParser extends BaseParser implements IMstsParser<MstsTexture> {

    async parse(): Promise<MstsTexture> {

        if (this.isMstsDataBuffer(this.data)) {
            return new BinaryTextureParser(this.data).parse();
        }

        throw new Error("Unsupported MstsData type");
    }
}
