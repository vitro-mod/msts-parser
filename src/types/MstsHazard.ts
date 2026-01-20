import { MstsObject } from "./MstsObject";

export class MstsHazard extends MstsObject {

    type: string;
    shape: string;

    constructor() {
        super();

        this.type = 'hazard';
        this.shape = '';
    }
}
