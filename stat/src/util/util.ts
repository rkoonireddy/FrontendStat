import {DataPoint} from "../types/dataType";

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

    console.log(xMin, xMax, yMin, yMax);

    return {
        x: {min: xMin, max: xMax},
        y: {min: yMin, max: yMax}
    };
}