import { MstsData, MstsDataBuffer, MstsDataTree } from "../utils/MstsData";
import { Buffer } from "buffer";

export abstract class BaseParser {

    data: MstsData;

    constructor(data: MstsData) {
        this.data = data;
    }

    isMstsDataTree(data: MstsData): data is MstsDataTree {
        return Array.isArray(data);
    }

    isMstsDataBuffer(data: MstsData): data is MstsDataBuffer {
        return Buffer.isBuffer(data);
    }
}
