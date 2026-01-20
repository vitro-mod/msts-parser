import { MstsDataTree } from "../utils/MstsData";
import { MstsObject } from "../types/MstsObject";
import { IMstsParser } from "./IMstsParser";
import { TokenID } from "./TokenID";

export abstract class UnicodeParser implements IMstsParser<MstsObject> {

    data: MstsDataTree;

    constructor(mstsFile: MstsDataTree) {
        this.data = mstsFile;
    }

    abstract parse(): Promise<MstsObject>;

    protected forEach(data: string | MstsDataTree, tokenName: string, callback: Function): void {
        for (let i = 0; i < data.length; i++) {

            const element = data[i];

            if (typeof element !== "string") continue;
            if (element.toLowerCase() !== tokenName) continue;

            if (typeof data[i + 1] === "string") {
                callback(data[i + 2], data[i + 1]);
            } else {
                callback(data[i + 1]);
            }
        }
    }

    getTokenName(tokenId: TokenID): string {
        return TokenID[tokenId].toLowerCase();
    }
}
