import {createAsyncThunk} from "@reduxjs/toolkit";
import {PipelineModel} from "../types/dataType";
import {
    createPipeline,
    deletePipeline,
    exportPipeline,
    fetchPipeline,
    runPipeline,
    snoopPipeline
} from "../service/pipelineService";
import {BlockModel, CreateBlockResponse} from "../types/responseType";
import {
    addBlockToPipeline,
    createBlock,
    deleteBlock,
    getFullBlock,
    updateBlock
} from "../service/blockService";
import {RootState} from "../store";
import {addEdgeToPipeline, deleteEdge} from "../service/edgeService";
import {setBlocks} from "./pipelineSlice";

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
            return thunkAPI.rejectWithValue(`Failed to find pipeline ID "${pipelineId}" in the database`);
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

export const snoopPipelineColumns = createAsyncThunk<string, { pipelineId: string }, { rejectValue: string }>(
    'pipeline/snoopPipelineColumns',
    async ({pipelineId}, thunkAPI) => {
        try {
            const response_snoop = await snoopPipeline({pipelineId});
            thunkAPI.dispatch(updatePipeline({pipelineId}));
            return response_snoop;
        } catch (error) {
            return thunkAPI.rejectWithValue(`Failed to snoop pipeline \n ${String(error)}`);
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

export const deletePipelineThunk = createAsyncThunk<void, { pipelineId: string }, {
    rejectValue: string
}>(
    'pipeline/deletePipelineThunk',
    async ({pipelineId}, thunkAPI) => {
        try {
            return await deletePipeline({pipelineId});
        } catch (error) {
            return thunkAPI.rejectWithValue(`Failed to delete pipeline ${pipelineId} \n ${String(error)}`);
        }
    }
);