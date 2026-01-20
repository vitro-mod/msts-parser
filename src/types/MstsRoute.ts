import { MstsObject } from "./MstsObject";

export class MstsRoute extends MstsObject {

    type: string;
    routeStart?: { tileX: number; tileZ: number; x: number; z: number; };

    constructor() {
        super();

        this.type = 'route';
    }
}
