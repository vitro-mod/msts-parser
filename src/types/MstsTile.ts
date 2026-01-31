import { Buffer } from "buffer";
import { MstsObject } from "./MstsObject";

/**
 * Terrain UV calculation parameters
 * Based on terrain_uvcalc: :uint :uint :uint :float
 */
export type TerrainUVCalc = {
    /** Texture slot index */
    texSlotIndex: number;
    /** Terrain shader index */
    terrainShaderIndex: number;
    /** UV calculation mode */
    uvCalcMode: number;
    /** Calculation value */
    value: number;
};

/**
 * Terrain texture slot
 * Based on terrain_texslot: :string :uint :uint
 */
export type TerrainTexSlot = {
    /** Texture filename */
    filename: string;
    /** Texture index */
    textureIndex: number;
    /** Texture type (0 = texture, 1 = microtexture) */
    textureType: number;
};

/**
 * Terrain shader definition
 * Based on terrain_shader: :string :terrain_texslots :terrain_uvcalcs
 */
export type TerrainShader = {
    /** Shader name */
    name: string;
    /** Texture slots */
    texSlots: TerrainTexSlot[];
    /** UV calculations */
    uvCalcs: TerrainUVCalc[];
};

/**
 * Terrain patchset patch definition
 * Based on terrain_patchset_patch: :dword,Flags :float,CenterX :float,CenterY :float,CenterZ :float :float :float,PatchRadius :uint,TerrainShaderIndex :float,U :float,V :float,XU :float,ZU :float,XV :float,ZV :float,ErrorBias
 */
export type TilePatch = {
    /** Patch flags */
    flags: number;
    /** Center X coordinate */
    centerX: number;
    /** Center Y coordinate */
    centerY: number;
    /** Center Z coordinate */
    centerZ: number;
    /** Patch radius */
    patchRadius: number;
    /** Terrain shader index */
    terrainShaderIndex: number;
    /** U texture coordinate */
    u: number;
    /** V texture coordinate */
    v: number;
    /** X component of U gradient */
    xU: number;
    /** Z component of U gradient */
    zU: number;
    /** X component of V gradient */
    xV: number;
    /** Z component of V gradient */
    zV: number;
    /** Error bias */
    errorBias: number;
};

/**
 * Terrain patchset
 * Based on terrain_patchset: :terrain_patchset_distance :terrain_patchset_npatches :terrain_patchset_patches
 */
export type TerrainPatchset = {
    /** Distance for this patchset */
    distance: number;
    /** Number of patches */
    npatches: number;
    /** Array of patches */
    patches: TilePatch[];
};

/**
 * @deprecated Use TilePatch instead
 */
export type tile_patch = TilePatch;

export class MstsTile extends MstsObject {

    type: string;
    
    // Top-level terrain properties (optional, in brackets in BNF)
    /** terrain_errthreshold_scale: :float */
    errThresholdScale?: number;
    /** terrain_water_height_offset: :float [:float :float :float] */
    waterLevelOffsets: number[];
    /** terrain_alwaysselect_maxdist: :uint */
    alwaysSelectMaxDist?: number;
    
    // terrain_samples properties
    /** terrain_nsamples: :uint */
    nsamples!: number;
    /** terrain_sample_rotation: :float (optional) */
    sampleRotation?: number;
    /** terrain_sample_floor: :float */
    floor!: number;
    /** terrain_sample_scale: :float */
    scale!: number;
    /** terrain_sample_size: :float */
    size!: number;
    /** terrain_sample_asbuffer: :buffer (optional, format unknown) */
    aBuffer?: unknown;
    /** terrain_sample_usbuffer: :buffer (optional, format unknown) */
    uBuffer?: unknown;
    /** terrain_sample_fbuffer: :string (optional) */
    fBuffer?: string;
    /** terrain_sample_ybuffer: :string */
    yBuffer!: string;
    /** terrain_sample_ebuffer: :string (optional) */
    eBuffer?: string;
    /** terrain_sample_nbuffer: :string */
    nBuffer!: string;
    
    // terrain_shaders: :uint {:terrain_shader}
    /** Array of terrain shaders */
    shaders: TerrainShader[];
    
    // terrain_patches: :terrain_patchsets
    /** Array of terrain patchsets */
    patchsets: TerrainPatchset[];
    
    // Additional metadata (not in BNF, for library use)
    terrain?: Buffer;
    vertexFlags?: Buffer;
    filename?: string;
    x?: number;
    z?: number;

    constructor() {
        super();

        this.type = 'tile';
        this.waterLevelOffsets = [];
        this.shaders = [];
        this.patchsets = [];
    }
}
