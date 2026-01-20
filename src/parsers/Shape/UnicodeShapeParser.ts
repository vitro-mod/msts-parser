import { MstsShape, DistanceLevel, Animation, SubObject, IndexedTriList, LightModelCfg, UvOp } from "../../types/MstsShape";
import { IMstsParser } from "../IMstsParser";
import { UnicodeParser } from "../UnicodeParser";
import { TokenID } from "../TokenID";
import { ParserContext } from "../ParserContext";

export class UnicodeShapeParser extends UnicodeParser implements IMstsParser<MstsShape> {

    async parse(): Promise<MstsShape> {

        const result = new MstsShape();
        const context = new ParserContext();

        if (typeof this.data[0] != "string" || this.data[0].toLowerCase() != "shape") {
            throw new Error('This is not a MSTS Shape!');
        }

        const root = this.data[1];

        for (let i = 0; i < root.length; i++) {
            if (typeof root[i] != "string") continue;
            const lower = (root[i] as string).toLowerCase();
            //console.log(" "+i+" "+lower+" "+root[i+1].length);
            
            switch (lower) {
                case this.getTokenName(TokenID.shape_header): {
                    const header = root[i + 1] as any[];
                    result.header = {
                        flag1: parseInt(header[0] as string),
                        flag2: header[1] ? parseInt(header[1] as string) : undefined
                    };
                    break;
                }
                case this.getTokenName(TokenID.volumes): {
                    const volumesData = root[i + 1] as any[];
                    let volumesCount = 0;
                    for (let j = 0; j < volumesData.length; j += 2) {
                        if (typeof volumesData[j] === 'string' && volumesData[j].toLowerCase() === 'vol_sphere') volumesCount++;
                    }
                    result.volumes = new Array(volumesCount);
                    let volumesIdx = 0;
                    this.forEach(volumesData, "vol_sphere", (a: string[]) => {
                        result.volumes[volumesIdx++] = {
                            vector: [parseFloat(a[0]), parseFloat(a[1]), parseFloat(a[2])],
                            radius: parseFloat(a[3])
                        };
                    });
                    break;
                }
                case this.getTokenName(TokenID.texture_filter_names): {
                    const filterData = root[i + 1] as any[];
                    let filterCount = 0;
                    for (let j = 0; j < filterData.length; j += 2) {
                        if (typeof filterData[j] === 'string' && filterData[j].toLowerCase() === 'named_filter_mode') filterCount++;
                    }
                    result.textureFilterNames = new Array(filterCount);
                    let filterIdx = 0;
                    this.forEach(filterData, "named_filter_mode", (a: any[]) => {
                        result.textureFilterNames[filterIdx++] = a[0];
                    });
                    break;
                }
                case this.getTokenName(TokenID.colours): {
                    const coloursData = root[i + 1] as any[];
                    let coloursCount = 0;
                    for (let j = 0; j < coloursData.length; j += 2) {
                        if (typeof coloursData[j] === 'string' && coloursData[j].toLowerCase() === 'colour') coloursCount++;
                    }
                    result.colours = new Array(coloursCount);
                    let coloursIdx = 0;
                    this.forEach(coloursData, "colour", (a: string[]) => {
                        result.colours[coloursIdx++] = [
                            parseFloat(a[0]), // A
                            parseFloat(a[1]), // R
                            parseFloat(a[2]), // G
                            parseFloat(a[3])  // B
                        ];
                    });
                    break;
                }
                case this.getTokenName(TokenID.light_materials): {
                    const lightMatData = root[i + 1] as any[];
                    let lightMatCount = 0;
                    for (let j = 0; j < lightMatData.length; j += 2) {
                        if (typeof lightMatData[j] === 'string' && lightMatData[j].toLowerCase() === 'light_material') lightMatCount++;
                    }
                    result.lightMaterials = new Array(lightMatCount);
                    let lightMatIdx = 0;
                    this.forEach(lightMatData, "light_material", (a: string[]) => {
                        result.lightMaterials[lightMatIdx++] = {
                            flags: parseInt(a[0]),
                            diffColIdx: parseInt(a[1]),
                            ambColIdx: parseInt(a[2]),
                            specColIdx: parseInt(a[3]),
                            emissiveColIdx: parseInt(a[4]),
                            specPower: parseFloat(a[5])
                        };
                    });
                    break;
                }
                case this.getTokenName(TokenID.shader_names): {
                    const shadersData = root[i + 1] as any[];
                    let shadersCount = 0;
                    for (let j = 0; j < shadersData.length; j += 2) {
                        if (typeof shadersData[j] === 'string' && shadersData[j].toLowerCase() === 'named_shader') shadersCount++;
                    }
                    result.shaders = new Array(shadersCount);
                    let shadersIdx = 0;
                    this.forEach(shadersData, "named_shader", (a: any[]) => {
                        result.shaders[shadersIdx++] = a[0];
                    });
                    break;
                }
                case this.getTokenName(TokenID.points): {
                    const pointsData = root[i + 1] as any[];
                    let pointsCount = 0;
                    for (let j = 0; j < pointsData.length; j += 2) {
                        if (typeof pointsData[j] === 'string' && pointsData[j].toLowerCase() === 'point') pointsCount++;
                    }
                    result.points = new Array(pointsCount);
                    let pointsIdx = 0;
                    this.forEach(pointsData, "point", (a: string[]) => {
                        result.points[pointsIdx++] = [
                            parseFloat(a[0]),
                            parseFloat(a[1]),
                            parseFloat(a[2])];
                    });
                    break;
                }
                case this.getTokenName(TokenID.uv_points): {
                    const uvPointsData = root[i + 1] as any[];
                    let uvPointsCount = 0;
                    for (let j = 0; j < uvPointsData.length; j += 2) {
                        if (typeof uvPointsData[j] === 'string' && uvPointsData[j].toLowerCase() === 'uv_point') uvPointsCount++;
                    }
                    result.uvPoints = new Array(uvPointsCount);
                    let uvPointsIdx = 0;
                    this.forEach(uvPointsData, "uv_point", (a: string[]) => {
                        result.uvPoints[uvPointsIdx++] = [
                            parseFloat(a[0]),
                            parseFloat(a[1])];
                    });
                    break;
                }
                case this.getTokenName(TokenID.normals): {
                    const normalsData = root[i + 1] as any[];
                    let normalsCount = 0;
                    for (let j = 0; j < normalsData.length; j += 2) {
                        if (typeof normalsData[j] === 'string' && normalsData[j].toLowerCase() === 'vector') normalsCount++;
                    }
                    result.normals = new Array(normalsCount);
                    let normalsIdx = 0;
                    this.forEach(normalsData, "vector", (a: string[]) => {
                        result.normals[normalsIdx++] = [
                            parseFloat(a[0]),
                            parseFloat(a[1]),
                            parseFloat(a[2])];
                    });
                    break;
                }
                case this.getTokenName(TokenID.sort_vectors): {
                    const sortVecsData = root[i + 1] as any[];
                    let sortVecsCount = 0;
                    for (let j = 0; j < sortVecsData.length; j += 2) {
                        if (typeof sortVecsData[j] === 'string' && sortVecsData[j].toLowerCase() === 'vector') sortVecsCount++;
                    }
                    result.sort_vectors = new Array(sortVecsCount);
                    let sortVecsIdx = 0;
                    this.forEach(sortVecsData, "vector", (a: string[]) => {
                        result.sort_vectors[sortVecsIdx++] = [
                            parseFloat(a[0]),
                            parseFloat(a[1]),
                            parseFloat(a[2])];
                    });
                    break;
                }
                case this.getTokenName(TokenID.matrices): {
                    const matricesData = root[i + 1] as any[];
                    let matricesCount = 0;
                    for (let j = 0; j < matricesData.length; j += 2) {
                        if (typeof matricesData[j] === 'string' && matricesData[j].toLowerCase() === 'matrix') matricesCount++;
                    }
                    result.matrices = new Array(matricesCount);
                    let matricesIdx = 0;
                    this.forEach(matricesData, "matrix", (a: string[], name: any) => {
                        let mat: [number, number, number, number, number, number, number, number, number, number, number, number] = [
                            parseFloat(a[0]), parseFloat(a[1]), parseFloat(a[2]),
                            parseFloat(a[3]), parseFloat(a[4]), parseFloat(a[5]),
                            parseFloat(a[6]), parseFloat(a[7]), parseFloat(a[8]),
                            parseFloat(a[9]), parseFloat(a[10]), parseFloat(a[11])
                        ];
                        result.matrices[matricesIdx++] = {
                            name: name,
                            mat: mat
                        };
                    });
                    break;
                }
                case this.getTokenName(TokenID.images): {
                    const imagesData = root[i + 1] as any[];
                    let imagesCount = 0;
                    for (let j = 0; j < imagesData.length; j += 2) {
                        if (typeof imagesData[j] === 'string' && imagesData[j].toLowerCase() === 'image') imagesCount++;
                    }
                    result.images = new Array(imagesCount);
                    let imagesIdx = 0;
                    this.forEach(imagesData, "image", (a: any[]) => {
                        result.images[imagesIdx++] = a[0];
                    });
                    break;
                }
                case this.getTokenName(TokenID.textures): {
                    const texturesData = root[i + 1] as any[];
                    let texturesCount = 0;
                    for (let j = 0; j < texturesData.length; j += 2) {
                        if (typeof texturesData[j] === 'string' && texturesData[j].toLowerCase() === 'texture') texturesCount++;
                    }
                    result.textures = new Array(texturesCount);
                    let texturesIdx = 0;
                    this.forEach(texturesData, "texture", (a: string[]) => {
                        result.textures[texturesIdx++] = {
                            imageIdx: parseInt(a[0]),
                            filterMode: parseInt(a[1]),
                            mipMapLODBias: parseFloat(a[2]),
                            borderColour: a[3] ? parseInt(a[3]) : undefined
                        };
                    });
                    break;
                }
                case this.getTokenName(TokenID.light_model_cfgs): {
                    const parseLightModelCfg = (a: any) => {
                        const lightModelCfg: LightModelCfg = { flags: 0, uvOps: [] };
                        result.lightModelCfgs.push(lightModelCfg);
                        context.push(TokenID.light_model_cfg, lightModelCfg, Number.MAX_VALUE);
                        this.forEach(a, "uv_ops", parseUvOps);
                    };
                    const parseUvOps = (a: any) => {
                        this.forEach(a, "uv_op_copy", parseUvOpCopy);
                        this.forEach(a, "uv_op_nonuniformscale", parseUvOpNonUniformScale);
                        this.forEach(a, "uv_op_uniformscale", parseUvOpUniformScale);
                        this.forEach(a, "uv_op_reflectmapfull", parseUvOpReflectMapFull);
                    };
                    const parseUvOpCopy = (a: any) => {
                        const uvOp: UvOp = {
                            uvOp: 'copy',
                            texAddrMode: parseInt(a[0]),
                            srcUVIdx: parseInt(a[1]),
                        };
                        context.get<LightModelCfg>(TokenID.light_model_cfg)?.uvOps.push(uvOp);
                    };
                    const parseUvOpNonUniformScale = (a: any) => {
                        const uvOp: UvOp = {
                            uvOp: 'nonuniformscale',
                            texAddrMode: parseInt(a[0]),
                            srcUVIdx: parseInt(a[1]),
                            uScale: parseFloat(a[2]),
                            vScale: parseFloat(a[3]),
                        };
                        context.get<LightModelCfg>(TokenID.light_model_cfg)?.uvOps.push(uvOp);
                    };
                    const parseUvOpUniformScale = (a: any) => {
                        const uvOp: UvOp = {
                            uvOp: 'uniformscale',
                            texAddrMode: parseInt(a[0]),
                            srcUVIdx: parseInt(a[1]),
                            scale: parseFloat(a[2]),
                        };
                        context.get<LightModelCfg>(TokenID.light_model_cfg)?.uvOps.push(uvOp);
                    };
                    const parseUvOpReflectMapFull = function (a: any) {
                        const uvOp: UvOp = {
                            uvOp: 'reflectmapfull',
                            texAddrMode: parseInt(a[0]),
                        };
                        context.get<LightModelCfg>(TokenID.light_model_cfg)?.uvOps.push(uvOp);
                    };
                    this.forEach(root[i + 1], "light_model_cfg", parseLightModelCfg);
                    break;
                }
                case this.getTokenName(TokenID.vtx_states): {
                    const vtxStatesData = root[i + 1] as any[];
                    let vtxStatesCount = 0;
                    for (let j = 0; j < vtxStatesData.length; j += 2) {
                        if (typeof vtxStatesData[j] === 'string' && vtxStatesData[j].toLowerCase() === 'vtx_state') vtxStatesCount++;
                    }
                    result.vtxStates = new Array(vtxStatesCount);
                    let vtxStatesIdx = 0;
                    this.forEach(vtxStatesData, "vtx_state", (a: string[]) => {
                        result.vtxStates[vtxStatesIdx++] = {
                            flags: parseInt(a[0]),
                            matrixIdx: parseInt(a[1]),
                            lightMatIdx: parseInt(a[2]),
                            lightCfgIdx: parseInt(a[3]),
                            lightFlags: parseInt(a[4] || '0')
                        };
                    });
                    break;
                }
                case this.getTokenName(TokenID.prim_states): {
                    const primStatesData = root[i + 1] as any[];
                    let primStatesCount = 0;
                    for (let j = 0; j < primStatesData.length; j += 2) {
                        if (typeof primStatesData[j] === 'string' && primStatesData[j].toLowerCase() === 'prim_state') primStatesCount++;
                    }
                    result.primStates = new Array(primStatesCount);
                    let primStatesIdx = 0;
                    this.forEach(primStatesData, "prim_state", (a: any[]) => {
                        result.primStates[primStatesIdx++] = {
                            flags: parseInt(a[0]),
                            shaderIndex: parseInt(a[1]),
                            texIdxs: a[3].map((el: string) => parseInt(el)).slice(1),
                            zBias: parseFloat(a[4]),
                            vStateIndex: parseInt(a[5]),
                            alphaTestMode: a[6] ? parseInt(a[6]) : undefined,
                            lightCfgIdx: a[7] ? parseInt(a[7]) : undefined,
                            zBufMode: a[8] ? parseInt(a[8]) : undefined
                        };
                    });
                    break;
                }
                case this.getTokenName(TokenID.lod_controls): {
                    const parseDLevelSel = (a: string[]) => {
                        const dLevel = context.get<DistanceLevel>(TokenID.distance_level);
                        if (dLevel != null) {
                            dLevel.dist = parseFloat(a[0]);
                        }
                    };
                    const parseHierarchy = (a: string | any[]) => {
                        const dLevel = context.get<DistanceLevel>(TokenID.distance_level);
                        for (let i = 1; i < a.length; i++) {
                            if (dLevel != null) {
                                dLevel.hierarchy.push(parseInt(a[i]));
                        }
                    }
                };
                const parseDLevelHdr = (a: any) => {
                    this.forEach(a, "dlevel_selection", parseDLevelSel);
                    this.forEach(a, "hierarchy", parseHierarchy);
                };
                const parseVertex = (a: any[]) => {
                    const subObject = context.get<SubObject>(TokenID.sub_object);
                    if (subObject == null) return;
                    const uvData = a[6];
                    let uvIndices: number[] = [];
                    if (Array.isArray(uvData) && uvData.length > 1) {
                        uvIndices = uvData.slice(1).map((v: string) => parseInt(v));
                    }
                    subObject.vertices.push({
                        flags: parseInt(a[0]),
                        index: subObject.vertices.length,
                        pointIndex: parseInt(a[1]),
                        normalIndex: parseInt(a[2]),
                        dayColor: parseInt(a[3]),
                        nightColor: parseInt(a[4]),
                        uvIndices
                    });
                };
                const parseVertices = (a: any) => {
                    this.forEach(a, "vertex", parseVertex);
                };
                const parseVertexSet = (a: string[]) => {
                    const subObject = context.get<SubObject>(TokenID.sub_object);
                    if (subObject == null) return;
                    subObject.vertexSets.push({
                        vtxStateIdx: parseInt(a[0]),
                        startVtxIdx: parseInt(a[1]),
                        vtxCount: parseInt(a[2])
                    });
                };
                const parseVertexSets = (a: any) => {
                    this.forEach(a, "vertex_set", parseVertexSet);
                };
                const parseVertexIdxs = (a: string | any[]) => {
                    const triList = context.get<IndexedTriList>(TokenID.indexed_trilist);
                    for (let i = 1; i < a.length; i++) {
                        if (triList == null) continue;
                        triList.vertexIdxs.push(parseInt(a[i]));
                    }
                };
                const parseNormalIdxs = (a: string | any[]) => {
                    const triList = context.get<IndexedTriList>(TokenID.indexed_trilist);
                    for (let i = 1; i < a.length; i++) {
                        if (triList == null) continue;
                        triList.normalIdxs.push(parseInt(a[i]));
                    }
                };
                const parseTriList = (a: any) => {
                    const triList: IndexedTriList = {
                        vertexIdxs: [],
                        normalIdxs: [],
                        faceFlags: []
                    };
                    const subObject = context.get<SubObject>(TokenID.sub_object);
                    if (subObject == null) return;
                    if (!subObject.triLists) subObject.triLists = [];
                    subObject.triLists.push(triList);
                    context.push(TokenID.indexed_trilist, triList, Number.MAX_VALUE);
                    this.forEach(a, "vertex_idxs", parseVertexIdxs);
                    this.forEach(a, "normal_idxs", parseNormalIdxs);
                };
                const parsePrimStateIdxs = (a: string[]) => {
                    const subObject = context.get<SubObject>(TokenID.sub_object);
                    if (subObject == null) return;
                    if (!subObject.primStateIdxs) subObject.primStateIdxs = [];
                    subObject.primStateIdxs.push(parseInt(a[0]));
                };
                const parsePrimitives = (a: any) => {
                    this.forEach(a, "prim_state_idx", parsePrimStateIdxs);
                    this.forEach(a, "indexed_trilist", parseTriList);
                };
                const parseSubObject = (a: any) => {
                    const subObject: SubObject = {
                        vertices: [],
                        vertexSets: [],
                        primitives: [],
                        primStateIdxs: [],
                        triLists: []
                    };
                    const dLevel = context.get<DistanceLevel>(TokenID.distance_level);
                    if (dLevel == null) return;
                    dLevel.subObjects.push(subObject);
                    context.push(TokenID.sub_object, subObject, Number.MAX_VALUE);
                    this.forEach(a, "vertices", parseVertices);
                    this.forEach(a, "vertex_sets", parseVertexSets);
                    this.forEach(a, "primitives", parsePrimitives);
                };
                const parseSubObjects = (a: any) => {
                    this.forEach(a, "sub_object", parseSubObject);
                };
                const parseDLevel = (a: any) => {
                    const dLevel: DistanceLevel = {
                        header: {
                            dLevelSelection: { visibleDistance: 0 },
                            hierarchy: []
                        },
                        subObjects: [],
                        dist: 0,
                        hierarchy: []
                    };
                    result.distLevels.push(dLevel);
                    context.push(TokenID.distance_level, dLevel, Number.MAX_VALUE);
                    this.forEach(a, "distance_level_header", parseDLevelHdr);
                    this.forEach(a, "sub_objects", parseSubObjects);
                };
                const parseDLevels = (a: any) => {
                    this.forEach(a, "distance_level", parseDLevel);
                };
                const parseLodControl = (a: any) => {
                    this.forEach(a, "distance_levels", parseDLevels);
                };
                this.forEach(root[i + 1], "lod_control", parseLodControl);
                    break;
                }
                case this.getTokenName(TokenID.animations): {
                    const parseLinearKey = (a: string[]) => {
                        const controller = context.get<{ type: string; frame: number; x: number; y: number; z: number; w?: number; }[]>(TokenID.linear_pos);
                        if (!controller) return;
                        controller.push({
                        type: "position",
                        frame: parseInt(a[0]),
                        x: parseFloat(a[1]),
                        y: parseFloat(a[2]),
                        z: parseFloat(a[3])
                    });
                };
                const parseSlerpRot = (a: string[]) => {
                    const controller = context.get<{ type: string; frame: number; x: number; y: number; z: number; w?: number; }[]>(TokenID.slerp_rot);
                    if (!controller) return;
                    controller.push({
                        type: "rotation",
                        frame: parseInt(a[0]),
                        x: parseFloat(a[1]),
                        y: parseFloat(a[2]),
                        z: parseFloat(a[3]),
                        w: parseFloat(a[4])
                    });
                };
                const parseTcbKey = (a: string[]) => {
                    const controller = context.get<{ type: string; frame: number; x: number; y: number; z: number; w?: number; }[]>(TokenID.tcb_rot);
                    if (!controller) return;
                    controller.push({
                        type: "rotation",
                        frame: parseInt(a[0]),
                        x: parseFloat(a[1]),
                        y: parseFloat(a[2]),
                        z: parseFloat(a[3]),
                        w: parseFloat(a[4])
                    });
                };
                const parseTcbRot = (a: any) => {
                    const controller: { type: string; frame: number; x: number; y: number; z: number; w?: number; }[] = [];
                    const animNode = context.get<{ controllers: any; name?: any; }>(TokenID.anim_node);
                    if (!animNode) return;
                    animNode.controllers.push(controller);
                    context.push(TokenID.tcb_rot, controller, Number.MAX_VALUE);
                    this.forEach(a, "tcb_key", parseTcbKey);
                    this.forEach(a, "slerp_rot", parseSlerpRot);
                    context.pop();
                };
                const parseLinearPos = (a: any) => {
                    const controller: { type: string; frame: number; x: number; y: number; z: number; w?: number; }[] = [];
                    const animNode = context.get<{ controllers: any; name?: any; }>(TokenID.anim_node);
                    if (!animNode) return;
                    animNode.controllers.push(controller);
                    context.push(TokenID.linear_pos, controller, Number.MAX_VALUE);
                    this.forEach(a, "linear_key", parseLinearKey);
                    context.pop();
                };
                const parseControllers = (a: any) => {
                    this.forEach(a, "tcb_rot", parseTcbRot);
                    this.forEach(a, "linear_pos", parseLinearPos);
                };
                const parseAnimNode = (a: any, name: any) => {
                    const animNode = {
                        name: name,
                        controllers: []
                    };
                    const animation = context.get<Animation>(TokenID.animation);
                    if (!animation) return;
                    animation.nodes.push(animNode);
                    context.push(TokenID.anim_node, animNode, Number.MAX_VALUE);
                    this.forEach(a, "controllers", parseControllers);
                    context.pop();
                };
                const parseAnimNodes = (a: any) => {
                    this.forEach(a, "anim_node", parseAnimNode);
                };
                const parseAnimation = (a: string[]) => {
                    const animation: Animation = {
                        frames: parseInt(a[0]),
                        frameRate: parseFloat(a[1]),
                        nodes: []
                    };
                    result.animations.push(animation);
                    context.push(TokenID.animation, animation, Number.MAX_VALUE);
                    this.forEach(a, "anim_nodes", parseAnimNodes);
                    context.pop();
                };
                this.forEach(root[i + 1], "animation", parseAnimation);
                    break;
                }
            }
        }

        return result;
    }
}
