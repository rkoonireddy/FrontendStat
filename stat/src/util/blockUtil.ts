import {BlockModel} from "../types/responseType";
import {DataDocument} from "../types/dataType";
import {CompleteNode} from "../types/reactFlowCustomTypes";
import {setReactFlowNodes} from "../redux/pipelineSlice";
import {AppDispatch} from "../store";

export function createNodesFromBlocks(
    blocks: BlockModel[],
    reactFlowNodes: {
        nodeId: string,
        position: {
            x: number,
            y: number
        }
    }[]): CompleteNode[] {
    let y = -100;
    let x = 225;
    return blocks.map((block: BlockModel) => {
        const reactFlowNode = reactFlowNodes.find(node => node.nodeId === block.id);
        if (reactFlowNode === undefined) {
            y += 100;
        } else {
            y = reactFlowNode.position.y;
            x = reactFlowNode.position.x;
        }
        return {
            id: block.id,
            type: "customNode",
            description: block.descr,
            tag: block.tag ? block.tag : "General",
            data: {
                id: block.id,
                label: block.name,
                type: block.type,
                description: block.descr,
                tag: block.tag ? block.tag : "General",
                blockId: block.id
            },
            position: {x: x, y: y},
            ...(y === 0 && {type: "customStartNode"})
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

export function saveLayout(nodes: CompleteNode[], dispatch: AppDispatch) {
    const reactFlowNodes = nodes.map(node => ({
        nodeId: node.id,
        position: { x: node.position.x, y: node.position.y }
    }));
    dispatch(setReactFlowNodes(reactFlowNodes));
}