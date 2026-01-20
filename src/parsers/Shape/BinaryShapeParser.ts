import { 
    MstsShape, 
    DistanceLevel, 
    SubObject, 
    PrimState, 
    IndexedTriList, 
    Animation, 
    AnimNode, 
    LightModelCfg,
    Controller,
    LinearKey,
    TcbKey,
    Vertex,
    UvOp
} from "../../types/MstsShape";
import { BinaryParser } from "../BinaryParser";
import { TokenID } from "../TokenID";
import { IMstsParser } from "../IMstsParser";
import { ParserContext } from "../ParserContext";

export class BinaryShapeParser extends BinaryParser implements IMstsParser<MstsShape> {

    async parse(): Promise<MstsShape> {

        const result = new MstsShape();
        const context = new ParserContext();

        for (; this.offset < this.buffer.length;) {
            const code = this.getInt();
            if (code == 0) break;

            /** length of the block */
            const len = this.getInt();

            /** beginning offset of the block */
            const offset0 = this.offset;
            
            /** end offset of the block */
            const offsetEnd = offset0 + len;

            // Before processing the token, remove all finished blocks from the stack
            context.popFinishedBlocks(offset0);

            switch (code) {
                case TokenID.shape_header:
                    this.getString();
                    result.header = {
                        flag1: this.getInt(),
                        flag2: this.offset < offsetEnd ? this.getInt() : undefined
                    };
                    this.offset = offsetEnd;
                    break;
                case TokenID.volumes:
                    this.getString();
                    const volumesCount = this.getInt();
                    result.volumes = new Array(volumesCount);
                    context.push(TokenID.volumes, { index: 0 }, offsetEnd);
                    break;
                case TokenID.vol_sphere:
                    this.getString();
                    const volumesCtx = context.get<{ index: number }>(TokenID.volumes);
                    if (volumesCtx) {
                        result.volumes[volumesCtx.index++] = {
                            vector: [this.getFloat(), this.getFloat(), this.getFloat()],
                            radius: this.getFloat()
                        };
                    } else {
                        this.getFloat(); this.getFloat(); this.getFloat(); this.getFloat();
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.texture_filter_names:
                    this.getString();
                    const filterNamesCount = this.getInt();
                    result.textureFilterNames = new Array(filterNamesCount);
                    context.push(TokenID.texture_filter_names, { index: 0 }, offsetEnd);
                    break;
                case TokenID.named_filter_mode:
                    this.getString();
                    const filterNamesCtx = context.get<{ index: number }>(TokenID.texture_filter_names);
                    if (filterNamesCtx) {
                        result.textureFilterNames[filterNamesCtx.index++] = this.getStringU(this.getShort());
                    } else {
                        this.getStringU(this.getShort());
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.colours:
                    this.getString();
                    const coloursCount = this.getInt();
                    result.colours = new Array(coloursCount);
                    context.push(TokenID.colours, { index: 0 }, offsetEnd);
                    break;
                case TokenID.colour:
                    this.getString();
                    const coloursCtx = context.get<{ index: number }>(TokenID.colours);
                    if (coloursCtx) {
                        result.colours[coloursCtx.index++] = [
                            this.getFloat(), // A
                            this.getFloat(), // R
                            this.getFloat(), // G
                            this.getFloat()  // B
                        ];
                    } else {
                        this.getFloat(); this.getFloat(); this.getFloat(); this.getFloat();
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.light_materials:
                    this.getString();
                    const lightMaterialsCount = this.getInt();
                    result.lightMaterials = new Array(lightMaterialsCount);
                    context.push(TokenID.light_materials, { index: 0 }, offsetEnd);
                    break;
                case TokenID.light_material:
                    this.getString();
                    const lightMaterialsCtx = context.get<{ index: number }>(TokenID.light_materials);
                    if (lightMaterialsCtx) {
                        result.lightMaterials[lightMaterialsCtx.index++] = {
                            flags: this.getInt(),
                            diffColIdx: this.getInt(),
                            ambColIdx: this.getInt(),
                            specColIdx: this.getInt(),
                            emissiveColIdx: this.getInt(),
                            specPower: this.getFloat()
                        };
                    } else {
                        this.getInt(); this.getInt(); this.getInt(); this.getInt(); this.getInt(); this.getFloat();
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.distance_levels_header:
                    this.getString();
                    this.getInt(); // DlevBias
                    if (this.offset < offsetEnd) this.getFloat(); // DlevScale
                    this.offset = offsetEnd;
                    break;
                case TokenID.vertex_sets:
                    this.getString();
                    this.getInt(); // num_vertex_sets
                    context.push(TokenID.vertex_sets, {}, offsetEnd);
                    break;
                case TokenID.vertex_set:
                    this.getString();
                    const vertexSet = context.get<SubObject>(TokenID.sub_object);
                    if (vertexSet) {
                        vertexSet.vertexSets.push({
                            vtxStateIdx: this.getInt(),
                            startVtxIdx: this.getInt(),
                            vtxCount: this.getInt()
                        });
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.normal_idxs:
                    this.getString();
                    const numNormalIdxs = this.getInt();
                    const normalIdxsTriList = context.get<IndexedTriList>(TokenID.indexed_trilist);
                    if (normalIdxsTriList) {
                        normalIdxsTriList.normalIdxs = new Array(numNormalIdxs);
                        for (let j = 0; j < numNormalIdxs; j++) {
                            normalIdxsTriList.normalIdxs[j] = this.getInt();
                        }
                    } else {
                        for (let j = 0; j < numNormalIdxs; j++) this.getInt();
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.flags:
                    this.getString();
                    const numFlags = this.getInt();
                    const flagsTriList = context.get<IndexedTriList>(TokenID.indexed_trilist);
                    if (flagsTriList) {
                        flagsTriList.faceFlags = new Array(numFlags);
                        for (let j = 0; j < numFlags; j++) {
                            flagsTriList.faceFlags[j] = this.getInt();
                        }
                    } else {
                        for (let j = 0; j < numFlags; j++) this.getInt();
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.shader_names:
                    this.getString();
                    const shadersCount = this.getInt();
                    result.shaders = new Array(shadersCount);
                    context.push(TokenID.shader_names, { index: 0 }, offsetEnd);
                    break;
                case TokenID.points:
                    this.getString();
                    const pointsCount = this.getInt();
                    result.points = new Array(pointsCount);
                    context.push(TokenID.points, { index: 0 }, offsetEnd);
                    break;
                case TokenID.uv_points:
                    this.getString();
                    const uvPointsCount = this.getInt();
                    result.uvPoints = new Array(uvPointsCount);
                    context.push(TokenID.uv_points, { index: 0 }, offsetEnd);
                    break;
                case TokenID.normals:
                    this.getString();
                    const normalsCount = this.getInt();
                    result.normals = new Array(normalsCount);
                    context.push(TokenID.normals, { index: 0 }, offsetEnd);
                    break;
                case TokenID.sort_vectors:
                    this.getString();
                    const sortVectorsCount = this.getInt();
                    result.sort_vectors = new Array(sortVectorsCount);
                    context.push(TokenID.sort_vectors, { index: 0 }, offsetEnd);
                    break;
                case TokenID.matrices:
                    this.getString();
                    const matricesCount = this.getInt();
                    result.matrices = new Array(matricesCount);
                    context.push(TokenID.matrices, { index: 0 }, offsetEnd);
                    break;
                case TokenID.images:
                    this.getString();
                    const imagesCount = this.getInt();
                    result.images = new Array(imagesCount);
                    context.push(TokenID.images, { index: 0 }, offsetEnd);
                    break;
                case TokenID.textures:
                    this.getString();
                    const texturesCount = this.getInt();
                    result.textures = new Array(texturesCount);
                    context.push(TokenID.textures, { index: 0 }, offsetEnd);
                    break;
                case TokenID.light_model_cfgs:
                    this.getString();
                    const lightModelCfgsCount = this.getInt();
                    result.lightModelCfgs = new Array(lightModelCfgsCount);
                    context.push(TokenID.light_model_cfgs, { index: 0 }, offsetEnd);
                    break;
                case TokenID.uv_ops:
                    this.getString();
                    this.getInt();
                    context.push(TokenID.uv_ops, {}, offsetEnd);
                    break;
                case TokenID.vtx_states:
                    this.getString();
                    const vtxStatesCount = this.getInt();
                    result.vtxStates = new Array(vtxStatesCount);
                    context.push(TokenID.vtx_states, { index: 0 }, offsetEnd);
                    break;
                case TokenID.prim_states:
                    this.getString();
                    const primStatesCount = this.getInt();
                    result.primStates = new Array(primStatesCount);
                    context.push(TokenID.prim_states, { index: 0 }, offsetEnd);
                    break;
                case TokenID.lod_controls:
                    this.getString();
                    this.getInt();
                    context.push(TokenID.lod_controls, {}, offsetEnd);
                    break;
                case TokenID.distance_levels:
                    this.getString();
                    const distLevelsCount = this.getInt();
                    result.distLevels = new Array(distLevelsCount);
                    context.push(TokenID.distance_levels, { index: 0 }, offsetEnd);
                    break;
                case TokenID.sub_objects:
                    this.getString();
                    this.getInt();
                    context.push(TokenID.sub_objects, {}, offsetEnd);
                    break;
                case TokenID.vertices:
                    this.getString();
                    const verticesCount = this.getInt();
                    const verticesSubObject = context.get<SubObject>(TokenID.sub_object);
                    if (verticesSubObject) {
                        verticesSubObject.vertices = new Array(verticesCount);
                    }
                    context.push(TokenID.vertices, { index: 0 }, offsetEnd);
                    break;
                case TokenID.primitives:
                    this.getString();
                    this.getInt();
                    context.push(TokenID.primitives, {}, offsetEnd);
                    break;
                case TokenID.anim_nodes:
                    this.getString();
                    this.getInt();
                    context.push(TokenID.anim_nodes, {}, offsetEnd);
                    break;
                case TokenID.shape:
                    this.getString();
                    context.push(TokenID.shape, result, offsetEnd);
                    break;
                case TokenID.lod_control:
                    this.getString();
                    context.push(TokenID.lod_control, {}, offsetEnd);
                    break;
                case TokenID.distance_level_header:
                    this.getString();
                    context.push(TokenID.distance_level_header, {}, offsetEnd);
                    break;
                case TokenID.indexed_trilist:
                    this.getString();
                    break;
                case TokenID.named_shader:
                    this.getString();
                    const shadersCtx = context.get<{ index: number }>(TokenID.shader_names);
                    if (shadersCtx) {
                        result.shaders[shadersCtx.index++] = this.getStringU(this.getShort());
                    } else {
                        this.getStringU(this.getShort());
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.point:
                    this.getString();
                    const pointCtx = context.get<{ index: number }>(TokenID.points);
                    if (pointCtx) {
                        result.points[pointCtx.index++] = [this.getFloat(), this.getFloat(), this.getFloat()];
                    } else {
                        this.getFloat(); this.getFloat(); this.getFloat();
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.uv_point:
                    this.getString();
                    const uvPointCtx = context.get<{ index: number }>(TokenID.uv_points);
                    if (uvPointCtx) {
                        result.uvPoints[uvPointCtx.index++] = [this.getFloat(), this.getFloat()];
                    } else {
                        this.getFloat(); this.getFloat();
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.vector:
                    this.getString();
                    const vec: [number, number, number] = [this.getFloat(), this.getFloat(), this.getFloat()];
                    const normalsCtx = context.get<{ index: number }>(TokenID.normals);
                    const sortVectorsCtx = context.get<{ index: number }>(TokenID.sort_vectors);
                    if (normalsCtx) {
                        result.normals[normalsCtx.index++] = vec;
                    } else if (sortVectorsCtx) {
                        result.sort_vectors[sortVectorsCtx.index++] = vec;
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.matrix:
                    const matName = this.getString();
                    const matValues: [number, number, number, number, number, number, number, number, number, number, number, number] = [
                        this.getFloat(), this.getFloat(), this.getFloat(),
                        this.getFloat(), this.getFloat(), this.getFloat(),
                        this.getFloat(), this.getFloat(), this.getFloat(),
                        this.getFloat(), this.getFloat(), this.getFloat()
                    ];
                    const matricesCtx = context.get<{ index: number }>(TokenID.matrices);
                    if (matricesCtx) {
                        result.matrices[matricesCtx.index++] = { name: matName, mat: matValues };
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.image:
                    this.getString();
                    const imagesCtx = context.get<{ index: number }>(TokenID.images);
                    if (imagesCtx) {
                        result.images[imagesCtx.index++] = this.getStringU(this.getShort());
                    } else {
                        this.getStringU(this.getShort());
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.texture:
                    this.getString();
                    const imageIdx = this.getInt();
                    const filterMode = this.getInt();
                    const mipMapLODBias = this.getFloat();
                    const borderColour = len > 13 ? this.getInt() : undefined;
                    const texturesCtx = context.get<{ index: number }>(TokenID.textures);
                    if (texturesCtx) {
                        result.textures[texturesCtx.index++] = { imageIdx, filterMode, mipMapLODBias, borderColour };
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.light_model_cfg:
                    const lightModelCfg: LightModelCfg = { flags: 0, uvOps: [] };
                    this.getString();
                    lightModelCfg.flags = this.getInt();
                    const lightModelCfgsCtx = context.get<{ index: number }>(TokenID.light_model_cfgs);
                    if (lightModelCfgsCtx) {
                        result.lightModelCfgs[lightModelCfgsCtx.index++] = lightModelCfg;
                    }
                    context.push(TokenID.light_model_cfg, lightModelCfg, offsetEnd);
                    this.offset = offsetEnd;
                    break;
                case TokenID.uv_op_copy:
                    this.getString();
                    const uvOpCopy: UvOp = { uvOp: 'copy', texAddrMode: this.getInt(), srcUVIdx: this.getInt() };
                    context.get<LightModelCfg>(TokenID.light_model_cfg)?.uvOps.push(uvOpCopy);
                    this.offset = offsetEnd;
                    break;
                case TokenID.uv_op_nonuniformscale:
                    this.getString();
                    const uvOpNonUniform: UvOp = { uvOp: 'nonuniformscale', texAddrMode: this.getInt(), srcUVIdx: this.getInt(), uScale: this.getFloat(), vScale: this.getFloat() };
                    context.get<LightModelCfg>(TokenID.light_model_cfg)?.uvOps.push(uvOpNonUniform);
                    this.offset = offsetEnd;
                    break;
                case TokenID.uv_op_uniformscale:
                    this.getString();
                    const uvOpUniform: UvOp = { uvOp: 'uniformscale', texAddrMode: this.getInt(), srcUVIdx: this.getInt(), scale: this.getFloat() };
                    context.get<LightModelCfg>(TokenID.light_model_cfg)?.uvOps.push(uvOpUniform);
                    this.offset = offsetEnd;
                    break;
                case TokenID.uv_op_reflectmapfull:
                    this.getString();
                    const uvOpReflect: UvOp = { uvOp: 'reflectmapfull', texAddrMode: this.getInt() };
                    context.get<LightModelCfg>(TokenID.light_model_cfg)?.uvOps.push(uvOpReflect);
                    this.offset = offsetEnd;
                    break;
                case TokenID.vtx_state:
                    this.getString();
                    const flags = this.getInt();
                    const matrixIdx = this.getInt();
                    const lightMatIdx = this.getInt();
                    const lightCfgIdx = this.getInt();
                    const vtxStatesCtx = context.get<{ index: number }>(TokenID.vtx_states);
                    if (vtxStatesCtx) {
                        result.vtxStates[vtxStatesCtx.index++] = { 
                            flags, 
                            matrixIdx, 
                            lightMatIdx, 
                            lightCfgIdx, 
                            lightFlags: 0 
                        };
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.prim_state:
                    const primState: PrimState = {
                        flags: 0,
                        shaderIndex: 0,
                        texIdxs: [],
                        zBias: 0,
                        vStateIndex: 0,
                        alphaTestMode: 0,
                        zBufMode: 0
                    };
                    const primStatesCtx = context.get<{ index: number }>(TokenID.prim_states);
                    if (primStatesCtx) {
                        result.primStates[primStatesCtx.index++] = primState;
                    }
                    context.push(TokenID.prim_state, primState, offsetEnd);
                    this.getString()
                    primState.flags = this.getInt();
                    primState.shaderIndex = this.getInt();
                    this.getInt(); // tex_idxs token
                    this.getInt(); // tex_idxs length
                    this.getString()
                    var n = this.getInt();
                    primState.texIdxs = new Array(n);
                    for (let j = 0; j < n; j++) {
                        primState.texIdxs[j] = this.getInt();
                    }
                    primState.zBias = this.getFloat();
                    primState.vStateIndex = this.getInt();
                    if (this.offset < offsetEnd) {
                        n = offsetEnd - this.offset;
                        if (n >= 4) {
                            primState.alphaTestMode = this.getInt();
                            n -= 4;
                        }
                        if (n >= 4) {
                            primState.lightCfgIdx = this.getInt();
                            n -= 4;
                        }
                        if (n >= 4) {
                            primState.zBufMode = this.getInt();
                            n -= 4;
                        }
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.distance_level:
                    this.getString()
                    const distLevel: DistanceLevel = { 
                        header: {
                            dLevelSelection: { visibleDistance: 0 },
                            hierarchy: []
                        },
                        subObjects: [],
                        dist: 0,
                        hierarchy: []
                    };
                    const distLevelsCtx = context.get<{ index: number }>(TokenID.distance_levels);
                    if (distLevelsCtx) {
                        result.distLevels[distLevelsCtx.index++] = distLevel;
                    }
                    context.push(TokenID.distance_level, distLevel, offsetEnd);
                    break;
                case TokenID.dlevel_selection:
                    this.getString();
                    const dist = this.getFloat();
                    const currentDistLevel = context.get<DistanceLevel>(TokenID.distance_level);
                    if (currentDistLevel) currentDistLevel.dist = dist;
                    this.offset = offsetEnd;
                    break;
                case TokenID.hierarchy:
                    this.getString();
                    var n = this.getInt();
                    const hierarchyDistLevel = context.get<DistanceLevel>(TokenID.distance_level);
                    if (hierarchyDistLevel) {
                        const hierarchyArray = new Array(n);
                        for (let j = 0; j < n; j++) {
                            hierarchyArray[j] = this.getInt();
                        }
                        hierarchyDistLevel.hierarchy = hierarchyArray;
                    } else {
                        // Skip data if no context
                        for (let j = 0; j < n; j++) this.getInt();
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.sub_object:
                    this.getString();
                    const subObject: SubObject = { 
                        vertices: [], 
                        vertexSets: [], 
                        primitives: [],
                        primStateIdxs: [], 
                        triLists: []
                    };
                    const subObjDistLevel = context.get<DistanceLevel>(TokenID.distance_level);
                    if (subObjDistLevel) subObjDistLevel.subObjects.push(subObject);
                    context.push(TokenID.sub_object, subObject, offsetEnd);
                    break;
                case TokenID.sub_object_header:
                    this.getString();
                    const subObjFlags = this.getInt(); // flags
                    const sortVectorIdx = this.getInt();
                    const volIdx = this.getInt();
                    const headerSubObject = context.get<SubObject>(TokenID.sub_object);
                    if (headerSubObject) {
                        headerSubObject.header = {
                        flags: subObjFlags,
                        sortVectorIdx,
                        volIdx,
                        srcVtxFmtFlags: 0,
                        dstVtxFmtFlags: 0,
                        geometryInfo: {
                            faceNormals: 0,
                            txLightCmds: 0,
                            nodeXTxLightCmds: 0,
                            trilistIdxs: 0,
                            lineListIdxs: 0,
                            nodeXTrilistIdxs: 0,
                            trilists: 0,
                            lineLists: 0,
                            ptLists: 0,
                            nodeXTrilists: 0,
                            geomNodes: [],
                            geomNodeMap: []
                        }
                    };
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.vertex:
                    // let o = this.offset;
                    this.getString()
                    const vertexFlags = this.getInt();
                    const pointIndex = this.getInt();
                    const normalIndex = this.getInt();
                    const dayColor = this.getInt();
                    const nightColor = this.getInt();
                    let uvIndices: number[];
                    {
                        this.getInt(); // vertex_uvs token
                        this.getInt(); // vertex_uvs length
                        this.getString()
                        var nuv = this.getInt();
                        uvIndices = new Array(nuv);
                        for (let k = 0; k < nuv; k++) uvIndices[k] = this.getInt();
                    }
                    const vertexSubObject = context.get<SubObject>(TokenID.sub_object);
                    const verticesCtx = context.get<{ index: number }>(TokenID.vertices);
                    if (vertexSubObject && verticesCtx) {
                        const vertex: Vertex = { 
                            flags: vertexFlags,
                            index: verticesCtx.index,
                            pointIndex, 
                            normalIndex, 
                            dayColor, 
                            nightColor,
                            uvIndices
                        };
                        vertexSubObject.vertices[verticesCtx.index++] = vertex;
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.prim_state_idx:
                    this.getString();
                    const primIdxSubObject = context.get<SubObject>(TokenID.sub_object);
                    if (primIdxSubObject) {
                        if (!primIdxSubObject.primStateIdxs) primIdxSubObject.primStateIdxs = [];
                        primIdxSubObject.primStateIdxs.push(this.getInt());
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.vertex_idxs:
                    this.getString()
                    var n = this.getInt();
                    const triList: IndexedTriList = {
                        vertexIdxs: new Array(n),
                        normalIdxs: [],
                        faceFlags: []
                    };
                    for (var j = 0; j < n; j++) {
                        triList.vertexIdxs[j] = this.getInt();
                    }
                    const triListSubObject = context.get<SubObject>(TokenID.sub_object);
                    if (triListSubObject) {
                        if (!triListSubObject.triLists) triListSubObject.triLists = [];
                        triListSubObject.triLists.push(triList);
                    }
                    context.push(TokenID.indexed_trilist, triList, offsetEnd);
                    this.offset = offsetEnd;
                    break;
                case TokenID.animations:
                    this.getString();
                    const animationsCount = this.getInt();
                    result.animations = new Array(animationsCount);
                    context.push(TokenID.animations, { index: 0 }, offsetEnd);
                    break;
                case TokenID.animation:
                    this.getString();
                    const animation: Animation = {
                        frames: this.getInt(),
                        frameRate: this.getInt(),
                        nodes: []
                    };
                    const animationsCtx = context.get<{ index: number }>(TokenID.animations);
                    if (animationsCtx) {
                        result.animations[animationsCtx.index++] = animation;
                    }
                    context.push(TokenID.animation, animation, offsetEnd);
                    this.offset = offsetEnd;
                    break;
                case TokenID.anim_node:
                    const animNode: AnimNode = {
                        name: this.getString(),
                        controllers: []
                    };
                    const nodeAnimation = context.get<Animation>(TokenID.animation);
                    if (nodeAnimation) nodeAnimation.nodes.push(animNode);
                    context.push(TokenID.anim_node, animNode, offsetEnd);
                    this.offset = offsetEnd;
                    break;
                case TokenID.controllers:
                    this.getString();
                    this.getInt();
                    context.push(TokenID.controllers, {}, offsetEnd);
                    break;
                case TokenID.linear_pos:
                    this.getString();
                    this.getInt();
                    const linearPosController: Controller = {
                        type: 'linear_pos',
                        keys: []
                    };
                    const linearPosAnimNode = context.get<AnimNode>(TokenID.anim_node);
                    if (linearPosAnimNode) linearPosAnimNode.controllers.push(linearPosController);
                    context.push(TokenID.linear_pos, linearPosController, offsetEnd);
                    this.offset = offsetEnd;
                    break;
                case TokenID.tcb_pos:
                    this.offset = offsetEnd;
                    break;
                case TokenID.slerp_rot:
                    this.getString();
                    const slerpNumKeys = this.getInt();
                    const slerpRotController: Controller = {
                        type: 'slerp_rot',
                        keys: new Array(slerpNumKeys)
                    };
                    const slerpRotAnimNode = context.get<AnimNode>(TokenID.anim_node);
                    if (slerpRotAnimNode) slerpRotAnimNode.controllers.push(slerpRotController);
                    context.push(TokenID.slerp_rot, slerpRotController, offsetEnd);
                    // Parse all keys in this block
                    for (let i = 0; i < slerpNumKeys; i++) {
                        const frame = this.getInt();
                        const x = this.getFloat();
                        const y = this.getFloat();
                        const z = this.getFloat();
                        const w = this.getFloat();
                        slerpRotController.keys[i] = {
                            frame, x, y, z, w,
                            tension: 0,
                            continuity: 0,
                            bias: 0,
                            in: 0,
                            out: 0
                        };
                    }
                    this.offset = offsetEnd;
                    break;
                case TokenID.tcb_rot:
                    this.getString();
                    this.getInt();
                    const tcbRotController: Controller = {
                        type: 'tcb_rot',
                        keys: []
                    };
                    const tcbRotAnimNode = context.get<AnimNode>(TokenID.anim_node);
                    if (tcbRotAnimNode) tcbRotAnimNode.controllers.push(tcbRotController);
                    context.push(TokenID.tcb_rot, tcbRotController, offsetEnd);
                    this.offset = offsetEnd;
                    break;
                case TokenID.linear_key:
                    this.getString();
                    const linear_key: LinearKey = {
                        frame: this.getInt(),
                        x: this.getFloat(),
                        y: this.getFloat(),
                        z: this.getFloat()
                    };
                    const linearKeyController = context.get<Controller>(TokenID.linear_pos);
                    if (linearKeyController) linearKeyController.keys.push(linear_key);
                    this.offset = offsetEnd;
                    break;
                case TokenID.tcb_key:
                    this.getString();
                    const tcb_key: TcbKey = {
                        frame: this.getInt(),
                        x: this.getFloat(),
                        y: this.getFloat(),
                        z: this.getFloat(),
                        w: this.getFloat(),
                        tension: this.getFloat(),
                        continuity: this.getFloat(),
                        bias: this.getFloat(),
                        in: this.getFloat(),
                        out: this.getFloat()
                    };
                    const tcbKeyController = context.get<Controller>(TokenID.tcb_rot);
                    if (tcbKeyController) tcbKeyController.keys.push(tcb_key);
                    this.offset = offsetEnd;
                    break;
                case TokenID.comment:
                    this.offset = offsetEnd;
                    break;
                default:
                    this.offset = offsetEnd;
                    break;
            }
        }

        return result;
    }
}
