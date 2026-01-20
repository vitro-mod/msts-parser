import { Buffer } from "buffer";
import { MstsData } from "../utils/MstsData";

export interface IMstsReader {

    buffer: Buffer;

    read(): MstsData
}
