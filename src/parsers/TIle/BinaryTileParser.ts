import { MstsTile, TerrainShader, TerrainTexSlot, TerrainUVCalc, TerrainPatchset, TilePatch } from "../../types/MstsTile";
import { IMstsParser } from "../IMstsParser";
import { BinaryParser } from "../BinaryParser";
import { TokenID } from "../TokenID";
import { ParserContext } from "../ParserContext";

export class BinaryTileParser extends BinaryParser implements IMstsParser<MstsTile> {

    async parse(): Promise<MstsTile> {

        const tile = new MstsTile();
        const context = new ParserContext();

        for (; this.offset < this.buffer.length;) {
            const code = this.getInt();
            if (code == 0) break;

            /** length of the block */
            const len = this.getInt();

            /** beginning offset of the block */
            const offset0 = this.offset;
            
            /** end offset of the block */
            const offsetEnd = offset0 + len;

            // Before processing the token, remove all finished blocks from the stack
            context.popFinishedBlocks(offset0);

            switch (code) {
                case TokenID.terrain: // terrain
                    this.getString();
                    context.push(TokenID.terrain, {}, offsetEnd);
                    break;
                case TokenID.terrain_errthreshold_scale: // terrain_errthreshold_scale
                    this.getString();
                    tile.errThresholdScale = this.getFloat();
                    this.offset = offsetEnd;
                    break;
                case TokenID.terrain_water_height_offset: // terrain_water_height_offset
                    this.getString();
                    tile.waterLevelOffsets = [];
                    const numWaterOffsets = (offsetEnd - this.offset) / 4;
                    for (let i = 0; i < numWaterOffsets; i++) {
                        tile.waterLevelOffsets.push(this.getFloat());
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.terrain_alwaysselect_maxdist: // terrain_alwaysselect_maxdist
                    this.getString();
                    tile.alwaysSelectMaxDist = this.getInt();
                    this.offset = offsetEnd;
                    break;
                case TokenID.terrain_samples: // terrain_samples
                    this.getString();
                    context.push(TokenID.terrain_samples, {}, offsetEnd);
                    break;
                case TokenID.terrain_nsamples: // terrain_nsamples
                    this.getString();
                    tile.nsamples = this.getInt();
                    this.offset = offsetEnd;
                    break;
                case TokenID.terrain_sample_rotation: // terrain_sample_rotation
                    this.getString();
                    tile.sampleRotation = this.getFloat();
                    this.offset = offsetEnd;
                    break;
                case TokenID.terrain_sample_floor: // terrain_sample_floor
                    this.getString();
                    tile.floor = this.getFloat();
                    this.offset = offsetEnd;
                    break;
                case TokenID.terrain_sample_scale: // terrain_sample_scale
                    this.getString();
                    tile.scale = this.getFloat();
                    this.offset = offsetEnd;
                    break;
                case TokenID.terrain_sample_size: // terrain_sample_size
                    this.getString();
                    tile.size = this.getFloat();
                    this.offset = offsetEnd;
                    break;
                case TokenID.terrain_sample_asbuffer: // terrain_sample_asbuffer (format unknown)
                    this.getString();
                    // Skip unknown buffer format
                    this.offset = offsetEnd;
                    break;
                case TokenID.terrain_sample_usbuffer: // terrain_sample_usbuffer (format unknown)
                    this.getString();
                    // Skip unknown buffer format
                    this.offset = offsetEnd;
                    break;
                case TokenID.terrain_sample_fbuffer: // terrain_sample_fbuffer
                    this.getString();
                    tile.fBuffer = this.getStringU(this.getShort());
                    this.offset = offsetEnd;
                    break;
                case TokenID.terrain_sample_ybuffer: // terrain_sample_ybuffer
                    this.getString();
                    tile.yBuffer = this.getStringU(this.getShort());
                    this.offset = offsetEnd;
                    break;
                case TokenID.terrain_sample_ebuffer: // terrain_sample_ebuffer
                    this.getString();
                    tile.eBuffer = this.getStringU(this.getShort());
                    this.offset = offsetEnd;
                    break;
                case TokenID.terrain_sample_nbuffer: // terrain_sample_nbuffer
                    this.getString();
                    tile.nBuffer = this.getStringU(this.getShort());
                    this.offset = offsetEnd;
                    break;
                case TokenID.terrain_shaders: // terrain_shaders
                    this.getString();
                    const shaderCount = this.getInt();
                    context.push(TokenID.terrain_shaders, { count: shaderCount }, offsetEnd);
                    break;
                case TokenID.terrain_shader: // terrain_shader
                    this.getString();
                    const shaderFilename = this.getStringU(this.getShort());
                    const shader: TerrainShader = {
                        filename: shaderFilename,
                        texSlots: [],
                        uvCalcs: []
                    };
                    tile.shaders.push(shader);
                    context.push(TokenID.terrain_shader, {}, offsetEnd);
                    break;
                case TokenID.terrain_texslots: // terrain_texslots
                    this.getString();
                    const texSlotCount = this.getInt();
                    context.push(TokenID.terrain_texslots, { count: texSlotCount }, offsetEnd);
                    break;
                case TokenID.terrain_texslot: // terrain_texslot
                    this.getString();
                    const texSlot: TerrainTexSlot = {
                        filename: this.getStringU(this.getShort()),
                        textureIndex: this.getInt(),
                        textureType: this.getInt()
                    };
                    if (tile.shaders.length > 0) {
                        tile.shaders[tile.shaders.length - 1].texSlots.push(texSlot);
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.terrain_uvcalcs: // terrain_uvcalcs
                    this.getString();
                    const uvCalcCount = this.getInt();
                    context.push(TokenID.terrain_uvcalcs, { count: uvCalcCount }, offsetEnd);
                    break;
                case TokenID.terrain_uvcalc: // terrain_uvcalc
                    this.getString();
                    const uvCalc: TerrainUVCalc = {
                        texSlotIndex: this.getInt(),
                        terrainShaderIndex: this.getInt(),
                        uvCalcMode: this.getInt(),
                        value: this.getFloat()
                    };
                    if (tile.shaders.length > 0) {
                        tile.shaders[tile.shaders.length - 1].uvCalcs.push(uvCalc);
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.terrain_patches: // terrain_patches
                    this.getString();
                    context.push(TokenID.terrain_patches, {}, offsetEnd);
                    break;
                case TokenID.terrain_patchsets: // terrain_patchsets
                    this.getString();
                    const patchsetCount = this.getInt();
                    context.push(TokenID.terrain_patchsets, { count: patchsetCount }, offsetEnd);
                    break;
                case TokenID.terrain_patchset: // terrain_patchset
                    this.getString();
                    const patchset: TerrainPatchset = {
                        distance: 0,
                        npatches: 0,
                        patches: []
                    };
                    tile.patchsets.push(patchset);
                    context.push(TokenID.terrain_patchset, {}, offsetEnd);
                    break;
                case TokenID.terrain_patchset_distance: // terrain_patchset_distance
                    this.getString();
                    if (tile.patchsets.length > 0) {
                        tile.patchsets[tile.patchsets.length - 1].distance = this.getInt();
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.terrain_patchset_npatches: // terrain_patchset_npatches
                    this.getString();
                    if (tile.patchsets.length > 0) {
                        tile.patchsets[tile.patchsets.length - 1].npatches = this.getInt();
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.terrain_patchset_patches: // terrain_patchset_patches
                    this.getString();
                    context.push(TokenID.terrain_patchset_patches, {}, offsetEnd);
                    break;
                case TokenID.terrain_patchset_patch: // terrain_patchset_patch
                    this.getString();
                    const patch: TilePatch = {
                        flags: this.getInt(),
                        centerX: this.getFloat(),
                        centerY: this.getFloat(),
                        centerZ: this.getFloat(),
                        patchRadius: [this.getFloat(), this.getFloat(), this.getFloat()][2], // Hack to read 3 floats, use last as radius
                        terrainShaderIndex: this.getInt(),
                        u: this.getFloat(),
                        v: this.getFloat(),
                        xU: this.getFloat(),
                        zU: this.getFloat(),
                        xV: this.getFloat(),
                        zV: this.getFloat(),
                        errorBias: this.getFloat()
                    };
                    if (tile.patchsets.length > 0) {
                        tile.patchsets[tile.patchsets.length - 1].patches.push(patch);
                    }
                    this.offset = offsetEnd;
                    break;
                default:
                    this.offset = offsetEnd;
                    break;
            }
        }

        return tile;
    }
}