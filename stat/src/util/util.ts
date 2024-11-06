import {DataDocument, DataPoint, PipelineModel} from "../types/dataType";
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

// blocks to customReactFlow
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

export function createEdges(pipeline: PipelineModel): {id: string, type: string, source: string, target: string}[] {
    let edges : {id: string, type: string, source: string, target: string}[] = [];
    Object.entries(pipeline.edge_dict).forEach(([source, targets]) => {
        targets.forEach(target => {
            edges.push({
                id: `${source}_${target}`,
                type: 'custom-edge',
                source: source,
                target: target
            });
        });
    });
    return edges;
}


export function convertToDataPoints(data: any[]): DataPoint[][] {
    const xValues = data[0].data.data;
    const yArray = data.slice(1);
    return yArray.map((yData: any) => yData.data.data.map((y: number, i: number) => ({x: xValues[i], y: y})));
}

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

export function convertRawDataToDataDocument(rawData: any[]): DataDocument[] {
    if (!rawData.length) {
        console.log("No Raw Data");
        return [];
    }
    const columns = Object.keys(rawData[0]);
    return rawData.map(row => {
        const rowObject: DataDocument = {};
        columns.forEach(column => {
            rowObject[column] = parseFloat(formatNumber(row[column])) as number | null;
        });
        return rowObject;
    });
}

export function getFirstKey(dict: Record<string, any>): string | undefined {
    const keys = Object.keys(dict);
    return keys.length > 0 ? keys[0] : undefined;
}

// Function to format numbers to avoid scientific notation
export function formatNumber (value: any) {

    // Catch empty strings early. Also account for end of line value, with trailing \r
    if (value === '' || value === '\r') {
        return "NA";
    }
    // Check if value is a number or a string representation of a number
    if (typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)))) {
        // Parse the number and convert to locale string
        return Number(value).toLocaleString('en-US', { maximumFractionDigits: 10 });
    }
    return value;
}

