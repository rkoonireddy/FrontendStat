import {Pipeline} from "../types/dataType";
import {  createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
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
                name: "Step 1",
                type: "CSV",
                historyVisible: false,
                historyExpanded: false,
                controlsVisible: false,
                controlsExpanded: false,
                controls: ["Filter"],
            }
        ]
    }
}

export const pipelineSlice = createSlice({
    name: 'pipeline',
    initialState,
    reducers: {
        setStepHistoryVisible: (state: { pipeline: { steps: any; }; }, action: { payload: any; }) => {
            state.pipeline.steps = state.pipeline.steps.map((step: { historyVisible: any; }) => {
                step.historyVisible = action.payload;
                return step;
            });
        },
        setStepHistoryExpanded: (state: { pipeline: { steps: any; }; }, action: { payload: any; }) => {
            state.pipeline.steps = state.pipeline.steps.map((step: { historyExpanded: any; }) => {
                step.historyExpanded = action.payload;
                return step;
            });
        },
        setStepControlsVisible: (state: { pipeline: { steps: any; }; }, action: { payload: any; }) => {
            state.pipeline.steps = state.pipeline.steps.map((step: { controlsVisible: any; }) => {
                step.controlsVisible = action.payload;
                return step;
            });
        },
        setStepControlsExpanded: (state: { pipeline: { steps: any; }; }, action: { payload: any; }) => {
            state.pipeline.steps = state.pipeline.steps.map((step: { controlsExpanded: any; }) => {
                step.controlsExpanded = action.payload;
                return step;
            });
        },
        addStep: (state: { pipeline: { steps: any; }; }, action: PayloadAction<{step: any}>) => {
            state.pipeline.steps.push(action.payload.step);
        }
    }
})

export const { setStepHistoryVisible, setStepHistoryExpanded, setStepControlsVisible, setStepControlsExpanded, addStep } = pipelineSlice.actions;

export default pipelineSlice.reducer;

export const getPipeline = (state: RootState) => state.pipeline.pipeline;

export const getLastPipelineStep = createSelector(
    getPipeline,
    (pipeline) => pipeline.steps[pipeline.steps.length - 1]
);