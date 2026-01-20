import { MstsRoute } from "../../types/MstsRoute";
import { BaseParser } from "../BaseParser";
import { IMstsParser } from "../IMstsParser";
import { UnicodeRouteParser } from "./UnicodeRouteParser";

export class RouteParser extends BaseParser implements IMstsParser<MstsRoute> {

    async parse(): Promise<MstsRoute> {

        if (this.isMstsDataTree(this.data)) {
            return new UnicodeRouteParser(this.data).parse();
        }

        throw new Error("Unsupported MstsData type");
    }
}
