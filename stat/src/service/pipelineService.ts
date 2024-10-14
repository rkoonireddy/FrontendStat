import {PipelineModel} from "../types/dataType";

const baseurl = process.env.REACT_APP_API_BASEURL;

export function createPipeline(): Promise<PipelineModel> {
    return fetch(baseurl + "pipeline",
        {
            method: "POST"
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

export function fetchPipeline({pipelineId}: { pipelineId: string }): Promise<PipelineModel> {
    return fetch(baseurl + "pipeline/" + pipelineId)
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

export async function runPipeline({pipelineId, startingBlockId}: {
    pipelineId: string,
    startingBlockId: string
}): Promise<string> {
    const response = await fetch(baseurl + "pipeline/" + pipelineId + "/run",
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"block_start_id": startingBlockId})
        })
    if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
    }
    return await response.text();
}

export async function exportPipeline({pipelineId, startBlockId, endBlockId}: { pipelineId: string, startBlockId: string, endBlockId: string }): Promise<string> {
    const response =  await fetch(baseurl + "pipeline/" + pipelineId + "/export/" + startBlockId + "/" + endBlockId);
    if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
    }
    return await response.text();
}


export function deletePipeline({pipelineId}: { pipelineId: string }): Promise<void> {
    return fetch(baseurl + "pipeline/" + pipelineId,
        {
            method: "DELETE"
        })
        .then(async response => {
            if (!response.ok) {
                return response.text().then(err => {
                    throw new Error(err);
                });
            }
        });
}