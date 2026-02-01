import { MstsWorld, WorldObject, Position, QDirection, Matrix3x3, TrItemId, TrackSection, SignalUnit } from "../../types/MstsWorld";
import { IMstsParser } from "../IMstsParser";
import { UnicodeParser } from "../UnicodeParser";

export class UnicodeWorldParser extends UnicodeParser implements IMstsParser<MstsWorld> {

    async parse(): Promise<MstsWorld> {

        const result = new MstsWorld();

        if (typeof this.data[0] != "string" || this.data[0].toLowerCase() != "tr_worldfile") {
            throw new Error('This is not a MSTS World!');
        }

        const root = this.data[1];

        const parseCommonFields = (obj: any, data: any) => {
            this.forEach(data, "uid", (a: any) => {
                obj.uiD = parseInt(a[0]);
            });
            this.forEach(data, "filename", (a: any) => {
                obj.fileName = a[0];
            });
            this.forEach(data, "position", (a: any) => {
                obj.position = {
                    x: parseFloat(a[0]),
                    y: parseFloat(a[1]),
                    z: parseFloat(a[2])
                };
            });
            this.forEach(data, "qdirection", (a: any) => {
                obj.qDirection = {
                    w: parseFloat(a[0]),
                    x: parseFloat(a[1]),
                    y: parseFloat(a[2]),
                    z: parseFloat(a[3])
                };
            });
            this.forEach(data, "matrix3x3", (a: any) => {
                obj.matrix3x3 = [
                    parseFloat(a[0]), parseFloat(a[1]), parseFloat(a[2]),
                    parseFloat(a[3]), parseFloat(a[4]), parseFloat(a[5]),
                    parseFloat(a[6]), parseFloat(a[7]), parseFloat(a[8])
                ];
            });
            this.forEach(data, "vdbid", (a: any) => {
                obj.vDbId = parseInt(a[0]);
            });
            this.forEach(data, "staticflags", (a: any) => {
                obj.staticFlags = parseInt(a[0], 16);
            });
            this.forEach(data, "staticdetaillevel", (a: any) => {
                obj.staticDetailLevel = parseInt(a[0]);
            });
            this.forEach(data, "collideflags", (a: any) => {
                obj.collideFlags = parseInt(a[0], 16);
            });
            this.forEach(data, "collidefunction", (a: any) => {
                obj.collideFunction = parseInt(a[0]);
            });
            this.forEach(data, "maxvisdistance", (a: any) => {
                obj.maxVisDistance = parseInt(a[0]);
            });
            this.forEach(data, "nodirlight", (a: any) => {
                obj.noDirLight = true;
            });
            this.forEach(data, "sectionidx", (a: any) => {
                obj.sectionIdx = parseInt(a[0]);
            });
            this.forEach(data, "elevation", (a: any) => {
                obj.elevation = parseFloat(a[0]);
            });
            this.forEach(data, "jnodeposn", (a: any) => {
                obj.jNodePosn = {
                    tileX: parseInt(a[0]),
                    tileZ: parseInt(a[1]),
                    x: parseFloat(a[2]),
                    y: parseFloat(a[3]),
                    z: parseFloat(a[4])
                };
            });
        };

        const parseTrItemIds = (obj: any, data: any) => {
            obj.trItemIds = [];
            this.forEach(data, "tritemid", (a: any) => {
                obj.trItemIds.push({
                    database: parseInt(a[0]),
                    itemID: parseInt(a[1])
                });
            });
        };

        for (let i = 0; i < root.length; i++) {
            const rootI = root[i];
            if (typeof rootI != "string") continue;

            const lower = rootI.toLowerCase();
            const data = root[i + 1];

            switch (lower) {
                case "tr_watermark":
                    if (Array.isArray(data) && typeof data[0] === 'string') {
                        result.trWatermark = parseInt(data[0]);
                    }
                    break;
                case "vdbidcount":
                    if (Array.isArray(data) && typeof data[0] === 'string') {
                        result.vDbIdCount = parseInt(data[0]);
                    }
                    break;
                case "carspawner": {
                    const obj: any = { type: 'CarSpawner' };
                    parseCommonFields(obj, data);
                    parseTrItemIds(obj, data);
                    this.forEach(data, "carfrequency", (a: any) => obj.carFrequency = parseFloat(a[0]));
                    this.forEach(data, "caravspeed", (a: any) => obj.carAvSpeed = parseFloat(a[0]));
                    result.objects.push(obj);
                    break;
                }
                case "collideobject": {
                    const obj: any = { type: 'CollideObject' };
                    parseCommonFields(obj, data);
                    result.objects.push(obj);
                    break;
                }
                case "dyntrack": {
                    const obj: any = { type: 'Dyntrack', trackSections: [] };
                    parseCommonFields(obj, data);
                    this.forEach(data, "tracksections", (a: any) => {
                        this.forEach(a, "tracksection", (ts: any) => {
                            obj.trackSections.push({
                                sectionCurve: parseInt(ts[0]),
                                param1: parseInt(ts[1]),
                                param2: parseFloat(ts[2]),
                                param3: parseFloat(ts[3])
                            });
                        });
                    });
                    result.objects.push(obj);
                    break;
                }
                case "forest": {
                    const obj: any = { type: 'Forest' };
                    parseCommonFields(obj, data);
                    this.forEach(data, "treetexture", (a: any) => obj.treeTexture = a[0]);
                    this.forEach(data, "scalerange", (a: any) => obj.scaleRange = [parseFloat(a[0]), parseFloat(a[1])]);
                    this.forEach(data, "area", (a: any) => obj.area = [parseFloat(a[0]), parseFloat(a[1])]);
                    this.forEach(data, "treesize", (a: any) => obj.treeSize = [parseFloat(a[0]), parseFloat(a[1])]);
                    this.forEach(data, "population", (a: any) => obj.population = parseInt(a[0]));
                    result.objects.push(obj);
                    break;
                }
                case "gantry": {
                    const obj: any = { type: 'Gantry' };
                    parseCommonFields(obj, data);
                    result.objects.push(obj);
                    break;
                }
                case "hazard": {
                    const obj: any = { type: 'Hazard' };
                    parseCommonFields(obj, data);
                    parseTrItemIds(obj, data);
                    result.objects.push(obj);
                    break;
                }
                case "levelcr": {
                    const obj: any = { type: 'LevelCr' };
                    parseCommonFields(obj, data);
                    parseTrItemIds(obj, data);
                    this.forEach(data, "levelcrparameters", (a: any) => {
                        obj.levelCrParameters = {
                            warningTime: parseFloat(a[0]),
                            minimumDistance: parseFloat(a[1])
                        };
                    });
                    this.forEach(data, "crashprobability", (a: any) => obj.crashProbability = parseInt(a[0]));
                    this.forEach(data, "levelcrdata", (a: any) => {
                        obj.levelCrData = {
                            flags: parseInt(a[0], 16),
                            trackCount: parseInt(a[1])
                        };
                    });
                    this.forEach(data, "levelcrtiming", (a: any) => {
                        obj.levelCrTiming = {
                            initialTiming: parseFloat(a[0]),
                            seriousTiming: parseFloat(a[1]),
                            animationTiming: parseFloat(a[2])
                        };
                    });
                    result.objects.push(obj);
                    break;
                }
                case "pickup": {
                    const obj: any = { type: 'Pickup' };
                    parseCommonFields(obj, data);
                    parseTrItemIds(obj, data);
                    this.forEach(data, "speedrange", (a: any) => {
                        obj.speedRange = { min: parseInt(a[0]), max: parseInt(a[1]) };
                    });
                    this.forEach(data, "pickuptype", (a: any) => {
                        obj.pickupType = { param1: parseInt(a[0]), param2: parseInt(a[1]) };
                    });
                    this.forEach(data, "pickupanimdata", (a: any) => {
                        obj.pickupAnimData = { param1: parseInt(a[0]), param2: parseInt(a[1]) };
                    });
                    this.forEach(data, "pickupcapacity", (a: any) => {
                        obj.pickupCapacity = { param1: parseInt(a[0]), param2: parseInt(a[1]) };
                    });
                    result.objects.push(obj);
                    break;
                }
                case "platform": {
                    const obj: any = { type: 'Platform' };
                    parseCommonFields(obj, data);
                    parseTrItemIds(obj, data);
                    this.forEach(data, "platformdata", (a: any) => obj.platformData = parseInt(a[0], 16));
                    result.objects.push(obj);
                    break;
                }
                case "siding": {
                    const obj: any = { type: 'Siding' };
                    parseCommonFields(obj, data);
                    parseTrItemIds(obj, data);
                    this.forEach(data, "sidingdata", (a: any) => obj.sidingData = parseInt(a[0], 16));
                    result.objects.push(obj);
                    break;
                }
                case "signal": {
                    const obj: any = { type: 'Signal', signalUnits: [] };
                    parseCommonFields(obj, data);
                    this.forEach(data, "signalsubobj", (a: any) => obj.signalSubObj = parseInt(a[0], 16));
                    this.forEach(data, "signalunits", (a: any) => {
                        this.forEach(a, "signalunit", (su: any) => {
                            obj.signalUnits.push({
                                index: parseInt(su[0]),
                                trItemId: {
                                    database: parseInt(su[1][0]),
                                    itemID: parseInt(su[1][1])
                                }
                            });
                        });
                    });
                    result.objects.push(obj);
                    break;
                }
                case "speedpost": {
                    const obj: any = { type: 'Speedpost' };
                    parseCommonFields(obj, data);
                    parseTrItemIds(obj, data);
                    this.forEach(data, "speed_digit_tex", (a: any) => obj.speedDigitTex = a[0]);
                    this.forEach(data, "speed_sign_shape", (a: any) => {
                        const count = parseInt(a[0]);
                        const values: number[][] = [];
                        for (let j = 1; j < a.length; j++) {
                            if (Array.isArray(a[j])) {
                                values.push(a[j].map((v: string) => parseFloat(v)));
                            }
                        }
                        obj.speedSignShape = { count, values };
                    });
                    this.forEach(data, "speed_text_size", (a: any) => {
                        obj.speedTextSize = {
                            width: parseFloat(a[0]),
                            height: parseFloat(a[1]),
                            depth: parseFloat(a[2])
                        };
                    });
                    result.objects.push(obj);
                    break;
                }
                case "static": {
                    const obj: any = { type: 'Static' };
                    parseCommonFields(obj, data);
                    result.objects.push(obj);
                    break;
                }
                case "telepole": {
                    const obj: any = { type: 'Telepole' };
                    parseCommonFields(obj, data);
                    this.forEach(data, "population", (a: any) => obj.population = parseInt(a[0]));
                    this.forEach(data, "startposition", (a: any) => {
                        obj.startPosition = {
                            x: parseFloat(a[0]),
                            y: parseFloat(a[1]),
                            z: parseFloat(a[2])
                        };
                    });
                    this.forEach(data, "endposition", (a: any) => {
                        obj.endPosition = {
                            x: parseFloat(a[0]),
                            y: parseFloat(a[1]),
                            z: parseFloat(a[2])
                        };
                    });
                    this.forEach(data, "starttype", (a: any) => obj.startType = parseInt(a[0]));
                    this.forEach(data, "endtype", (a: any) => obj.endType = parseInt(a[0]));
                    this.forEach(data, "startdirection", (a: any) => obj.startDirection = parseInt(a[0]));
                    this.forEach(data, "enddirection", (a: any) => obj.endDirection = parseInt(a[0]));
                    this.forEach(data, "config", (a: any) => obj.config = parseInt(a[0]));
                    this.forEach(data, "quality", (a: any) => obj.quality = parseInt(a[0]));
                    this.forEach(data, "direction", (a: any) => {
                        obj.direction = {
                            angle: parseFloat(a[0]),
                            param1: parseInt(a[1]),
                            param2: parseInt(a[2])
                        };
                    });
                    result.objects.push(obj);
                    break;
                }
                case "trackobj": {
                    const obj: any = { type: 'TrackObj' };
                    parseCommonFields(obj, data);
                    result.objects.push(obj);
                    break;
                }
                case "transfer": {
                    const obj: any = { type: 'Transfer' };
                    parseCommonFields(obj, data);
                    this.forEach(data, "width", (a: any) => obj.width = parseFloat(a[0]));
                    this.forEach(data, "height", (a: any) => obj.height = parseFloat(a[0]));
                    result.objects.push(obj);
                    break;
                }
            }
        }

        return result;
    }
}
