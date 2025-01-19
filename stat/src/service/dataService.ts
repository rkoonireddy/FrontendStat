import {DataPoint, PipelineModel} from "../types/dataType";
import {CreateBlockResponse} from "../types/responseType";


const baseurl = process.env.REACT_APP_API_BASEURL;

// mock data
const data: DataPoint[] = [
    {x: 0, y: 10},
    {x: 1, y: 20},
    {x: 2, y: 15},
    {x: 3, y: 25},
    {x: 4, y: 30},
];

const data2: DataPoint[] = [
    {x: 0, y: 5},
    {x: 1, y: 12},
    {x: 2, y: 30},
    {x: 3, y: 18},
    {x: 4, y: 30},
    {x: 5, y: 54},
    {x: 6, y: 23},
    {x: 7, y: 30},
    {x: 8, y: 32},
    {x: 9, y: 40}
];

export function getData(): Promise<DataPoint[][]> {
    return fetch(baseurl + "data")
        .then(response => {

            if (!response.ok) {
                return response.text().then(err => {
                    throw new Error(err);
                });
            } else {
                // return response.json();
                return [data, data2];
            }
        });
}

function downsampleTimeSeries(data: Array<{ [key: string]: string }>, targetLength: number): Array<{ [key: string]: string }> {
    if (data.length <= targetLength) return data;
    
    const factor = Math.floor(data.length / targetLength);
    const downsampled = [];
    
    for (let i = 0; i < data.length; i += factor) {
        const window = data.slice(i, Math.min(i + factor, data.length));
        const avgPoint: { [key: string]: string } = {};
        
        const keys = Object.keys(window[0]);
        
        for (const key of keys) {
            if (!isNaN(Number(window[0][key]))) {
                const avg = window
                    .map(point => Number(point[key]))
                    .reduce((a, b) => a + b, 0) / window.length;
                avgPoint[key] = avg.toString();
            } else {
                avgPoint[key] = window[0][key];
            }
        }
        downsampled.push(avgPoint);
    }
    
    return downsampled;
}

export function parseCSV({ formData }: { formData: FormData }): Promise<Array<{ [key: string]: string }>> {
    return new Promise((resolve, reject) => {
        const file = formData.get('csvFile') as File;
        const MAX_ROWS = 10000;

        // text/csv for MacOs, application/vnd.ms-excel for Windows
        if (file && (file.type === 'text/csv' || file.type === 'application/vnd.ms-excel')) {
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                const text = e.target?.result as string | null;
                if (text) {
                    const rows = text.split('\n');
                    const headers = rows[0].split(',');
                    let data = rows.slice(1).map((row: string) => {
                        const values = row.split(',');
                        return headers.reduce((obj: { [key: string]: string }, header: string, index: number) => {
                            obj[header] = values[index];
                            return obj;
                        }, {});
                    });

                    // Apply downsampling if the data exceeds MAX_ROWS
                    if (data.length > MAX_ROWS) {
                        console.log(`Downsampling data from ${data.length} to ${MAX_ROWS} points`);
                        data = downsampleTimeSeries(data, MAX_ROWS);
                    }

                    resolve(data);
                } else {
                    reject(new Error('Error reading the file.'));
                }
            };
            reader.readAsText(file);
        } else {
            reject(new Error('Please upload a valid CSV file.'));
        }
    });
}