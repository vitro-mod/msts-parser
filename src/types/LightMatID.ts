export enum LightMatID {

    specular0 = -1, // for glossmap shader
    specular25 = -2,
    specular750 = -3,
    Fullbright = -4,  // doesn't seem to be rendered at daytime

    /** note you must clear bit 10 of the sub_object_header flags  to 00000000 to enable specular reflection */
    OptSpecular0 = -5, // seems like the normal setting
    OptSpecular25 = -6, // 3DC spec = 100  very shiney specular reflection
    OptSpecular750 = -7, // 3DC spec = 50   slightly shiney specular reflection 

    OptFullbright = -8, // 3DC ambient = 100
    Cruciform = -9, // also for plants etc
    CruciformLong = -10, // sets diffuse = 0, ie for plants etc
    OptHalfbright = -11, // bright all the time
    DarkShade = -12, // 3DC ambient = 0
}
