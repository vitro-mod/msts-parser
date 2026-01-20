import { MstsObject } from "./MstsObject";

export class MstsWorld extends MstsObject {

    type: string;
    objects: Array<any>

    constructor() {
        super();

        this.type = 'world';
        this.objects = [];
    }
}
