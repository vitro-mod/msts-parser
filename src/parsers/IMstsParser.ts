import { MstsObject } from "../types/MstsObject";

export interface IMstsParser<T extends MstsObject> {
    parse(): Promise<T>;
}
