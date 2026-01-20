import { MstsDataBuffer } from "../utils/MstsData";
import { MstsObject } from "./MstsObject";

export class MstsRaw extends MstsObject {

    type: string;
    data: MstsDataBuffer;

    constructor(data: MstsDataBuffer) {
        super();

        this.type = 'raw';
        this.data = data;
    }
}
