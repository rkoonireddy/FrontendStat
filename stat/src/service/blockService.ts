import {BlockModel, BlockTypeModel, CreateBlockResponse} from "../types/responseType";

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

export function blockToCSVLoader({blockId, csvString, frequency_hz, header}: {
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

export function getFullBlock({blockId}: { blockId: string }): Promise<BlockModel> {
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

export async function getBlockTypes(): Promise<BlockTypeModel[]> {
    const response = await fetch(baseurl + "block_types");
    if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
    } else {
        const blockTypes: BlockTypeModel[] = [];
        const r = await response.json();
        r.loader.map((l: BlockTypeModel) => blockTypes.push(l));
        r.processor.map((p: BlockTypeModel) => blockTypes.push(p));
        return blockTypes;
    }
}