import {Pipeline, PipelineModel} from "../types/dataType";
import {createAsyncThunk, createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../store";
import {CreateBlockResponse} from "../types/responseType";
import {createPipeline} from "../service/pipelineService";
import {createBlock} from "../service/blockService";


interface IPipelineState {
    pipeline: Pipeline,
    pipelineModel: null | PipelineModel
    blocks: CreateBlockResponse[]
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
            return await createBlock({ blockType, blockName });
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to create block');
        }
    }
);


export const pipelineSlice = createSlice({
    name: 'pipeline',
    initialState,
    reducers: {
        setStepHistoryVisible: (state: { pipeline: { steps: any; }; }, action: PayloadAction<{ stepId: string }>) => {
            state.pipeline.steps = state.pipeline.steps.map((step: { id: string, historyVisible: any; }) => {
                if (step.id === action.payload.stepId) {
                    step.historyVisible = action.payload;
                }
                return step;
            });
        },
        setStepHistoryExpanded: (state: { pipeline: { steps: any; }; }, action: PayloadAction<{ stepId: string }>) => {
            state.pipeline.steps = state.pipeline.steps.map((step: { id: string, historyExpanded: any; }) => {
                if (step.id === action.payload.stepId) {
                    step.historyExpanded = action.payload;
                }
                return step;
            });
        },
        setStepControlsVisible: (state: { pipeline: { steps: any; }; }, action: PayloadAction<{ stepId: string }>) => {
            state.pipeline.steps = state.pipeline.steps.map((step: { id: string, controlsVisible: any; }) => {
                if (step.id === action.payload.stepId) {
                    step.controlsVisible = action.payload;
                }
                return step;
            });
        },
        setStepControlsExpanded: (state: { pipeline: { steps: any; }; }, action: PayloadAction<{ stepId: string }>) => {
            state.pipeline.steps = state.pipeline.steps.map((step: { id: string, controlsExpanded: any; }) => {
                if (step.id === action.payload.stepId) {
                    step.controlsExpanded = action.payload;
                }
                return step;
            });
        },
        addStep: (state: { pipeline: { steps: any; }; }, action: PayloadAction<{ step: IPipelineState }>) => {
            state.pipeline.steps = state.pipeline.steps.map((step: { active: boolean; }) => {
                if (step.active) {
                    step.active = false;
                }
                return step;
            });
            state.pipeline.steps.push(action.payload.step);
        },
        changeActiveStep: (state: { pipeline: { steps: any; }; }, action: PayloadAction<{ stepId: string }>) => {
            state.pipeline.steps = state.pipeline.steps.map((step: { id: string; active: boolean; }) => {
                step.active = step.id === action.payload.stepId;
                return step;
            });
        },
        setActiveStepId(state, action: PayloadAction<string>) {
            state.activeBlockId = action.payload;
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
            state.blocks.push(action.payload);
            state.activeBlockId = action.payload.block_id;
        });
    }
})

export const {
    setStepHistoryVisible,
    setStepHistoryExpanded,
    setStepControlsVisible,
    setStepControlsExpanded,
    addStep,
    changeActiveStep,
    setActiveStepId
} = pipelineSlice.actions;

export default pipelineSlice.reducer;

export const getPipeline = (state: RootState) => state.pipeline.pipeline;

export const getLastPipelineStep = createSelector(
    getPipeline,
    (pipeline) => pipeline.steps[pipeline.steps.length - 1]
);

export const getActivePipelineStep = createSelector(
    getPipeline,
    (pipeline) => pipeline.steps.find(step => step.active)
);

export const getActiveBlock = (state: RootState) => {
    const activeBlockId = state.pipeline.activeBlockId;
    return state.pipeline.blocks.find(block => block.block_id === activeBlockId);

}

export const getPipelineModel = (state: RootState) => state.pipeline.pipelineModel;