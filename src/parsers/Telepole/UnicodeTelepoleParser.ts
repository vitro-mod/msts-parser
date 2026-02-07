import { MstsTelepoleConfigData, TelepoleConfig } from "../../types/MstsTelepole";
import { IMstsParser } from "../IMstsParser";
import { UnicodeParser } from "../UnicodeParser";

export class UnicodeTelepoleParser extends UnicodeParser implements IMstsParser<MstsTelepoleConfigData> {

    async parse(): Promise<MstsTelepoleConfigData> {

        const result = new MstsTelepoleConfigData();

        if (typeof this.data[0] !== "string" || this.data[0].toLowerCase() !== "tpoleconfigdata") {
            throw new Error("This is not a MSTS TPoleConfigData!");
        }

        const root = this.data[1];

        const parseConfig = (data: any): TelepoleConfig => {
            const config: TelepoleConfig = {
                fileName: "",
                wires: []
            };

            this.forEach(data, "filename", (a: any) => {
                config.fileName = a[0];
            });
            this.forEach(data, "shadow", (a: any) => {
                config.shadowFileName = a[0];
            });
            this.forEach(data, "separation", (a: any) => {
                config.separation = parseFloat(a[0]);
            });
            this.forEach(data, "wire", (a: any) => {
                config.wires.push({
                    x: parseFloat(a[0]),
                    y: parseFloat(a[1]),
                    z: parseFloat(a[2])
                });
            });

            return config;
        };

        this.forEach(root, "tpoleconfig", (a: any) => {
            result.configs.push(parseConfig(a));
        });

        return result;
    }
}
