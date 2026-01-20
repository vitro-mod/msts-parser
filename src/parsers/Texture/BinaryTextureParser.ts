import { MstsTexture } from "../../types/MstsTexture";
import { IMstsParser } from "../IMstsParser";
import { BinaryParser } from "../BinaryParser";

export class BinaryTextureParser extends BinaryParser implements IMstsParser<MstsTexture> {

    async parse(): Promise<MstsTexture> {

        const buf = this.buffer;
        
        // Use DataView for faster reading
        const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);

        const flags = view.getInt32(4, true);
        const wid = view.getInt32(8, true);
        const ht = view.getInt32(12, true);

        view.getInt32(16, true);
        const colors = view.getInt32(20, true);

        let offset = view.getInt32(152 + 16 * colors, true);

        const idata = new ImageData(wid, ht);
        const data = idata.data;
        
        if (flags & 16) { // dxt1
            // Optimization: use DataView for fast reading
            offset += 4;
            let i = 0;
            for (let j = 0; j < ht; j += 4) {
                for (let k = 0; k < wid; k += 4) {
                    const c0 = view.getUint16(offset + i, true);
                    const c1 = view.getUint16(offset + i + 2, true);
                    let bits = view.getUint32(offset + i + 4, true);
                    i += 8;

                    const r0 = (c0 >> 8) & 0xf8;
                    const g0 = (c0 >> 3) & 0xfa;
                    const b0 = (c0 << 3) & 0xf8;
                    const r1 = (c1 >> 8) & 0xf8;
                    const g1 = (c1 >> 3) & 0xfa;
                    const b1 = (c1 << 3) & 0xf8;

                    for (let j1 = 0; j1 < 4; j1++) {
                        for (let k1 = 0; k1 < 4; k1++) {
                            const di = 4 * (k + k1 + wid * (j + j1));

                            switch (bits & 3) {
                                case 0:
                                    data[di] = r0;
                                    data[di + 1] = g0;
                                    data[di + 2] = b0;
                                    data[di + 3] = 255;
                                    break;
                                case 1:
                                    data[di] = r1;
                                    data[di + 1] = g1;
                                    data[di + 2] = b1;
                                    data[di + 3] = 255;
                                    break;
                                case 2:
                                    if (c0 > c1) {
                                        data[di] = (2 * r0 + r1) / 3;
                                        data[di + 1] = (2 * g0 + g1) / 3;
                                        data[di + 2] = (2 * b0 + b1) / 3;
                                    } else {
                                        data[di] = (r0 + r1) / 2;
                                        data[di + 1] = (g0 + g1) / 2;
                                        data[di + 2] = (b0 + b1) / 2;
                                    }
                                    data[di + 3] = 255;
                                    break;
                                case 3:
                                    if (c0 > c1) {
                                        data[di] = (r0 + 2 * r1) / 3;
                                        data[di + 1] = (g0 + 2 * g1) / 3;
                                        data[di + 2] = (b0 + 2 * b1) / 3;
                                        data[di + 3] = 255;
                                    } else {
                                        data[di] = 0;
                                        data[di + 1] = 0;
                                        data[di + 2] = 0;
                                        data[di + 3] = 0;
                                    }
                                    break;
                            }
                            bits >>= 2;
                        }
                    }
                }
            }
        } else {
            // Optimization: create Uint8Array view for fast byte access
            const bytes = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
            
            let rowSize = 3 * wid;
            if (colors > 3) rowSize += wid / 8;
            if (colors > 4) rowSize += wid;

            for (let i = 0; i < ht; i++) {
                for (let j = 0; j < wid; j++) {
                    let o = offset + i * rowSize;
                    let k = 4 * (j + wid * i);
                    data[k] = bytes[o + j];
                    data[k + 1] = bytes[o + wid + j];
                    data[k + 2] = bytes[o + 2 * wid + j];
                    if (colors == 3)
                        data[k + 3] = 255;
                    else if (colors == 5)
                        data[k + 3] = bytes[o + 3 * wid + wid / 8 + j];
                    else if (colors == 4) {
                        const maskByte = bytes[o + 3 * wid + Math.floor(j / 8)];
                        const bit = (maskByte >> 7 - (j % 8)) & 1;
                        data[k + 3] = bit ? 255 : 0;
                    }
                }
            }
        }

        const bitmap = await createImageBitmap(idata, { premultiplyAlpha: 'none' });
        const texture = new MstsTexture(bitmap);

        return texture;
    }
}
