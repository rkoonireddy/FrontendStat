import {PipelineModel} from "../types/dataType";

const baseurl = process.env.REACT_APP_API_BASEURL;

export function addEdgeToPipeline({fromBlockId, toBlockId, pipelineId}: {
    fromBlockId: string,
    toBlockId: string,
    pipelineId: string
}): Promise<PipelineModel> {
    return fetch(baseurl + "pipeline/edge",
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"pipeline_id": pipelineId, "block_from_id": fromBlockId, "block_to_id": toBlockId})
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