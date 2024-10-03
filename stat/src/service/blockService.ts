import {BlockModel, BlockTypeModel, CreateBlockResponse} from "../types/responseType";
import {Pipeline, PipelineModel} from "../types/dataType";

const baseurl = process.env.REACT_APP_API_BASEURL;


export function createBlock({blockType, blockName}: {
    blockType: string,
    blockName: string
}): Promise<CreateBlockResponse> {
    return fetch(baseurl + "block",
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"block_type": blockType, "name": blockName})
        })
        .then(async response => {
            if (!response.ok) {
                return response.text().then(err => {
                    throw new Error(err);
                });
            } else {
                return await response.json();
            }
        })
}

export function updateCSVLoaderBlock({blockId, csvString, frequency_hz, header}: {
    blockId: string,
    csvString: string,
    frequency_hz: number,
    header: boolean
}): Promise<BlockModel> {
    return fetch(baseurl + `block/${blockId}`,
        {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"csv_string": csvString, "freq_hz": frequency_hz, "header": header})
        })
        .then(async response => {
            if (!response.ok) {
                return response.text().then(err => {
                    throw new Error(err);
                });
            } else {
                return await response.json();
            }
        });
}

export function updateBlock({blockId, filters}: {blockId: string, filters: { [key: string]: string }}): Promise<string> {
    return fetch(baseurl + `block/${blockId}`,
        {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(filters)
        })
        .then(async response => {
            if (!response.ok) {
                return response.text().then(err => {
                    throw new Error(err);
                });
            } else {
                return await response.json();
            }
        });
}

export function getFullBlock({blockId}: { blockId: string }): Promise<BlockModel> {
    return fetch(baseurl + `block_full/${blockId}`)
        .then(async response => {
            if (!response.ok) {
                return response.text().then(err => {
                    throw new Error(err);
                });
            } else {
                return await response.json();
            }
        });
}

export async function getBlockTypes(): Promise<BlockTypeModel[]> {
    const response = await fetch(baseurl + "block_types");
    if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
    } else {
        // const blockTypes: BlockTypeModel[] = [];
        const r = await response.json();
        // r.loader.map((l: BlockTypeModel) => blockTypes.push(l));
        // r.processor.map((p: BlockTypeModel) => blockTypes.push(p));
        return r.processor;
    }
}


export async function addBlockToPipeline({blockId, pipelineId}: {blockId: string, pipelineId: string}): Promise<PipelineModel> {
    const response = await fetch(baseurl + `pipeline/block/`,
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"pipeline_id": pipelineId, "block_id": blockId})
        });
    if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
    }
    const res = await response.json();
    return res.pipeline;
}

export async function runBlock({blockId}: {blockId: string}): Promise<string> {
    const response = await fetch(baseurl + `block/${blockId}/run`,
        {
            method: "POST",
        });
    if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
    }
    return await response.text();
}

export async function deleteBlock({blockId, pipelineId}: {blockId: string, pipelineId: string}): Promise<void> {
    const response = await fetch(baseurl + `pipeline/${pipelineId}/block/${blockId}`,
        {
            method: "DELETE",
        });
    if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
    }
}