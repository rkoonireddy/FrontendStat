import {PipelineModel} from "../types/dataType";
import {createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../store";
import {BlockModel} from "../types/responseType";
import {createEdges} from "../util/util";
import {downloadPythonScript} from "../util/fileUtil";
import {createNodesFromBlocks} from "../util/blockUtil";
import {
    connectTwoBlocks,
    createNewBlock,
    createNewPipeline, deletePipelineThunk,
    executePipeline, fetchExportPipeline,
    fetchFullBlock, fetchUpdateBlock, putBlockToPipeline,
    updatePipeline
} from "./pipelineThunk";


export interface IPipelineState {
    pipelineModel: PipelineModel
    blocks: BlockModel[]
    activeBlockId: string | null
    frequency: number
    loading: boolean,
    errorStatus: boolean,
    errorMessage: string | null,
    deletePipelinePopup: boolean,
    controls: {
        [blockId: string]: {
            [controlName: string]: any
        }
    },
    reactFlowNodes: {
        nodeId: string,
        position: {
            x: number,
            y: number
        }
    }[],
}

const initialPipelineModel: PipelineModel = {
    id: '',
    type: '',
    block_dict: {},
    edge_dict: {},
};

const initialState: IPipelineState = {
    pipelineModel: initialPipelineModel,
    blocks: [],
    activeBlockId: null,
    frequency: 200,
    loading: false,
    errorStatus: false,
    errorMessage: null,
    deletePipelinePopup: false,
    controls: {},
    reactFlowNodes: [],
}




export const pipelineSlice = createSlice({
    name: 'pipeline',
    initialState,
    reducers: {
        resetPipelineData: (state) => {
            console.log("resetPipelineData")
            state.pipelineModel = initialPipelineModel;
            state.blocks = [];
            state.activeBlockId = null;
            state.frequency = 60;
            state.loading = false;
            state.errorStatus = false;
            state.errorMessage = null;
            state.deletePipelinePopup = false;
            state.controls = {};
            state.reactFlowNodes = [];
        },
        setBlocks: (state, action: PayloadAction<BlockModel[]>) => {
            state.blocks = action.payload;
        },
        setBlockHistoryVisible: (state, action: PayloadAction<boolean>) => {
            const blockToUpdate = state.blocks.find(block => block.id === state.activeBlockId);
            if (blockToUpdate) {
                blockToUpdate.config_params = {
                    ...blockToUpdate.config_params,
                    historyVisible: action.payload
                };
            }
        },
        setBlockHistoryExpanded: (state, action: PayloadAction<boolean>) => {
            const blockToUpdate = state.blocks.find(block => block.id === state.activeBlockId);
            if (blockToUpdate) {
                blockToUpdate.config_params = {
                    ...blockToUpdate.config_params,
                    historyExpanded: action.payload
                };
            }

        },
        setBlockControlsVisible: (state, action: PayloadAction<boolean>) => {
            const blockToUpdate = state.blocks.find(block => block.id === state.activeBlockId);
            if (blockToUpdate) {
                blockToUpdate.config_params = {
                    ...blockToUpdate.config_params,
                    controlsVisible: action.payload
                };
            }
        },
        setBlockControlsExpanded: (state, action: PayloadAction<boolean>) => {
            const blockToUpdate = state.blocks.find(block => block.id === state.activeBlockId);
            if (blockToUpdate) {
                blockToUpdate.config_params = {
                    ...blockToUpdate.config_params,
                    controlsExpanded: action.payload
                };
            }
        },
        setActiveBlockId(state, action: PayloadAction<string>) {
            state.activeBlockId = action.payload;
        },
        removeBlock(state, action: PayloadAction<string>) {
            state.blocks = state.blocks.filter(block => block.id !== action.payload);
        },
        setFileFrequency(state, action: PayloadAction<number>) {
            state.frequency = action.payload;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        addControl(state, action: PayloadAction<{ blockId: string, filters: { [key: string]: any } }>) {
            if (!state.controls[action.payload.blockId]) {
                state.controls[action.payload.blockId] = {};
            }
            Object.entries(action.payload.filters).forEach(([key, value]) => {
                state.controls[action.payload.blockId][key] = value;
            });
        },
        updateControl(state, action: PayloadAction<{ blockId: string, filter: { key: string, value: any } }>) {
            if (action.payload.blockId in state.controls && action.payload.filter.key in state.controls[action.payload.blockId]) {
                state.controls[action.payload.blockId][action.payload.filter.key] = action.payload.filter.value;
            } else {
                console.log("updateControl: blockId or filter key not found in state.controls");
            }
        },
        setError(state, action: PayloadAction<string>) {
            state.errorStatus = true;
            state.errorMessage = action.payload;
        },
        clearError(state) {
            state.errorStatus = false;
            state.errorMessage = null;
        },
        showDeletePipelinePopup(state) {
            state.deletePipelinePopup = true;
        },
        clearDeletePipelinePopup(state) {
            state.deletePipelinePopup = false;
        },
        setReactFlowNodes(state, action: PayloadAction<{ nodeId: string, position: { x: number, y: number } }[]>) {
            state.reactFlowNodes = action.payload;
        }
    },
    extraReducers: builder => {
        builder.addCase(createNewPipeline.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createNewPipeline.fulfilled, (state, action) => {
            state.pipelineModel = action.payload;
            state.loading = false;
        });
        builder.addCase(createNewPipeline.rejected, (state, action) => {
            console.log(action.error.message);
            state.loading = false;
            state.errorStatus = true;
            state.errorMessage = String(action.payload);
        });
        builder.addCase(updatePipeline.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updatePipeline.fulfilled, (state, action) => {
            state.pipelineModel = action.payload;
            state.loading = false;
        });
        builder.addCase(updatePipeline.rejected, (state, action) => {
            state.loading = false;
            state.errorStatus = true;
            state.errorMessage = String(action.payload);
        });
        builder.addCase(executePipeline.rejected, (state, action) => {
            state.loading = false;
            state.errorStatus = true;
            state.errorMessage = String(action.payload);
        });
        builder.addCase(createNewBlock.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createNewBlock.fulfilled, (state, action) => {
            state.activeBlockId = action.payload.block_id;
            state.loading = false;
        });
        builder.addCase(createNewBlock.rejected, (state, action) => {
            state.loading = false;
            state.errorStatus = true;
            state.errorMessage = String(action.payload);
        });
        builder.addCase(fetchFullBlock.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchFullBlock.fulfilled, (state, action) => {
            if (state.blocks.find(block => block.id === action.payload.id)) {
                state.blocks = state.blocks.map(block => block.id === action.payload.id ? action.payload : block);
            } else {
                state.blocks.push(action.payload);
            }
            state.loading = false;
        });
        builder.addCase(fetchFullBlock.rejected, (state, action) => {
            state.loading = false;
            state.errorStatus = true;
            state.errorMessage = String(action.payload);
        });
        builder.addCase(putBlockToPipeline.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(putBlockToPipeline.fulfilled, (state, action) => {
            state.pipelineModel = action.payload;
            state.loading = false;
        });
        builder.addCase(putBlockToPipeline.rejected, (state, action) => {
            state.loading = false;
            state.errorStatus = true;
            state.errorMessage = String(action.payload);
        });
        builder.addCase(connectTwoBlocks.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(connectTwoBlocks.fulfilled, (state, action) => {
            state.pipelineModel = action.payload;
            state.loading = false;
        });
        builder.addCase(connectTwoBlocks.rejected, (state, action) => {
            state.loading = false;
            state.errorStatus = true;
            state.errorMessage = String(action.payload);
        });
        builder.addCase(fetchUpdateBlock.rejected, (state, action) => {
            state.errorStatus = true;
            state.errorMessage = String(action.payload);
        });
        builder.addCase(fetchExportPipeline.fulfilled, (state, action) => {
            state.errorStatus = false;
            state.errorMessage = null;
            state.loading = false;
            downloadPythonScript(action.payload, 'pipeline.py');
        });
        builder.addCase(fetchExportPipeline.rejected, (state, action) => {
            state.errorStatus = true;
            state.errorMessage = String(action.payload);
            state.loading = false;
        });
        builder.addCase(deletePipelineThunk.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(deletePipelineThunk.rejected, (state, action) => {
            state.errorStatus = true;
            state.errorMessage = String(action.payload);
            state.loading = false;
        });
        
    }
})

export const {
    resetPipelineData,
    setBlocks,
    setBlockHistoryVisible,
    setBlockHistoryExpanded,
    setBlockControlsVisible,
    setBlockControlsExpanded,
    setActiveBlockId,
    removeBlock,
    setFileFrequency,
    setLoading,
    addControl,
    updateControl,
    setError,
    clearError,
    showDeletePipelinePopup,
    clearDeletePipelinePopup,
    setReactFlowNodes
} = pipelineSlice.actions;

export default pipelineSlice.reducer;

export const getPipelineId = (state: RootState) => state.pipeline.pipelineModel.id;

export const getPipeline = (state: RootState) => state.pipeline.pipelineModel;

export const getFrequency = (state: RootState) => state.pipeline.frequency;

export const getBlocks = (state: RootState) => state.pipeline.blocks;

export const getBlockById = (state: RootState, blockId: string) => state.pipeline.blocks.find(block => block.id === blockId);

export const getAllEdges = createSelector(
    [getPipeline],
    (pipeline) => createEdges(pipeline)
);

export const getActiveBlock = (state: RootState) => {
    const activeBlockId = state.pipeline.activeBlockId;
    return state.pipeline.blocks.find(block => block.id === activeBlockId);
}

export const getActiveBlockId = (state: RootState) => state.pipeline.activeBlockId;

export const getPipelineModel = (state: RootState) => state.pipeline.pipelineModel;

export const getPipelineExists = (state: RootState) => state.pipeline.pipelineModel.id !== '';

export const getLoading = (state: RootState) => state.pipeline.loading;

export const getControls = (state: RootState) => state.pipeline.controls;

export const blockConnectedToPipeline = createSelector(
    [(state: RootState, blockId: string) => blockId, getPipelineModel],
    (blockId, pipeline) => {
        return Object.values(pipeline.edge_dict).some(targets => targets.includes(blockId));
    }
);

export const getReactFlowNodes = (state: RootState) => state.pipeline.reactFlowNodes;

export const getAllNodes = createSelector(
    [getBlocks, getReactFlowNodes],
    (blocks, reactFlowNodes) => {
        return createNodesFromBlocks(blocks, reactFlowNodes)
    }
);