import { MstsHazard } from "../../types/MstsHazard";
import { IMstsParser } from "../IMstsParser";
import { UnicodeParser } from "../UnicodeParser";

export class UnicodeHazardParser extends UnicodeParser implements IMstsParser<MstsHazard> {

    async parse(): Promise<MstsHazard> {

        const result = new MstsHazard();

        if (typeof this.data[0] != "string" || this.data[0].toLowerCase() != "tr_worldfile") {
            throw new Error('This is not a MSTS Hazard!');
        }

        const root = this.data[1];

        for (let i = 0; i < root.length; i++) {
            const rootI = root[i];
            if (typeof rootI != "string") continue;

            const lower = rootI.toLowerCase();

            switch (lower) {
                case 'filename':
                    result.shape = root[i + 1][0] as string;
                    break;
            }
        }

        return result;
    }

}