import { Buffer } from "buffer";
import { MstsObject } from "./MstsObject";

export type tile_patch = {
    flags: number;
    centerX: number;
    centerZ: number;
    texIndex: number;
    u0: number;
    v0: number;
    dudx: number;
    dudz: number;
    dvdx: number;
    dvdz: number;
};

export class MstsTile extends MstsObject {

    type: string;
    waterLevel: number[];
    floor!: number;
    scale!: number;
    nsamples!: number;
    rotation!: number;
    size!: number;
    yBuffer!: string;
    eBuffer!: string;
    nBuffer!: string;
    fBuffer!: string;
    patches: tile_patch[];
    textures: string[];
    microTextures: string[];
    shaders: string[];
    terrain?: Buffer;
    vertexFlags?: Buffer;
    filename?: string;
    x?: number;
    z?: number;

    constructor() {
        super();

        this.type = 'tile';
        this.waterLevel = [];
        this.patches = [];
        this.textures = [];
        this.microTextures = [];
        this.shaders = [];
    }
}
