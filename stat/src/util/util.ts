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
                id: `${source}_${target}`,
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
    const yArray = data.slice(1);
    return yArray.map((yData: any) => yData.data.data.map((y: number, i: number) => ({x: xValues[i], y: y})));
}

export function getFirstKey(dict: Record<string, any>): string | undefined {
    const keys = Object.keys(dict);
    return keys.length > 0 ? keys[0] : undefined;
}

// Function to format numbers to avoid scientific notation
export function formatNumber (value: any) {
    // Check if value is a number or a string representation of a number
    if (typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)))) {
        // Parse the number and convert to locale string
        return Number(value).toLocaleString('en-US', { maximumFractionDigits: 10 });
    }
    return value;
}

export function preProcessCSVData(csvString: { [key: string]: string; }[], selectedColumns: string[]) {
    let newRawData = csvString.map(row =>
        Object.fromEntries(Object.entries(row).filter(([key]) => selectedColumns.includes(key)))
    );

    // Remove rows where the first column is empty
    newRawData = newRawData.filter(row => {
        const firstKey = Object.keys(row)[0]; // Get the first key
        return row[firstKey] !== undefined && row[firstKey] !== ''; // Keep row if first column is not empty
    });

    // Clean the newRawData to ensure no empty values at the end of each row
    return newRawData.map(row => {
        const cleanedRow = {...row}; // Create a shallow copy of the row
        const keys = Object.keys(cleanedRow);
        let lastNonEmptyKeyIndex = keys.length - 1;

        // Find the last non-empty key in the row
        while (lastNonEmptyKeyIndex >= 0 && (cleanedRow[keys[lastNonEmptyKeyIndex]] === null || cleanedRow[keys[lastNonEmptyKeyIndex]] === '')) {
            lastNonEmptyKeyIndex--; // Move upwards until a non-empty value is found
        }

        // If there are empty values after the last non-empty key, set them to empty string
        for (let i = lastNonEmptyKeyIndex + 1; i < keys.length; i++) {
            cleanedRow[keys[i]] = ''; // Set the remaining keys to an empty string
        }

        return cleanedRow;
    });
}