import {BlockModel} from "../types/responseType";
import {DataDocument, PipelineModel} from "../types/dataType";

export function createNodesFromBlocks(blocks: BlockModel[]) {
    let y = -100;
    return blocks.map((block: any) => {
        y += 100;
        return {
            id: block.id,
            type: "customNode",
            description: block.descr,
            tag: block.tag ? block.tag : "General",
            data: { id: block.id, label: block.name, type: block.type, description: block.descr, tag: block.tag, blockId: block.id},
            position: { x: 225, y: y },
            ...(y === 0 && { type: "customStartNode" })
        };
    });
}

// creates a DataDocument (used for the line chart) array from a list of data objects of a Block
export function convertToDataDocument(data: any[]): DataDocument[] {
    if (!data.length || !data[0].data || !data[0].data.data) {
        return [];
    }
    return data[0].data.data.map((_: any, rowIndex: number) => {
        const rowObject: DataDocument = {};
        data.forEach(column => {
            rowObject[column.name] = column.data.data[rowIndex] as number | null;
        });
        return rowObject;
    });
}

// returns a list of block ids which use the specified column in any way
export function isColumnUsedInChildren({pipeline, startBlockId, columnName}: {pipeline: PipelineModel, startBlockId: string, columnName: string}): string[] {
    const blockIdsUsingColumn: string[] = [];
    const edgeDict = pipeline.edge_dict;
    const startBlock = edgeDict[startBlockId];
    Object.entries(startBlock).forEach(([targets]) => {

    });


    return [];
}


