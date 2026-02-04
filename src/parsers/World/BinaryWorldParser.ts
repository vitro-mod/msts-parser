import { MstsWorld, WorldObject, Position, QDirection, Matrix3x3, JNodePosn, TrItemId, TrackSection, SignalUnit, LevelCrData, LevelCrParameters, LevelCrTiming, PickupAnimData, PickupCapacity, PickupType, SpeedRange, SpeedSignShape, SpeedTextSize, Direction, ForestScaleRange, ForestArea, ForestTreeSize } from "../../types/MstsWorld";
import { BinaryParser } from "../BinaryParser";
import { TokenID } from "../TokenID";
import { IMstsParser } from "../IMstsParser";
import { ParserContext } from "../ParserContext";

export class BinaryWorldParser extends BinaryParser implements IMstsParser<MstsWorld> {

    async parse(): Promise<MstsWorld> {

        const result = new MstsWorld();
        const context = new ParserContext();
        let currentObject: Partial<WorldObject> | null = null;

        for (; this.offset < this.buffer.length;) {
            const code = this.getShort() + 300;
            const flags = this.getShort();

            if (code == 0) break;

            const len = this.getInt();
            const offset0 = this.offset;
            const offsetEnd = offset0 + len;

            context.popFinishedBlocks(offset0);

            switch (code) {
                case TokenID.Tr_Worldfile:
                    this.getString();
                    context.push(TokenID.Tr_Worldfile, {}, offsetEnd);
                    break;
                case TokenID.Tr_Watermark:
                    this.getString();
                    result.trWatermark = this.getInt();
                    this.offset = offsetEnd;
                    break;
                case TokenID.VDbIdCount:
                    this.getString();
                    result.vDbIdCount = this.getInt();
                    this.offset = offsetEnd;
                    break;
                case TokenID.ViewDbSphere:
                    this.getString();
                    // ViewDbSphere parsing - skip for now as it has nested structure
                    this.offset = offsetEnd;
                    break;
                case TokenID.CarSpawner:
                    this.getString();
                    currentObject = { type: 'CarSpawner', trItemIds: [] } as any;
                    result.objects.push(currentObject as WorldObject);
                    context.push(TokenID.CarSpawner, {}, offsetEnd);
                    break;
                case TokenID.CollideObject:
                    this.getString();
                    currentObject = { type: 'CollideObject' } as any;
                    result.objects.push(currentObject as WorldObject);
                    context.push(TokenID.CollideObject, {}, offsetEnd);
                    break;
                case TokenID.Dyntrack:
                    this.getString();
                    currentObject = { type: 'Dyntrack', trackSections: [] } as any;
                    result.objects.push(currentObject as WorldObject);
                    context.push(TokenID.Dyntrack, {}, offsetEnd);
                    break;
                case TokenID.Forest:
                    this.getString();
                    currentObject = { type: 'Forest' } as any;
                    result.objects.push(currentObject as WorldObject);
                    context.push(TokenID.Forest, {}, offsetEnd);
                    break;
                case TokenID.Gantry:
                    this.getString();
                    currentObject = { type: 'Gantry' } as any;
                    result.objects.push(currentObject as WorldObject);
                    context.push(TokenID.Gantry, {}, offsetEnd);
                    break;
                case TokenID.Hazard:
                    this.getString();
                    currentObject = { type: 'Hazard', trItemIds: [] } as any;
                    result.objects.push(currentObject as WorldObject);
                    context.push(TokenID.Hazard, {}, offsetEnd);
                    break;
                case TokenID.LevelCr:
                    this.getString();
                    currentObject = { type: 'LevelCr', trItemIds: [] } as any;
                    result.objects.push(currentObject as WorldObject);
                    context.push(TokenID.LevelCr, {}, offsetEnd);
                    break;
                case TokenID.Pickup:
                    this.getString();
                    currentObject = { type: 'Pickup', trItemIds: [] } as any;
                    result.objects.push(currentObject as WorldObject);
                    context.push(TokenID.Pickup, {}, offsetEnd);
                    break;
                case TokenID.Platform:
                    this.getString();
                    currentObject = { type: 'Platform', trItemIds: [] } as any;
                    result.objects.push(currentObject as WorldObject);
                    context.push(TokenID.Platform, {}, offsetEnd);
                    break;
                case TokenID.Siding:
                    this.getString();
                    currentObject = { type: 'Siding', trItemIds: [] } as any;
                    result.objects.push(currentObject as WorldObject);
                    context.push(TokenID.Siding, {}, offsetEnd);
                    break;
                case TokenID.Signal:
                    this.getString();
                    currentObject = { type: 'Signal', signalUnits: [] } as any;
                    result.objects.push(currentObject as WorldObject);
                    context.push(TokenID.Signal, {}, offsetEnd);
                    break;
                case TokenID.Speedpost:
                    this.getString();
                    currentObject = { type: 'Speedpost', trItemIds: [] } as any;
                    result.objects.push(currentObject as WorldObject);
                    context.push(TokenID.Speedpost, {}, offsetEnd);
                    break;
                case TokenID.Static:
                    this.getString();
                    currentObject = { type: 'Static' } as any;
                    result.objects.push(currentObject as WorldObject);
                    context.push(TokenID.Static, {}, offsetEnd);
                    break;
                case TokenID.Telepole:
                    this.getString();
                    currentObject = { type: 'Telepole' } as any;
                    result.objects.push(currentObject as WorldObject);
                    context.push(TokenID.Telepole, {}, offsetEnd);
                    break;
                case TokenID.TrackObj:
                    this.getString();
                    currentObject = { type: 'TrackObj' } as any;
                    result.objects.push(currentObject as WorldObject);
                    context.push(TokenID.TrackObj, {}, offsetEnd);
                    break;
                case TokenID.Transfer:
                    this.getString();
                    currentObject = { type: 'Transfer' } as any;
                    result.objects.push(currentObject as WorldObject);
                    context.push(TokenID.Transfer, {}, offsetEnd);
                    break;
                case TokenID.UiD:
                    this.getString();
                    if (currentObject) (currentObject as any).uiD = this.getInt();
                    this.offset = offsetEnd;
                    break;
                case TokenID.FileName:
                    this.getString();
                    if (currentObject) (currentObject as any).fileName = this.getStringU(this.getShort());
                    this.offset = offsetEnd;
                    break;
                case TokenID.Position:
                    this.getString();
                    if (currentObject) {
                        (currentObject as any).position = {
                            x: this.getFloat(),
                            y: this.getFloat(),
                            z: this.getFloat()
                        };
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.QDirection:
                    this.getString();
                    if (currentObject) {
                        (currentObject as any).qDirection = {
                            x: this.getFloat(),
                            y: this.getFloat(),
                            z: this.getFloat(),
                            w: this.getFloat()
                        };
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.Matrix3x3:
                    this.getString();
                    if (currentObject) {
                        (currentObject as any).matrix3x3 = [
                            this.getFloat(), this.getFloat(), this.getFloat(),
                            this.getFloat(), this.getFloat(), this.getFloat(),
                            this.getFloat(), this.getFloat(), this.getFloat()
                        ];
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.VDbId:
                    this.getString();
                    if (currentObject) (currentObject as any).vDbId = this.getInt();
                    this.offset = offsetEnd;
                    break;
                case TokenID.StaticFlags:
                    this.getString();
                    if (currentObject) (currentObject as any).staticFlags = this.getInt();
                    this.offset = offsetEnd;
                    break;
                case TokenID.StaticDetailLevel:
                    this.getString();
                    if (currentObject) (currentObject as any).staticDetailLevel = this.getInt();
                    this.offset = offsetEnd;
                    break;
                case TokenID.CollideFlags:
                    this.getString();
                    if (currentObject) (currentObject as any).collideFlags = this.getInt();
                    this.offset = offsetEnd;
                    break;
                case TokenID.CollideFunction:
                    this.getString();
                    if (currentObject) (currentObject as any).collideFunction = this.getInt();
                    this.offset = offsetEnd;
                    break;
                case TokenID.TreeTexture:
                    this.getString();
                    if (currentObject) (currentObject as any).treeTexture = this.getStringU(this.getShort());
                    this.offset = offsetEnd;
                    break;
                case TokenID.ScaleRange:
                    this.getString();
                    if (currentObject) (currentObject as any).scaleRange = { min: this.getFloat(), max: this.getFloat() };
                    this.offset = offsetEnd;
                    break;
                case TokenID.Area:
                    this.getString();
                    if (currentObject) (currentObject as any).area = { x: this.getFloat(), z: this.getFloat() };
                    this.offset = offsetEnd;
                    break;
                case TokenID.TreeSize:
                    this.getString();
                    if (currentObject) (currentObject as any).treeSize = { width: this.getFloat(), height: this.getFloat() };
                    this.offset = offsetEnd;
                    break;
                case TokenID.Population:
                    this.getString();
                    if (currentObject) (currentObject as any).population = this.getInt();
                    this.offset = offsetEnd;
                    break;
                case TokenID.SectionIdx:
                    this.getString();
                    if (currentObject) (currentObject as any).sectionIdx = this.getInt();
                    this.offset = offsetEnd;
                    break;
                case TokenID.Elevation:
                    this.getString();
                    if (currentObject) (currentObject as any).elevation = this.getFloat();
                    this.offset = offsetEnd;
                    break;
                case TokenID.JNodePosn:
                    this.getString();
                    if (currentObject) {
                        (currentObject as any).jNodePosn = {
                            tileX: this.getInt(),
                            tileZ: this.getInt(),
                            x: this.getFloat(),
                            y: this.getFloat(),
                            z: this.getFloat()
                        };
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.Direction:
                    this.getString();
                    if (currentObject) {
                        (currentObject as any).direction = {
                            x: this.getFloat(),
                            y: this.getFloat(),
                            z: this.getFloat()
                        };
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.TrackSections:
                    this.getString();
                    context.push(TokenID.TrackSections, {}, offsetEnd);
                    break;
                case TokenID.TrackSection:
                    this.getString();
                    if (currentObject && (currentObject as any).trackSections) {
                        const section: Partial<TrackSection> = {} as any;
                        (currentObject as any).trackSections.push(section);
                        
                        // Read the nested SectionCurve token manually
                        this.getInt(); // SectionCurve token ID
                        this.getInt(); // SectionCurve length
                        this.getString(); // SectionCurve name
                        section.sectionCurve = this.getInt();
                        
                        // Read the remaining values
                        section.uId = this.getInt();
                        section.arcOrLength = this.getFloat();
                        section.radius = this.getFloat();
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.TrItemId:
                    this.getString();
                    if (currentObject && (currentObject as any).trItemIds) {
                        (currentObject as any).trItemIds.push({
                            database: this.getInt(),
                            itemID: this.getInt()
                        });
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.SignalSubObj:
                    this.getString();
                    if (currentObject) (currentObject as any).signalSubObj = this.getInt();
                    this.offset = offsetEnd;
                    break;
                case TokenID.SignalUnits:
                    this.getString();
                    const unitCount = this.getInt();
                    context.push(TokenID.SignalUnits, { count: unitCount }, offsetEnd);
                    break;
                case TokenID.MaxVisDistance:
                    this.getString();
                    if (currentObject) (currentObject as any).maxVisDistance = this.getInt();
                    this.offset = offsetEnd;
                    break;
                case TokenID.NoDirLight:
                    this.getString();
                    if (currentObject) (currentObject as any).noDirLight = true;
                    this.offset = offsetEnd;
                    break;
                case TokenID.LevelCrParameters:
                    this.getString();
                    if (currentObject) {
                        (currentObject as any).levelCrParameters = {
                            warningTime: this.getFloat(),
                            minimumDistance: this.getFloat()
                        };
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.LevelCrData:
                    this.getString();
                    if (currentObject) {
                        (currentObject as any).levelCrData = {
                            flags: this.getInt(),
                            trackCount: this.getInt()
                        };
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.LevelCrTiming:
                    this.getString();
                    if (currentObject) {
                        (currentObject as any).levelCrTiming = {
                            initialTiming: this.getFloat(),
                            seriousTiming: this.getFloat(),
                            animationTiming: this.getFloat()
                        };
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.CrashProbability:
                    this.getString();
                    if (currentObject) (currentObject as any).crashProbability = this.getInt();
                    this.offset = offsetEnd;
                    break;
                case TokenID.PlatformData:
                    this.getString();
                    if (currentObject) (currentObject as any).platformData = this.getInt();
                    this.offset = offsetEnd;
                    break;
                case TokenID.SidingData:
                    this.getString();
                    if (currentObject) (currentObject as any).sidingData = this.getInt();
                    this.offset = offsetEnd;
                    break;
                case TokenID.CarFrequency:
                    this.getString();
                    if (currentObject) (currentObject as any).carFrequency = this.getFloat();
                    this.offset = offsetEnd;
                    break;
                case TokenID.CarAvSpeed:
                    this.getString();
                    if (currentObject) (currentObject as any).carAvSpeed = this.getFloat();
                    this.offset = offsetEnd;
                    break;
                case TokenID.Speed_Digit_Tex:
                    this.getString();
                    if (currentObject) (currentObject as any).speedDigitTex = this.getStringU(this.getShort());
                    this.offset = offsetEnd;
                    break;
                case TokenID.Speed_Sign_Shape:
                    this.getString();
                    if (currentObject) {
                        const count = this.getInt();
                        const values: number[][] = [];
                        for (let i = 0; i < count; i++) {
                            values.push([this.getFloat(), this.getFloat(), this.getFloat(), this.getFloat()]);
                        }
                        (currentObject as any).speedSignShape = { count, values };
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.Speed_Text_Size:
                    this.getString();
                    if (currentObject) {
                        (currentObject as any).speedTextSize = {
                            width: this.getFloat(),
                            height: this.getFloat(),
                            depth: this.getFloat()
                        };
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.Width:
                    this.getString();
                    if (currentObject) (currentObject as any).width = this.getFloat();
                    this.offset = offsetEnd;
                    break;
                case TokenID.Height:
                    this.getString();
                    if (currentObject) (currentObject as any).height = this.getFloat();
                    this.offset = offsetEnd;
                    break;
                case TokenID.StartPosition:
                    this.getString();
                    if (currentObject) {
                        (currentObject as any).startPosition = {
                            x: this.getFloat(),
                            y: this.getFloat(),
                            z: this.getFloat()
                        };
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.EndPosition:
                    this.getString();
                    if (currentObject) {
                        (currentObject as any).endPosition = {
                            x: this.getFloat(),
                            y: this.getFloat(),
                            z: this.getFloat()
                        };
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.StartType:
                    this.getString();
                    if (currentObject) (currentObject as any).startType = this.getInt();
                    this.offset = offsetEnd;
                    break;
                case TokenID.EndType:
                    this.getString();
                    if (currentObject) (currentObject as any).endType = this.getInt();
                    this.offset = offsetEnd;
                    break;
                case TokenID.StartDirection:
                    this.getString();
                    if (currentObject) (currentObject as any).startDirection = this.getFloat();
                    this.offset = offsetEnd;
                    break;
                case TokenID.EndDirection:
                    this.getString();
                    if (currentObject) (currentObject as any).endDirection = this.getFloat();
                    this.offset = offsetEnd;
                    break;
                case TokenID.Config:
                    this.getString();
                    if (currentObject) (currentObject as any).config = this.getInt();
                    this.offset = offsetEnd;
                    break;
                case TokenID.Quality:
                    this.getString();
                    if (currentObject) (currentObject as any).quality = this.getInt();
                    this.offset = offsetEnd;
                    break;
                case TokenID.comment:
                    this.offset = offsetEnd;
                    break;
                case TokenID.PlatformName:
                    this.getString();
                    if (currentObject) {
                        (currentObject as any).platformName = {
                            station: this.getStringU(this.getShort()),
                            number: this.getStringU(this.getShort())
                        };
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.SidingName:
                    this.getString();
                    if (currentObject) (currentObject as any).sidingName = this.getStringU(this.getShort());
                    this.offset = offsetEnd;
                    break;
                default:
                    this.offset = offsetEnd;
                    break;
            }
        }

        return result;
    }
}
