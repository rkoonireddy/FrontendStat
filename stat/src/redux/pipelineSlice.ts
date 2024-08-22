import {Pipeline} from "../types/dataType";
import {createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../store";


interface IPipelineState {
    pipeline: Pipeline
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
    }
}

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
        addStep: (state: { pipeline: { steps: any; }; }, action: PayloadAction<{ step: any }>) => {
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
        }
    }
})

export const {
    setStepHistoryVisible,
    setStepHistoryExpanded,
    setStepControlsVisible,
    setStepControlsExpanded,
    addStep,
    changeActiveStep
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