import {Pipeline, PipelineModel} from "../types/dataType";
import {createAsyncThunk, createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../store";
import {BlockModel, CreateBlockResponse} from "../types/responseType";
import {createPipeline} from "../service/pipelineService";
import {addBlockToPipeline, createBlock, getFullBlock} from "../service/blockService";
import {createNodesFromBlocks} from "../util/util";


interface IPipelineState {
    pipeline: Pipeline,
    pipelineModel: null | PipelineModel
    blocks: BlockModel[]
    activeBlockId: string | null
}

const initialState: IPipelineState = {
    pipeline: {
        id: "pipeline1",
        steps: [
            {
                id: "step1",
                name: "Raw Data",
                type: "CSV",
                historyVisible: false,
                historyExpanded: false,
                controlsVisible: false,
                controlsExpanded: false,
                controls: ["Filter"],
                active: true
            },
            {
                id: "step2",
                name: "Visualization",
                type: "Line Chart",
                historyVisible: true,
                historyExpanded: false,
                controlsVisible: true,
                controlsExpanded: true,
                controls: ["Slider, Know"],
                active: false
            }
        ]
    },
    pipelineModel: null,
    blocks: [],
    activeBlockId: null
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

export const createNewBlock = createAsyncThunk<CreateBlockResponse, { blockType: string, blockName: string }, { rejectValue: string }>(
    'pipeline/newBlock',
    async ({ blockType, blockName }, thunkAPI) => {
        try {
            const response = await createBlock({ blockType, blockName });
            const state = thunkAPI.getState() as RootState;
            const pipeline = state.pipeline.pipeline;
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
            console.log("fetching full block", blockId);
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


export const pipelineSlice = createSlice({
    name: 'pipeline',
    initialState,
    reducers: {
        setBlockHistoryVisible: (state: { pipeline: { steps: any; }; }, action: PayloadAction<{ stepId: string }>) => {
            state.pipeline.steps = state.pipeline.steps.map((step: { id: string, historyVisible: any; }) => {
                if (step.id === action.payload.stepId) {
                    step.historyVisible = action.payload;
                }
                return step;
            });
        },
        setBlockHistoryExpanded: (state: { pipeline: { steps: any; }; }, action: PayloadAction<{ stepId: string }>) => {
            state.pipeline.steps = state.pipeline.steps.map((step: { id: string, historyExpanded: any; }) => {
                if (step.id === action.payload.stepId) {
                    step.historyExpanded = action.payload;
                }
                return step;
            });
        },
        setBlockControlsVisible: (state: { pipeline: { steps: any; }; }, action: PayloadAction<{ stepId: string }>) => {
            state.pipeline.steps = state.pipeline.steps.map((step: { id: string, controlsVisible: any; }) => {
                if (step.id === action.payload.stepId) {
                    step.controlsVisible = action.payload;
                }
                return step;
            });
        },
        setBlockControlsExpanded: (state: { pipeline: { steps: any; }; }, action: PayloadAction<{ stepId: string }>) => {
            state.pipeline.steps = state.pipeline.steps.map((step: { id: string, controlsExpanded: any; }) => {
                if (step.id === action.payload.stepId) {
                    step.controlsExpanded = action.payload;
                }
                return step;
            });
        },
        setActiveBlockId(state, action: PayloadAction<string>) {
            state.activeBlockId = action.payload;
        },
        removeBlock(state, action: PayloadAction<string>) {
            state.blocks = state.blocks.filter(block => block.id !== action.payload);
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
            state.blocks.push(action.payload);
        });
        builder.addCase(putBlockToPipeline.fulfilled, (state, action) => {
            state.pipelineModel = action.payload;
        });
    }
})

export const {
    setBlockHistoryVisible,
    setBlockHistoryExpanded,
    setBlockControlsVisible,
    setBlockControlsExpanded,
    setActiveBlockId,
    removeBlock
} = pipelineSlice.actions;

export default pipelineSlice.reducer;

export const getPipeline = (state: RootState) => state.pipeline.pipeline;

export const getBlocks = (state: RootState) => state.pipeline.blocks;

export const getAllNodes = createSelector(
    [getBlocks],
    (blocks) => createNodesFromBlocks(blocks)
);

export const getActiveBlock = (state: RootState) => {
    const activeBlockId = state.pipeline.activeBlockId;
    return state.pipeline.blocks.find(block => block.id === activeBlockId);
}

export const getActiveBlockId = (state: RootState) => state.pipeline.activeBlockId;

export const getPipelineModel = (state: RootState) => state.pipeline.pipelineModel;