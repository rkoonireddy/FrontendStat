import {PipelineModel} from "../types/dataType";
import {createAsyncThunk, createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../store";
import {BlockModel, CreateBlockResponse} from "../types/responseType";
import {createPipeline} from "../service/pipelineService";
import {addBlockToPipeline, createBlock, getFullBlock} from "../service/blockService";
import {createEdges, createNodesFromBlocks} from "../util/util";
import {addEdgeToPipeline} from "../service/edgeService";


interface IPipelineState {
    pipelineModel: PipelineModel
    blocks: BlockModel[]
    activeBlockId: string | null
    frequency: number
}

const initialPipelineModel: PipelineModel = {
    block_dict: {},
    edge_dict: {},
    id: '',
    type: ''
}

const initialState: IPipelineState = {
    pipelineModel: initialPipelineModel,
    blocks: [],
    activeBlockId: null,
    frequency: 60
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

export const createNewBlock = createAsyncThunk<CreateBlockResponse, { blockType: string; blockName: string; }, { rejectValue: string }>(
    'pipeline/newBlock',
    async ({ blockType, blockName }, thunkAPI) => {
        try {
            const response = await createBlock({ blockType, blockName });
            const state = thunkAPI.getState() as RootState;
            const pipeline = state.pipeline.pipelineModel;
            thunkAPI.dispatch(fetchFullBlock(response.block_id));
            thunkAPI.dispatch(putBlockToPipeline({ blockId: response.block_id, pipelineId: pipeline.id }));
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

export const putBlockToPipeline = createAsyncThunk<PipelineModel, { blockId: string, pipelineId: string }, { rejectValue: string }>(
    'pipeline/putBlockToPipeline',
    async ({ blockId, pipelineId }, thunkAPI) => {
        try {
            return await addBlockToPipeline({blockId, pipelineId});
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to fetch full block');
        }
    }
);

export const connectTwoBlocks = createAsyncThunk<PipelineModel, { fromBlockId: string, toBlockId: string, pipelineId: string }, { rejectValue: string }>(
    'pipeline/connectTwoBlocks',
    async ({ fromBlockId, toBlockId, pipelineId }, thunkAPI) => {
        try {
            return await addEdgeToPipeline({fromBlockId, toBlockId, pipelineId});
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to connect two blocks');
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
        // setBlockHistoryVisible: (state: { pipeline: { steps: any; }; }, action: PayloadAction<{ stepId: string }>) => {
        //     state.pipeline.steps = state.pipeline.steps.map((step: { id: string, historyVisible: any; }) => {
        //         if (step.id === action.payload.stepId) {
        //             step.historyVisible = action.payload;
        //         }
        //         return step;
        //     });
        // },
        // setBlockHistoryExpanded: (state: { pipeline: { steps: any; }; }, action: PayloadAction<{ stepId: string }>) => {
        //     state.pipeline.steps = state.pipeline.steps.map((step: { id: string, historyExpanded: any; }) => {
        //         if (step.id === action.payload.stepId) {
        //             step.historyExpanded = action.payload;
        //         }
        //         return step;
        //     });
        // },
        // setBlockControlsVisible: (state: { pipeline: { steps: any; }; }, action: PayloadAction<{ stepId: string }>) => {
        //     state.pipeline.steps = state.pipeline.steps.map((step: { id: string, controlsVisible: any; }) => {
        //         if (step.id === action.payload.stepId) {
        //             step.controlsVisible = action.payload;
        //         }
        //         return step;
        //     });
        // },
        // setBlockControlsExpanded: (state: { pipeline: { steps: any; }; }, action: PayloadAction<{ stepId: string }>) => {
        //     state.pipeline.steps = state.pipeline.steps.map((step: { id: string, controlsExpanded: any; }) => {
        //         if (step.id === action.payload.stepId) {
        //             step.controlsExpanded = action.payload;
        //         }
        //         return step;
        //     });
        // },
        setActiveBlockId(state, action: PayloadAction<string>) {
            state.activeBlockId = action.payload;
        },
        removeBlock(state, action: PayloadAction<string>) {
            state.blocks = state.blocks.filter(block => block.id !== action.payload);
        },
        setFileFrequency(state, action: PayloadAction<number>) {
            state.frequency = action.payload;
        }
    },
    extraReducers: builder => {
        builder.addCase(createNewPipeline.fulfilled, (state, action) => {
            state.pipelineModel = action.payload;
        });
        builder.addCase(createNewPipeline.rejected, (state, action) => {
            console.log(action.error.message);
        });
        builder.addCase(createNewBlock.fulfilled, (state, action) => {
            state.activeBlockId = action.payload.block_id;
        });
        builder.addCase(fetchFullBlock.fulfilled, (state, action) => {
            if (state.blocks.find(block => block.id === action.payload.id)) {
                state.blocks = state.blocks.map(block => block.id === action.payload.id ? action.payload : block);
            } else {
                state.blocks.push(action.payload);
            }
        });
        builder.addCase(putBlockToPipeline.fulfilled, (state, action) => {
            state.pipelineModel = action.payload;
        });
        builder.addCase(connectTwoBlocks.fulfilled, (state, action) => {
            state.pipelineModel = action.payload;
        });
    }
})

export const {
    resetPipelineData,
    // setBlockHistoryVisible,
    // setBlockHistoryExpanded,
    // setBlockControlsVisible,
    // setBlockControlsExpanded,
    setActiveBlockId,
    removeBlock,
    setFileFrequency
} = pipelineSlice.actions;

export default pipelineSlice.reducer;

export const getPipeline = (state: RootState) => state.pipeline.pipelineModel;

export const getBlocks = (state: RootState) => state.pipeline.blocks;

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