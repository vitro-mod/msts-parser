import { MstsObject } from "./MstsObject";

// ImageBitmap type declaration for non-DOM environments
declare global {
    interface ImageBitmap {
        readonly width: number;
        readonly height: number;
        close(): void;
    }
}

export class MstsTexture extends MstsObject {

    type: string;
    bitmap: ImageBitmap;

    constructor(bitmap: ImageBitmap) {
        super();

        this.type = 'texture';
        this.bitmap = bitmap;
    }
}
