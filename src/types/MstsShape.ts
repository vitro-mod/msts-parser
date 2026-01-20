import { MstsObject } from "./MstsObject";

// Basic types
export type Vector = [number, number, number];
export type Point = [number, number, number];
export type UvPoint = [number, number];
export type Colour = [number, number, number, number]; // A, R, G, B
export type Matrix = [
    number, number, number,  // M11, M12, M13
    number, number, number,  // M21, M22, M23
    number, number, number,  // M31, M32, M33
    number, number, number   // M41, M42, M43
];

// shape_header
export type ShapeHeader = {
    flag1: number;
    flag2?: number;
};

// volumes
export type VolSphere = {
    vector: Vector;
    radius: number;
};

// textures
export type Texture = {
    imageIdx: number;
    filterMode: number;
    mipMapLODBias: number;
    borderColour?: number;
};

// light_materials
export type LightMaterial = {
    flags: number;
    diffColIdx: number;
    ambColIdx: number;
    specColIdx: number;
    emissiveColIdx: number;
    specPower: number;
};

// uv_op
export type UvOpBase = {
    texAddrMode: number;
};

export type UvOpShare = UvOpBase & {
    uvOp: 'share';
    uvOpIdx: number;
};

export type UvOpCopy = UvOpBase & {
    uvOp: 'copy';
    srcUVIdx: number;
};

export type UvOpUniformScale = UvOpBase & {
    uvOp: 'uniformscale';
    srcUVIdx: number;
    scale: number;
};

export type UvOpNonUniformScale = UvOpBase & {
    uvOp: 'nonuniformscale';
    srcUVIdx: number;
    uScale: number;
    vScale: number;
};

export type UvOpTransform = UvOpBase & {
    uvOp: 'transform';
    srcUVIdx: number;
    e11: number;
    e12: number;
    e21: number;
    e22: number;
    e31: number;
    e32: number;
};

export type UvOpReflectMap = UvOpBase & {
    uvOp: 'reflectmap';
};

export type UvOpReflectMapFull = UvOpBase & {
    uvOp: 'reflectmapfull';
};

export type UvOpSphereMap = UvOpBase & {
    uvOp: 'spheremap';
};

export type UvOpSphereMapFull = UvOpBase & {
    uvOp: 'spheremapfull';
};

export type UvOpSpecularMap = UvOpBase & {
    uvOp: 'specularmap';
};

export type UvOpEmbossBump = UvOpBase & {
    uvOp: 'embossbump';
    srcUVIdx: number;
    uvShiftScale: number;
};

export type UvOp =
    | UvOpShare
    | UvOpCopy
    | UvOpUniformScale
    | UvOpNonUniformScale
    | UvOpTransform
    | UvOpReflectMap
    | UvOpReflectMapFull
    | UvOpSphereMap
    | UvOpSphereMapFull
    | UvOpSpecularMap
    | UvOpEmbossBump;

// light_model_cfg
export type LightModelCfg = {
    flags: number;
    uvOps: UvOp[];
};

// vtx_state
export type VtxState = {
    flags: number;
    matrixIdx: number;
    lightMatIdx: number;
    lightCfgIdx: number;
    lightFlags: number;
    matrix2?: number;
};

// prim_state
export type PrimState = {
    flags: number;
    shaderIndex: number;
    texIdxs: number[];
    zBias: number;
    vStateIndex: number;
    alphaTestMode?: number;
    lightCfgIdx?: number;
    zBufMode?: number;
};

// vertex
export type Vertex = {
    flags: number;
    index: number;
    pointIndex: number;
    normalIndex: number;
    dayColor: number;
    nightColor: number;
    uvIndices: number[];
    weight?: number;
};

// vertex_set
export type VertexSet = {
    vtxStateIdx: number;
    startVtxIdx: number;
    vtxCount: number;
};

// indexed_trilist
export type IndexedTriList = {
    vertexIdxs: number[];
    normalIdxs: number[];
    faceFlags: number[];
};

// indexed_line_list
export type IndexedLineList = {
    vertexIdxs: number[];
};

// point_list
export type PointList = {
    firstVertIdx: number;
    numVtxs: number;
};

// prim_item
export type PrimItem = {
    type: 'prim_state_idx' | 'indexed_trilist' | 'indexed_line_list' | 'point_list';
    data: number | IndexedTriList | IndexedLineList | PointList;
};

// cullable_prims
export type CullablePrims = {
    numPrims: number;
    numFlatSections: number;
    numPrimIdxs: number;
};

// geometry_node
export type GeometryNode = {
    txLightCmds: number;
    nodeXTxLightCmds: number;
    triLists: number;
    lineLists: number;
    ptLists: number;
    cullablePrims: CullablePrims;
};

// geometry_info
export type GeometryInfo = {
    faceNormals: number;
    txLightCmds: number;
    nodeXTxLightCmds: number;
    trilistIdxs: number;
    lineListIdxs: number;
    nodeXTrilistIdxs: number;
    trilists: number;
    lineLists: number;
    ptLists: number;
    nodeXTrilists: number;
    geomNodes: GeometryNode[];
    geomNodeMap: number[];
};

// sub_object_header
export type SubObjectHeader = {
    flags: number;
    sortVectorIdx: number;
    volIdx: number;
    srcVtxFmtFlags: number;
    dstVtxFmtFlags: number;
    geometryInfo: GeometryInfo;
    subObjShaders?: number[];
    subObjLightCfgs?: number[];
    subObjID?: number;
};

// sub_object
export type SubObject = {
    header?: SubObjectHeader;
    vertices: Vertex[];
    vertexSets: VertexSet[];
    primitives: PrimItem[];
    triLists?: IndexedTriList[];
    primStateIdxs?: number[];
};

// dlevel_selection
export type DLevelSelection = {
    visibleDistance: number;
};

// distance_level_header
export type DistanceLevelHeader = {
    dLevelSelection: DLevelSelection;
    hierarchy: number[];
};

// distance_level
export type DistanceLevel = {
    header: DistanceLevelHeader;
    subObjects: SubObject[];
    dist: number;
    hierarchy: number[];
    primStateIdxs?: number[];
    triLists?: IndexedTriList[];
    vertexSets?: VertexSet[];
    vertices?: Vertex[];
};

// distance_levels_header
export type DistanceLevelsHeader = {
    dLevBias: number;
    dLevScale?: number;
};

// lod_control
export type LodControl = {
    header: DistanceLevelsHeader;
    distLevels: DistanceLevel[];
};

// Animation types
export type LinearKey = {
    frame: number;
    x: number;
    y: number;
    z: number;
};

export type TcbKey = {
    frame: number;
    x: number;
    y: number;
    z: number;
    w: number;
    tension: number;
    continuity: number;
    bias: number;
    in: number;
    out: number;
};

export type Controller = {
    type: 'tcb_rot' | 'slerp_rot' | 'tcb_pos' | 'linear_pos';
    keys: (LinearKey | TcbKey)[];
};

export type AnimNode = {
    name?: string;
    controllers: Controller[];
};

export type Animation = {
    frames: number;
    frameRate: number;
    nodes: AnimNode[];
};

// shape_named_data
export type ShapeGeomRef = {
    type: number;
    dLevIdx: number;
    subObjIdx: number;
    first: number;
    n: number;
};

export type ShapeNamedGeometry = {
    name: string;
    refs: ShapeGeomRef[];
};

export type ShapeNamedData = {
    numNames: number;
    geometries: ShapeNamedGeometry[];
};

// matrix with name
export type NamedMatrix = {
    name: string;
    mat: Matrix;
};

export class MstsShape extends MstsObject {

    type: string;

    // Header
    header?: ShapeHeader;

    // Basic geometry data
    volumes: VolSphere[];
    shaders: string[];
    textureFilterNames: string[];
    points: Point[];
    uvPoints: UvPoint[];
    normals: Vector[];
    sort_vectors: Vector[];
    colours: Colour[];
    matrices: NamedMatrix[];
    images: string[];
    textures: Texture[];
    
    // Materials and lighting
    lightMaterials: LightMaterial[];
    lightModelCfgs: LightModelCfg[];
    
    // Vertex and primitive states
    vtxStates: VtxState[];
    primStates: PrimState[];
    
    // LOD controls
    lodControls: LodControl[];
    
    // Legacy compatibility
    distLevels: DistanceLevel[];
    
    // Animations
    animations: Animation[];
    
    // Named data
    shapeNamedData?: ShapeNamedData;

    constructor() {
        super();
        this.type = 'shape';
        this.volumes = [];
        this.shaders = [];
        this.textureFilterNames = [];
        this.points = [];
        this.uvPoints = [];
        this.normals = [];
        this.sort_vectors = [];
        this.colours = [];
        this.matrices = [];
        this.images = [];
        this.textures = [];
        this.lightMaterials = [];
        this.lightModelCfgs = [];
        this.vtxStates = [];
        this.primStates = [];
        this.lodControls = [];
        this.distLevels = [];
        this.animations = [];
    }
}