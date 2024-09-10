import {DataPoint, Pipeline, PipelineModel} from "../types/dataType";
import {BlockModel} from "../types/responseType";

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
    // let x = -100;
    let y = -100;
    return pipeline.steps.map(step => {
        // x += 100;
        y += 100;
        return {
            id: step.id,
            data: { label: step.name, type: step.type },
            position: { x: 225, y: y },
            ...(y === 0 && { type: "input" })
        };
    });
}

// blocks to customReactFlow
export function createNodesFromBlocks(blocks: BlockModel[]) {
    let y = -100;
    return blocks.map((block: any) => {
        y += 100;
        return {
            id: block.id,
            type: "customNode",
            data: { id: block.id, label: block.name, type: block.type },
            position: { x: 225, y: y },
            ...(y === 0 && { type: "customStartNode" })
        };
    });
}

export function createEdges(pipeline: PipelineModel): {id: string, type: string, source: string, target: string}[] {
    let edges : {id: string, type: string, source: string, target: string}[] = [];
    Object.entries(pipeline.edge_dict).forEach(([source, targets]) => {
        targets.forEach(target => {
            edges.push({
                id: `${source}-${target}`,
                type: 'custom-edge',
                source: source,
                target: target
            });
        });
    });
    return edges;
}

export function convertToCSV(data: { [key: string]: string }[]): string {
    if (data.length === 0) return '';

    const columns = Object.keys(data[0]);
    const header = columns.join(',');
    const rows = data.map(row =>
        columns.map(col => row[col]).join(',')
    );
    return [header, ...rows].join('\n');
}

export function convertToDataPoints(data: any[]): DataPoint[][] {
    const xValues = data[0].data.data;
    const yValues = data[1].data.data;
    return [xValues.map((x: number, i: number) => ({x: x, y: yValues[i]}))];
}

export function getFirstKey(dict: Record<string, any>): string | undefined {
    const keys = Object.keys(dict);
    return keys.length > 0 ? keys[0] : undefined;
}