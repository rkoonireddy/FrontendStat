import {BlockType, CreateBlockResponse} from "../types/responseType";

const baseurl = process.env.REACT_APP_API_BASEURL;


export function createBlock({blockType, blockName}: {blockType: string, blockName: string}): Promise<CreateBlockResponse> {
    return fetch(baseurl + "block",
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"block_type": blockType, "block_name": blockName})
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(err => {
                    throw new Error(err);
                });
            } else {
                return response.json();
            }
        })
}

export function blockToCSVLoader({blockId, csvString, frequency_hz, header}: {blockId: string, csvString: string, frequency_hz: number, header: boolean}): Promise<BlockType>  {
    return fetch(baseurl + `block/${blockId}`,
        {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"csv_string": csvString, "freq_hz": frequency_hz, "header": header})
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

export function getFullBlock({blockId}: {blockId: string}): Promise<BlockType> {
    return fetch(baseurl + `block_full/${blockId}`)
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