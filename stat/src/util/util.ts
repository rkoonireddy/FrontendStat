import {DataPoint, Pipeline} from "../types/dataType";
import {BlockModel, CreateBlockResponse} from "../types/responseType";

export function getMinMax(data: DataPoint[][]): {x: {min: number, max: number}, y: {min: number, max: number}} {
    let xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;

    data.forEach(dataset => {
        dataset.forEach(point => {
            if(point.x < xMin) xMin = point.x;
            if(point.x > xMax) xMax = point.x;
            if(point.y < yMin) yMin = point.y;
            if(point.y > yMax) yMax = point.y;
        });
    });

    return {
        x: {min: xMin, max: xMax},
        y: {min: yMin, max: yMax}
    };
}

export function createNodes(pipeline: Pipeline) {
    let x = -100;
    let y = -100;
    return pipeline.steps.map(step => {
        x += 100;
        y += 100;
        return {
            id: step.id,
            data: { label: step.name },
            position: { x: x, y: y },
            ...(x === 0 && { type: "input" })
        };
    });
}

// blocks to nodes
export function createNodesFromBlocks(blocks: BlockModel[]) {
    let x = -100;
    let y = -100;
    return blocks.map((block: any) => {
        x += 100;
        y += 100;
        return {
            id: block.id,
            data: { label: block.name },
            position: { x: x, y: y },
            ...(x === 0 && { type: "input" })
        };
    });
}


export function createEdges(pipeline: Pipeline): {id: string, source: string, target: string}[] {
    let edges : {id: string, source: string, target: string}[] = [];
    pipeline.steps.forEach((step, index) => {
        if(index !== 0){
            edges.push({
                id: `${pipeline.steps[index - 1].id}-${step.id}`,
                source: pipeline.steps[index - 1].id,
                target: step.id
            });
        }
    });

    return edges;
}