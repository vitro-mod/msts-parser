import { MstsWorld } from "../../types/MstsWorld";
import { IMstsParser } from "../IMstsParser";
import { UnicodeParser } from "../UnicodeParser";

export class UnicodeWorldParser extends UnicodeParser implements IMstsParser<MstsWorld> {

    async parse(): Promise<MstsWorld> {

        const result = new MstsWorld();

        if (typeof this.data[0] != "string" || this.data[0].toLowerCase() != "tr_worldfile") {
            throw new Error('This is not a MSTS World!');
        }

        const root = this.data[1];

        let object: any = null;

        const addObject = (type: string, a: any) => {
            object = { type: type };

            result.objects.push(object);

            this.forEach(a, "filename", (a: any) => {
                object.filename = a[0];
            });
            this.forEach(a, "position", (a: any) => {
                object.position = [parseFloat(a[0]),
                parseFloat(a[1]), parseFloat(a[2])];
            });
            this.forEach(a, "qdirection", (a: any) => {
                object.qdirection = [parseFloat(a[0]),
                parseFloat(a[1]), parseFloat(a[2]),
                parseFloat(a[3])];
            });
            this.forEach(a, "matrix3x3", (a: any) => {
                object.qdirection = [
                    parseFloat(a[0]), parseFloat(a[1]), parseFloat(a[2]),
                    parseFloat(a[3]), parseFloat(a[4]), parseFloat(a[5]),
                    parseFloat(a[6]), parseFloat(a[7]), parseFloat(a[8]),
                ];
            });
            this.forEach(a, "staticflags", (a: any) => {
                object.staticFlags = parseInt(a[0], 16);
            });
        }

        for (let i = 0; i < root.length; i++) {
            const rootI = root[i];
            if (typeof rootI != "string") continue;

            let lower = rootI.toLowerCase();

            if (lower == "static" || lower == "signal") {
                addObject("static", root[i + 1]);
            } else if (lower == "trackobj") {
                addObject("track", root[i + 1]);
            } else if (lower == "gantry") {
                addObject("gantry", root[i + 1]);
            } else if (lower == "collideobject") {
                addObject("gantry", root[i + 1]);
            } else if (lower == "levelcr") {
                addObject("gantry", root[i + 1]);
            } else if (lower == "speedpost") {
                addObject("gantry", root[i + 1]);
            } else if (lower == "dyntrack") {
                addObject("dyntrack", root[i + 1]);
                object.trackSections = [];
                this.forEach(root[i + 1], "tracksections", (a: any) => {
                    this.forEach(a, "tracksection", (a: any) => {
                        object.trackSections.push({
                            dist: parseFloat(a[3]),
                            radius: parseFloat(a[4])
                        });
                    });
                });
            } else if (lower == "forest") {
                addObject("forest", root[i + 1]);
                this.forEach(root[i + 1], "treetexture", (a: any) => {
                    object.treeTexture = a[0];
                });
                this.forEach(root[i + 1], "scalerange", (a: any) => {
                    object.scale = parseFloat(a[0]);
                    object.range = parseFloat(a[1]);
                });
                this.forEach(root[i + 1], "area", (a: any) => {
                    object.areaH = parseFloat(a[0]);
                    object.areaW = parseFloat(a[1]);
                });
                this.forEach(root[i + 1], "treesize", (a: any) => {
                    object.sizeW = parseFloat(a[0]);
                    object.sizeH = parseFloat(a[1]);
                });
                this.forEach(root[i + 1], "population", (a: any) => {
                    object.population = parseFloat(a[0]);
                });
            }
        }

        return result;
    }
}
