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

export function fetchPipeline({pipelineId}: {pipelineId: string}): Promise<PipelineModel> {
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


export function deletePipeline({pipelineId}: {pipelineId: string}): Promise<void> {
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