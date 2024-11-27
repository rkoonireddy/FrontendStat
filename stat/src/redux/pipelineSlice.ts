import {PipelineModel} from "../types/dataType";
import {createAsyncThunk, createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../store";
import {BlockModel, CreateBlockResponse} from "../types/responseType";
import {createPipeline, exportPipeline, fetchPipeline, runPipeline} from "../service/pipelineService";
import {
    addBlockToPipeline,
    createBlock,
    deleteBlock,
    getFullBlock,
    runBlock,
    updateBlock
} from "../service/blockService";
import {createEdges, createNodesFromBlocks} from "../util/util";
import {addEdgeToPipeline, deleteEdge} from "../service/edgeService";
import { stat } from "fs";
import {downloadPythonScript} from "../util/fileUtil";


export interface IPipelineState {
    pipelineModel: PipelineModel
    blocks: BlockModel[]
    activeBlockId: string | null
    frequency: number
    loading: boolean,
    errorStatus: boolean,
    errorMessage: string | null,
    controls: {
        [blockId: string]: {
            [controlName: string]: any
        }
    }
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
    controls: {}
}

export const createNewPipeline = createAsyncThunk<PipelineModel, void, { rejectValue: string }>(
    'pipeline/new',
    async (_, thunkAPI) => {
        try {
            return await createPipeline();
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to create pipeline');
        }
    }
);

export const checkPipeline = createAsyncThunk<boolean, string, { rejectValue: string }>(
    'pipeline/check',
    async (pipelineId, thunkAPI) => {
        try {
            await fetchPipeline({pipelineId});
            return true;
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to find pipeline in the database');
        }
    }
);

export const createNewBlock = createAsyncThunk<CreateBlockResponse, { blockType: string; blockName: string; }, {
    rejectValue: string
}>(
    'pipeline/newBlock',
    async ({blockType, blockName}, thunkAPI) => {
        try {
            const response = await createBlock({blockType, blockName});
            const state = thunkAPI.getState() as RootState;
            const pipeline = state.pipeline.pipelineModel;
            thunkAPI.dispatch(fetchFullBlock(response.block_id));
            thunkAPI.dispatch(putBlockToPipeline({blockId: response.block_id, pipelineId: pipeline.id}));
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to create block');
        }
    }
);

export const fetchFullBlock = createAsyncThunk<BlockModel, string, { rejectValue: string }>(
    'pipeline/fetchFullBlock',
    async (blockId, thunkAPI) => {
        try {
            return await getFullBlock({blockId});
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to fetch full block');
        }
    }
);

export const putBlockToPipeline = createAsyncThunk<PipelineModel, { blockId: string, pipelineId: string }, {
    rejectValue: string
}>(
    'pipeline/putBlockToPipeline',
    async ({blockId, pipelineId}, thunkAPI) => {
        try {
            return await addBlockToPipeline({blockId, pipelineId});
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to fetch full block');
        }
    }
);

export const connectTwoBlocks = createAsyncThunk <PipelineModel, {
    fromBlockId: string,
    toBlockId: string,
    pipelineId: string
}, { rejectValue: string }>(
    'pipeline/connectTwoBlocks',
    async ({fromBlockId, toBlockId, pipelineId}, thunkAPI) => {
        try {
            return await addEdgeToPipeline({fromBlockId, toBlockId, pipelineId});
        } catch (error) {
            return thunkAPI.rejectWithValue(`Failed to connect two blocks \n ${String(error)}`);
        }
    }
);

export const updatePipeline = createAsyncThunk<PipelineModel, { pipelineId: string }, { rejectValue: string }>(
    'pipeline/updatePipeline',
    async ({pipelineId}, thunkAPI) => {
        try {
            const pipeline = await fetchPipeline({pipelineId});
            const newBlockIds = Object.keys(pipeline.block_dict);
            const newBlocks = await Promise.all(newBlockIds.map(blockId => thunkAPI.dispatch(fetchFullBlock(blockId)).unwrap()));
            thunkAPI.dispatch(setBlocks(newBlocks));
            return pipeline;
        } catch (error) {
            return thunkAPI.rejectWithValue(`Failed to update pipeline \n ${String(error)}`);
        }
    }
);

export const executeBlock = createAsyncThunk<string, { blockId: string }, { rejectValue: string }>(
    'pipeline/runBlock',
    async ({blockId}, thunkAPI) => {
        try {
            const response = await runBlock({blockId});
            thunkAPI.dispatch(fetchFullBlock(blockId));
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(`Failed to run block \n ${String(error)}`);
        }
    }
);

export const executePipeline = createAsyncThunk<string, { pipelineId: string, startingBlockId: string }, {
    rejectValue: string
}>(
    'pipeline/runPipeline',
    async ({pipelineId, startingBlockId}, thunkAPI) => {
        try {
            const response = await runPipeline({pipelineId: pipelineId, startingBlockId: startingBlockId});
            thunkAPI.dispatch(updatePipeline({pipelineId}));
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(`Failed to run pipeline \n ${String(error)}`);
        }
    }
);

export const fetchExportPipeline = createAsyncThunk<string, { pipelineId: string, startBlockId: string, endBlockId: string }, {
    rejectValue: string
}>(
    'pipeline/exportPipeline',
    async ({pipelineId, startBlockId, endBlockId}, thunkAPI) => {
        try {
            return await exportPipeline({pipelineId: pipelineId, startBlockId: startBlockId, endBlockId: endBlockId});
        } catch (error) {
            return thunkAPI.rejectWithValue(`Failed to export pipeline \n ${String(error)}`);
        }
    }
);

export const fetchUpdateBlock = createAsyncThunk<string, { pipelineId: string, blockId: string, filters: { [key: string]: string } }, { rejectValue: string }>(
    'pipeline/updateBlock',
    async ({pipelineId, blockId, filters}, thunkAPI) => {
        try {
            const response = await updateBlock({blockId, filters});
            thunkAPI.dispatch(updatePipeline({pipelineId}));
            return response
        } catch (error) {
            return thunkAPI.rejectWithValue(`Failed to update and fetch full block \n ${String(error)}`);
        }
    }
);


export const deleteBlockFromPipeline = createAsyncThunk<void, { blockId: string, pipelineId: string }, {
    rejectValue: string
}>(
    'pipeline/deleteBlockFromPipeline',
    async ({blockId, pipelineId}, thunkAPI) => {
        try {
            await deleteBlock({blockId, pipelineId});
            thunkAPI.dispatch(updatePipeline({pipelineId}));
        } catch (error) {
            return thunkAPI.rejectWithValue(`Failed to delete block from pipeline \n ${String(error)}`);
        }
    }
);

export const deleteEdgeFromPipeline = createAsyncThunk<void, { edgeId: string, pipelineId: string }, {
    rejectValue: string
}>(
    'pipeline/deleteEdgeFromPipeline',
    async ({edgeId, pipelineId}, thunkAPI) => {
        try {
            await deleteEdge({edgeId, pipelineId});
            thunkAPI.dispatch(updatePipeline({pipelineId}));
        } catch (error) {
            return thunkAPI.rejectWithValue(`Failed to delete edge from pipeline \n ${String(error)}`);
        }
    }
);


export const pipelineSlice = createSlice({
    name: 'pipeline',
    initialState,
    reducers: {
        resetPipelineData: (state) => {
            state.pipelineModel = initialPipelineModel;
            state.blocks = [];
            state.activeBlockId = null;
            state.frequency = 60;
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
            // If the blockId contains the control action.payload.filter.key, update the value, otherwise do nothing
            if (action.payload.blockId in state.controls && action.payload.filter.key in state.controls[action.payload.blockId]) {
                
                // console.log("updateControl: using value ", action.payload.filter.value);

                state.controls[action.payload.blockId][action.payload.filter.key] = action.payload.filter.value;
            } else {
                console.log("updateControl: blockId or filter key not found in state.controls");
            }
        },
        clearError(state) {
            state.errorStatus = false;
            state.errorMessage = null;
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
        builder.addCase(checkPipeline.rejected, (state, action) => {
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
    clearError
} = pipelineSlice.actions;

export default pipelineSlice.reducer;

export const getPipeline = (state: RootState) => state.pipeline.pipelineModel;

export const getFrequency = (state: RootState) => state.pipeline.frequency;

export const getBlocks = (state: RootState) => state.pipeline.blocks;

export const getBlockById = (state: RootState, blockId: string) => state.pipeline.blocks.find(block => block.id === blockId);

export const getAllNodes = createSelector(
    [getBlocks],
    (blocks) => createNodesFromBlocks(blocks)
);

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