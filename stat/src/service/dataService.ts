import {DataPoint} from "../types/dataType";


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