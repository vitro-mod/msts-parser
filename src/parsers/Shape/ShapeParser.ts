import { MstsShape } from "../../types/MstsShape";
import { BaseParser } from "../BaseParser";
import { BinaryShapeParser } from "./BinaryShapeParser";
import { UnicodeShapeParser } from "./UnicodeShapeParser";
import { IMstsParser } from "../IMstsParser";

export class ShapeParser extends BaseParser implements IMstsParser<MstsShape> {

    parse(): Promise<MstsShape> {

        if (this.isMstsDataTree(this.data)) {
            return new UnicodeShapeParser(this.data).parse();
        } else if (this.isMstsDataBuffer(this.data)) {
            return new BinaryShapeParser(this.data).parse();
        }

        throw new Error("Unsupported MstsData type");
    }
}
