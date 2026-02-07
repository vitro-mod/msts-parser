import { MstsObject } from "./MstsObject";

export type TelepoleWirePoint = {
    x: number;
    y: number;
    z: number;
};

export type TelepoleConfig = {
    fileName: string;
    shadowFileName?: string;
    separation?: number;
    wires: TelepoleWirePoint[];
};

export type TelepoleConfigData = {
    configs: TelepoleConfig[];
};

export class MstsTelepoleConfigData extends MstsObject {

    type: string;
    configs: TelepoleConfig[];

    constructor() {
        super();

        this.type = 'telepoleconfigdata';
        this.configs = [];
    }
}
