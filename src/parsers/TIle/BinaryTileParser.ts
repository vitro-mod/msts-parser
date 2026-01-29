import { MstsTile } from "../../types/MstsTile";
import { IMstsParser } from "../IMstsParser";
import { BinaryParser } from "../BinaryParser";
import { TokenID } from "../TokenID";

export class BinaryTileParser extends BinaryParser implements IMstsParser<MstsTile> {

    async parse(): Promise<MstsTile> {

        const tile = new MstsTile();

        for (; this.offset < this.buffer.length;) {
            const code = this.getInt();
            if (code == 0) break;

            /** length of the block */
            const len = this.getInt();

            /** beginning offset of the block */
            // const offset0 = this.offset;

            switch (code) {
                case TokenID.terrain: // terrain
                case TokenID.terrain_samples: // terrain_samples
                    this.getString();
                    break;
                case TokenID.terrain_sample_floor: // terrain sample floor
                    this.getString();
                    tile.floor = this.getFloat();
                    break;
                case TokenID.terrain_sample_scale: // terrain sample scale
                    this.getString();
                    tile.scale = this.getFloat();
                    break;
                case TokenID.terrain_nsamples: // terrain nsamples
                    this.getString();
                    tile.nsamples = this.getInt();
                    break;
                case TokenID.terrain_sample_rotation: // terrain sample rotation
                    this.getString();
                    tile.rotation = this.getFloat();
                    break;
                case TokenID.terrain_sample_size: // terrain sample size
                    this.getString();
                    tile.size = this.getFloat();
                    break;
                case TokenID.terrain_sample_ybuffer: // terrain sample ybuffer
                    this.getString();
                    tile.yBuffer = this.getStringU(this.getShort());
                    break;
                case TokenID.terrain_sample_ebuffer: // terrain sample ebuffer
                    this.getString();
                    tile.eBuffer = this.getStringU(this.getShort());
                    break;
                case TokenID.terrain_sample_nbuffer: // terrain sample nbuffer
                    this.getString();
                    tile.nBuffer = this.getStringU(this.getShort());
                    break;
                case TokenID.terrain_sample_fbuffer: // terrain sample fbuffer
                    this.getString();
                    tile.fBuffer = this.getStringU(this.getShort());
                    break;
                case TokenID.terrain_alwaysselect_maxdist: // terrain always select maxdist
                case TokenID.terrain_errthreshold_scale: // terrain errthreshold_scale
                case TokenID.terrain_sample_asbuffer: // ??
                case TokenID.terrain_sample_usbuffer: // ??
                    this.skip(len);
                    break;
                case TokenID.terrain_water_height_offset: // water level
                    const l = this.getByte();
                    this.skip(l);
                    tile.waterLevel = [];
                    for (let i = 0; i < len - l - 1; i += 4) {
                        tile.waterLevel.push(this.getFloat());
                    }
                    break;
                case TokenID.terrain_patches: // terrain patches
                case TokenID.terrain_patchset: // terrain patchset
                case TokenID.terrain_patchset_patches: // terrain patchset patches
                    this.getString();
                    break;
                case TokenID.terrain_patchsets: // terrain patchsets
                    this.getString();
                    this.getInt();
                    break;
                case TokenID.terrain_patchset_patch: // terrain patchset patch
                    this.getString();
                    let patch: any = {};
                    patch.flags = this.getInt();
                    patch.centerX = this.getFloat();
                    this.getFloat();
                    patch.centerZ = this.getFloat();
                    this.getFloat();
                    this.getFloat();
                    this.getFloat();
                    patch.texIndex = this.getInt();
                    patch.u0 = this.getFloat();
                    patch.v0 = this.getFloat();
                    patch.dudx = this.getFloat();
                    patch.dudz = this.getFloat();
                    patch.dvdx = this.getFloat();
                    patch.dvdz = this.getFloat();
                    this.getFloat();
                    tile.patches.push(patch);
                    break;
                case TokenID.terrain_shaders: // terrain shaders
                    this.getString();
                    this.getInt();
                    break;
                case TokenID.terrain_shader: // terrain shader
                    this.getString();
                    const shader = this.getStringU(this.getShort());
                    tile.shaders.push(shader);
                    break;
                case TokenID.terrain_texslots: // terrain texslots
                    this.getString();
                    this.getInt();
                    break;
                case TokenID.terrain_texslot: // terrain texslot
                    this.getString();
                    let s = this.getStringU(this.getShort());
                    this.getInt();
                    let n = this.getInt();
                    if (n == 0)
                        tile.textures.push(s);
                    else if (n == 1)
                        tile.microTextures.push(s);
                    break;
                default:
                    this.skip(len);
                    break;
            }
        }

        return tile;
    }
}