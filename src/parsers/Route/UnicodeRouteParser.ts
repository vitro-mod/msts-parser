import { MstsRoute } from "../../types/MstsRoute";
import { IMstsParser } from "../IMstsParser";
import { UnicodeParser } from "../UnicodeParser";

export class UnicodeRouteParser extends UnicodeParser implements IMstsParser<MstsRoute> {

    async parse(): Promise<MstsRoute> {

        const result = new MstsRoute();

        if (typeof this.data[0] != "string" || this.data[0].toLowerCase() != "tr_routefile") {
            throw new Error('This is not a MSTS Route trk!');
        }

        const root = this.data[1];

        for (let i = 0; i < root.length; i++) {
            if (typeof root[i] != "string") continue;

            const key = (root[i] as string).toLowerCase();
            const value = root[i + 1];

            switch (key) {
                case 'routestart':
                    result.routeStart = {
                        tileX: parseInt(<string>value[0]),
                        tileZ: parseInt(<string>value[1]),
                        x: parseFloat(<string>value[2]),
                        z: parseFloat(<string>value[3]),
                    };
                    break;
            }
        }

        return result;
    }
}
