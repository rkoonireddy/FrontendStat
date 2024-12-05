import { quantile } from "d3";
import {DataDocument, PipelineModel} from "../types/dataType";

// Creates edges from the pipeline model
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

// Creates a DataDocument (used for the line chart) from the raw data uploaded into the redux store
export function convertRawDataToDataDocument(rawData: any[]): DataDocument[] {
    if (!rawData.length) {
        console.log("No Raw Data");
        return [];
    }
    const columns = Object.keys(rawData[0]);
    return rawData.map(row => {
        const rowObject: DataDocument = {}; 
        columns.forEach(column => {
            const parsedValue = parseFloat(formatNumber(row[column]));
            rowObject[column] = isNaN(parsedValue) ? null : parsedValue;
        });
        return rowObject;
    });
}

// returns the first key of a dictionary
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


export function getMean(data: (string | null)[]): number {
    // Filter out null values and convert strings to numbers
    const numericData = data.filter((value): value is string => value !== null).map(Number);

    // Calculate the mean
    return numericData.reduce((a, b) => a + b, 0) / numericData.length;
}

export function getMedian(data: (string | null)[]): number {
    const numericData = data.filter((value): value is string => value !== null).map(Number);
    const sortedData = numericData.sort((a, b) => a - b);
    const mid = Math.floor(data.length / 2);
    return data.length % 2 !== 0 ? sortedData[mid] : (sortedData[mid - 1] + sortedData[mid]) / 2;
}

export function getRange(data: (string | null)[]): number {
    const numericData = data.filter((value): value is string => value !== null).map(Number);
    return Math.max(...numericData) - Math.min(...numericData);
}

export function getMinMax(data: (string | null)[]): [number, number] {
    const numericData = data.filter((value): value is string => value !== null).map(Number);
    return [Math.min(...numericData), Math.max(...numericData)];
}

export function getVariance(data: (string | null)[]): number {
    const mean = getMean(data);
    const numericData = data.filter((value): value is string => value !== null).map(Number);
    return numericData.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / numericData.length;
}

export function getStandardDeviation(data: (string | null)[]): number {
    return Math.sqrt(getVariance(data));
}

export function getQuartiles(data: (string | null)[]): number[] {
    const numericData = data.filter((value): value is string => value !== null).map(Number);
    const sortedData = numericData.sort((a, b) => a - b);
    return [
        quantile(sortedData, 0.25) ?? 0,
        quantile(sortedData, 0.5) ?? 0,
        quantile(sortedData, 0.75) ?? 0
    ];
}

export function getConfidenceInterval(data: (string | null)[]): [number, number] {
    const numericData = data.filter((value): value is string => value !== null).map(Number);
    const mean = getMean(data);
    const standardError = getStandardDeviation(data) / Math.sqrt(numericData.length);
    const criticalValue = 1.96; // 95% confidence
    const marginOfError = criticalValue * standardError;
    return [mean - marginOfError, mean + marginOfError];
}
