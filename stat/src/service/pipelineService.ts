import {PipelineModel} from "../types/dataType";

const baseurl = process.env.REACT_APP_API_BASEURL;

export function createPipeline(): Promise<PipelineModel> {
    return fetch(baseurl + "pipeline",
        {
            method: "POST"
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(err => {
                    throw new Error(err);
                });
            } else {
                return response.json();
            }
        });
}