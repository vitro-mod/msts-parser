import { MstsObject } from "./MstsObject";

/**
 * Base types from world.bnf
 */
export type Position = {
    x: number;
    y: number;
    z: number;
};

export type QDirection = {
    w: number;
    x: number;
    y: number;
    z: number;
};

export type Matrix3x3 = [
    number, number, number,
    number, number, number,
    number, number, number
];

export type JNodePosn = {
    tileX: number;
    tileZ: number;
    x: number;
    y: number;
    z: number;
};

export type TrItemId = {
    database: number;
    itemID: number;
};

export type SectionCurve = number;

export type TrackSection = {
    sectionCurve: SectionCurve;
    uId: number;
    arcOrLength: number;
    radius: number;
}

export type SignalUnit = {
    index: number;
    trItemId: TrItemId;
};

export type LevelCrData = {
    flags: number;
    trackCount: number;
};

export type LevelCrParameters = {
    warningTime: number;
    minimumDistance: number;
};

export type LevelCrTiming = {
    initialTiming: number;
    seriousTiming: number;
    animationTiming: number;
};

export type PickupAnimData = {
    param1: number;
    param2: number;
};

export type PickupCapacity = {
    param1: number;
    param2: number;
};

export type PickupType = {
    param1: number;
    param2: number;
};

export type SpeedRange = {
    min: number;
    max: number;
};

export type ForestScaleRange = {
    min: number;
    max: number;
};

export type ForestArea = {
    x: number;
    z: number;
};

export type ForestTreeSize = {
    width: number;
    height: number;
};

export type SpeedSignShape = {
    count: number;
    values: number[][];
};

export type SpeedTextSize = {
    width: number;
    height: number;
    depth: number;
};

export type Direction = {
    angle: number;
    param1: number;
    param2: number;
};

/**
 * World object types
 */
export type ViewDbSphere = {
    type: 'ViewDbSphere';
    vDbId: number;
    position: Position;
    radius: number;
    children?: ViewDbSphere[];
};

export type CarSpawner = {
    type: 'CarSpawner';
    uiD: number;
    carFrequency: number;
    carAvSpeed: number;
    trItemIds: TrItemId[];
    staticFlags: number;
    position: Position;
    qDirection: QDirection;
    vDbId: number;
};

export type CollideObject = {
    type: 'CollideObject';
    uiD: number;
    collideFlags: number;
    collideFunction?: number;
    fileName: string;
    staticFlags?: number;
    position: Position;
    qDirection: QDirection;
    vDbId: number;
    noDirLight?: boolean;
    staticDetailLevel?: number;
};

export type Dyntrack = {
    type: 'Dyntrack';
    uiD: number;
    trackSections: TrackSection[];
    sectionIdx: number;
    elevation: number;
    collideFlags: number;
    staticFlags: number;
    position: Position;
    qDirection: QDirection;
    vDbId: number;
    staticDetailLevel?: number;
};

export type Forest = {
    type: 'Forest';
    uiD: number;
    treeTexture?: string;
    scaleRange: ForestScaleRange;
    area: ForestArea;
    population: number;
    treeSize: ForestTreeSize;
    staticFlags?: number;
    position: Position;
    qDirection?: QDirection;
    matrix3x3?: Matrix3x3;
    vDbId: number;
    staticDetailLevel?: number;
};

export type Gantry = {
    type: 'Gantry';
    uiD: number;
    fileName: string;
    staticFlags?: number;
    position: Position;
    qDirection: QDirection;
    vDbId: number;
    staticDetailLevel?: number;
};

export type Hazard = {
    type: 'Hazard';
    uiD: number;
    trItemIds: TrItemId[];
    fileName: string;
    position: Position;
    qDirection: QDirection;
    vDbId: number;
};

export type LevelCr = {
    type: 'LevelCr';
    uiD: number;
    levelCrParameters: LevelCrParameters;
    crashProbability: number;
    levelCrData: LevelCrData;
    levelCrTiming: LevelCrTiming;
    trItemIds: TrItemId[];
    fileName: string;
    staticFlags?: number;
    position: Position;
    qDirection: QDirection;
    vDbId: number;
    staticDetailLevel?: number;
};

export type Pickup = {
    type: 'Pickup';
    uiD: number;
    speedRange: SpeedRange;
    pickupType: PickupType;
    pickupAnimData: PickupAnimData;
    pickupCapacity: PickupCapacity;
    trItemIds: TrItemId[];
    collideFlags: number;
    fileName: string;
    staticFlags?: number;
    position: Position;
    qDirection: QDirection;
    vDbId: number;
    staticDetailLevel?: number;
};

export type Platform = {
    type: 'Platform';
    uiD: number;
    platformData: number;
    trItemIds: TrItemId[];
    staticFlags: number;
    position: Position;
    qDirection: QDirection;
    vDbId: number;
};

export type Siding = {
    type: 'Siding';
    uiD: number;
    sidingData: number;
    trItemIds: TrItemId[];
    staticFlags: number;
    position: Position;
    qDirection: QDirection;
    vDbId: number;
};

export type Signal = {
    type: 'Signal';
    uiD: number;
    fileName: string;
    staticFlags?: number;
    position: Position;
    qDirection: QDirection;
    vDbId: number;
    staticDetailLevel?: number;
    signalSubObj: number;
    signalUnits: SignalUnit[];
};

export type Speedpost = {
    type: 'Speedpost';
    uiD: number;
    speedDigitTex: string;
    speedSignShape: SpeedSignShape;
    speedTextSize: SpeedTextSize;
    trItemIds: TrItemId[];
    fileName: string;
    staticFlags?: number;
    position: Position;
    qDirection: QDirection;
    vDbId: number;
    staticDetailLevel?: number;
};

export type Static = {
    type: 'Static';
    uiD: number;
    sectionIdx?: number;
    elevation?: number;
    jNodePosn?: JNodePosn;
    collideFlags?: number;
    fileName: string;
    sectionIdx2?: number;
    elevation2?: number;
    collideFlags2?: number;
    staticFlags?: number;
    position: Position;
    qDirection?: QDirection;
    matrix3x3?: Matrix3x3;
    maxVisDistance?: number;
    vDbId: number;
    noDirLight?: boolean;
    staticDetailLevel?: number;
};

export type Telepole = {
    type: 'Telepole';
    uiD: number;
    population: number;
    startPosition: Position;
    endPosition: Position;
    startType: number;
    endType: number;
    startDirection: number;
    endDirection: number;
    config: number;
    quality?: number;
    position: Position;
    direction?: Direction;
    qDirection?: QDirection;
    maxVisDistance?: number;
    vDbId: number;
};

export type TrackObj = {
    type: 'TrackObj';
    uiD: number;
    sectionIdx: number;
    elevation: number;
    jNodePosn?: JNodePosn;
    collideFlags: number;
    collideFunction?: number;
    fileName: string;
    staticFlags?: number;
    position: Position;
    qDirection?: QDirection;
    matrix3x3?: Matrix3x3;
    maxVisDistance?: number;
    vDbId: number;
    staticDetailLevel?: number;
};

export type Transfer = {
    type: 'Transfer';
    uiD: number;
    width: number;
    height: number;
    fileName: string;
    staticFlags?: number;
    position: Position;
    qDirection: QDirection;
    vDbId: number;
    staticDetailLevel?: number;
};

/**
 * Union type for all world objects
 */
export type WorldObject =
    | ViewDbSphere
    | CarSpawner
    | CollideObject
    | Dyntrack
    | Forest
    | Gantry
    | Hazard
    | LevelCr
    | Pickup
    | Platform
    | Siding
    | Signal
    | Speedpost
    | Static
    | Telepole
    | TrackObj
    | Transfer;

export class MstsWorld extends MstsObject {

    type: string;
    
    /** Tr_Watermark: :uint */
    trWatermark?: number;
    
    /** VDbIdCount: :uint */
    vDbIdCount?: number;
    
    /** Array of world objects */
    objects: WorldObject[];

    constructor() {
        super();

        this.type = 'world';
        this.objects = [];
    }
}
