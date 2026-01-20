import { MstsWorld } from "../../types/MstsWorld";
import { BinaryParser } from "../BinaryParser";
import { TokenID } from "../TokenID";
import { IMstsParser } from "../IMstsParser";

export class BinaryWorldParser extends BinaryParser implements IMstsParser<MstsWorld> {

    async parse(): Promise<MstsWorld> {

        const result = new MstsWorld();

        let object: any = null;

        const tokens = Object.fromEntries(
            Object.entries(TokenID).map(([key, value]) => [value, key])
        );

        const addObject = function (type: string) {
            object = { type: type };
            result.objects.push(object);
        }

        for (; this.offset < this.buffer.length;) {
            const code = this.getShort() + 300;
            const flags = this.getShort();

            if (code == 0) break;

            const len = this.getInt();
            // const offset0 = this.offset;

            switch (code) {
                case TokenID.Tr_Worldfile:
                    this.getString();
                    break;
                case TokenID.Static:
                case TokenID.Signal:
                    this.getString();
                    addObject("static");
                    break;
                case TokenID.TrackObj:
                    this.getString();
                    addObject("track");
                    break;
                case TokenID.Dyntrack:
                    this.getString();
                    addObject("dyntrack");
                    object.trackSections = [];
                    break;
                case TokenID.Gantry:
                    this.getString();
                    addObject("gantry");
                    break;
                case TokenID.CollideObject:
                    this.getString();
                    addObject("collideobject");
                    break;
                case TokenID.LevelCr:
                    this.getString();
                    addObject("levelcr");
                    break;
                case TokenID.Speedpost:
                    this.getString();
                    addObject("speedpost");
                    break;
                case TokenID.FileName:
                    this.getString();
                    object.filename = this.getStringU(this.getShort());
                    break;
                case TokenID.Position:
                    this.getString();
                    object.position = [this.getFloat(), this.getFloat(), this.getFloat()];
                    break;
                case TokenID.QDirection:
                    this.getString();
                    object.qdirection = [this.getFloat(), this.getFloat(), this.getFloat(), this.getFloat()];
                    break;
                case TokenID.Matrix3x3:
                    this.getString()
                    object.matrix3x3 = [
                        this.getFloat(), this.getFloat(), this.getFloat(),
                        this.getFloat(), this.getFloat(), this.getFloat(),
                        this.getFloat(), this.getFloat(), this.getFloat(),
                    ];
                    break;
                case TokenID.StaticFlags:
                    this.getString();
                    object.staticFlags = this.getInt();
                    break;
                case TokenID.TrackSections:
                    this.getString();
                    break;
                case TokenID.TrackSection:
                    if (len == 26) {
                        this.getString();
                        this.getInt(); //section curve code
                        this.getInt(); //section curve len
                        this.getString();
                        this.getInt(); //section curve flag
                        this.getInt(); //section id
                        object.trackSections.push({
                            dist: this.getFloat(),
                            radius: this.getFloat()
                        });
                    } else {
                        this.offset += len;
                    }
                    break;
                case TokenID.Hazard:
                    this.getString();
                    addObject("hazard");
                    break;
                case TokenID.Forest:
                    this.getString();
                    addObject("forest");
                    break;
                case TokenID.TreeTexture:
                    this.getString();
                    object.treeTexture = this.getStringU(this.getShort());
                    break;
                case TokenID.ScaleRange:
                    this.getString();
                    object.scale = this.getFloat();
                    object.range = this.getFloat();
                    break;
                case TokenID.Area:
                    this.getString();
                    object.areaW = this.getFloat();
                    object.areaH = this.getFloat();
                    break;
                case TokenID.TreeSize:
                    this.getString();
                    object.sizeW = this.getFloat();
                    object.sizeH = this.getFloat();
                    break;
                case TokenID.Population:
                    this.getString();
                    object.population = this.getInt();
                    break;
                case TokenID.Transfer:
                    /** @todo */
                    console.log('TODO:', tokens[code]);
                    this.offset += len;
                    break;
                case TokenID.comment:
                    this.offset += len;
                    break;
                case TokenID.VDbId:
                case TokenID.VDbIdCount:
                case TokenID.ViewDbSphere:
                case TokenID.UiD:
                case TokenID.StaticDetailLevel:
                case TokenID.MaxVisDistance:
                case TokenID.NoDirLight:
                case TokenID.Elevation:
                case TokenID.JNodePosn:
                case TokenID.SectionIdx:
                case TokenID.CollideFlags:
                case TokenID.CollideFunction:
                case TokenID.LevelCrParameters:
                case TokenID.LevelCrData:
                case TokenID.LevelCrTiming:
                case TokenID.CrashProbability:
                case TokenID.SignalSubObj:
                case TokenID.SignalUnits:
                case TokenID.TrItemId:
                case TokenID.Platform:
                case TokenID.Siding:
                case TokenID.CarSpawner:
                case TokenID.Tr_Watermark:
                case TokenID.Speed_Digit_Tex:
                case TokenID.Speed_Sign_Shape:
                case TokenID.Speed_Text_Size:
                default:
                    this.offset += len;
                    break;
            }
        }

        return result;
    }
}
