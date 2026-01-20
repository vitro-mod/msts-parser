export type MstsDataBuffer = Buffer;

export type MstsDataTree = (string | MstsDataTree)[];

export type MstsData = (MstsDataBuffer | MstsDataTree);
