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

export function getData(): Promise<DataPoint[]> {
    return fetch(baseurl + "data")
        .then(response => {

            if (!response.ok) {
                return response.text().then(err => {
                    throw new Error(err);
                });
            } else {
                // return response.json();
                return data;
            }
        });
}