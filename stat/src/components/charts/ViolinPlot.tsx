import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';
import { getData, getRawDataColumns } from "../../redux/dataSlice";
import { useAppSelector } from "../../hooks";
import { getQuartiles, getConfidenceInterval } from "../../util/util";

interface ViolinPlotProps {
    setHoveredColumn: (column: string | null) => void;
}

const ViolinPlot: React.FC<ViolinPlotProps> = ({ setHoveredColumn }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const rawData = useAppSelector(getData);
    const rawDataColumns = useAppSelector(getRawDataColumns);
    const inputColumns = rawDataColumns //Filter out the first column
        .filter((column, columnIndex): column is string => columnIndex !== 0);

    useEffect(() => {
        if (!svgRef.current) return;

        // Set the dimensions and margins of the graph
        const margin = { top: 10, right: 30, bottom: 30, left: 40 };
        const width = 400 - margin.left - margin.right;
        const height = 270 - margin.top - margin.bottom;

        // Set up the SVG
        const svg = d3.select(svgRef.current)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const maxNum = d3.max(rawData.flatMap(row => {
            return inputColumns.map(column => Number(row[column]));
        })) || 1;

        const minNum = d3.min(rawData.flatMap(row => {
            return inputColumns.map(column => Number(row[column]));
        })) || -1;

        // Build and show the Y scale
        const y = d3.scaleLinear()
            .domain([minNum, maxNum])
            .range([height, 0]);
        svg.append("g").attr("stroke", "white").call(d3.axisLeft(y));

        // Build and show the X scale
        const x = d3.scaleBand()
            .range([0, width])
            .domain(inputColumns)
            .padding(0.1); // This is important: it is the space between 2 groups
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .attr("stroke", "white")
            .call(d3.axisBottom(x));

        inputColumns.forEach((column) => {
            // Features of density estimate
            const kde = kernelDensityEstimator(kernelEpanechnikov(0.2), y.ticks(50));

            // Compute the binning for each group of the dataset
            const sumstat = d3.rollup(
                rawData,
                v => {
                    const input = v.map(g => Number(g[column])); // Keep the variable xyz
                    //const input = v.map(g => Number(g[column])).filter((v): v is number => !isNaN(v));
                    const density = kde(input); // And compute the binning on it.
                    return density;
                },
                d => column
            );

            //console.log("sumstat:", Array.from(sumstat)); // Debugging statement

            // What is the biggest value that the density estimate reach?
            let maxNum = 0;
            sumstat.forEach(density => {
                const kdeValues = density.map(a => a[1]).filter((v): v is number => v !== undefined);
                const biggest = d3.max(kdeValues);
                if (biggest !== undefined && biggest > maxNum) {
                    maxNum = biggest;
                }
            });

            // The maximum width of a violin must be x.bandwidth = the width dedicated to a group
            const xNum = d3.scaleLinear()
                .range([0, x.bandwidth()])
                .domain([-maxNum, maxNum]);

            // Add the violin shape
            svg.selectAll("myViolin")
                .data(Array.from(sumstat))
                .enter() // So now we are working group per group
                .append("g")
                //.attr("transform", d => `translate(${x(d[0])},0)`) // Translation on the right to be at the group position
                .attr("transform", d => {
                    const xPos = x(d[0]);
                    //console.log("d[0]:", d[0], "xPos:", xPos); // Debugging statement
                    return `translate(${xPos},0)`; // Translation on the right to be at the group position
                })
                .on("mouseover", function (event, d) {
                    setHoveredColumn(d[0].toString());
                })
                .on("mouseout", function () {
                    setHoveredColumn(null);
                })
                .append("path")
                .datum(d => d[1].filter((v): v is [number, number] => v[0] !== undefined && v[1] !== undefined)) // Filter out undefined values, working density per density
                .style("stroke", "none")
                .style("fill", "#69b3a2")
                .attr("d", d3.area<[number, number]>()
                    .x0(d => xNum(-d[1]))
                    .x1(d => xNum(d[1]))
                    .y(d => y(d[0]))
                    .curve(d3.curveCatmullRom)) // This makes the line smoother to give the violin appearance

            const quartiles = getQuartiles(rawData.map(row => row[column as string]));

            svg.append("rect") //IQR box
                .attr("x", x(column) as number + x.bandwidth() * 0.4)
                .attr("y", y(quartiles[2]))
                .attr("width", x.bandwidth() * 0.2)
                .attr("height", y(quartiles[0]) - y(quartiles[2]))
                .attr("fill", "yellow")
                .attr("stroke", "black");

            // Add the median
            svg.append("circle")
                .attr("cx", x(column) as number + x.bandwidth() / 2)
                .attr("cy", y(quartiles[1]))
                .attr("r", 3)
                .style("fill", "red");

            // assuming normal distribution
            const confidenceInterval = getConfidenceInterval(rawData.map(row => row[column as string]));
            svg.append("line") // whisker
                .attr("x1", x(column) as number + x.bandwidth() * 0.5)
                .attr("x2", x(column) as number + x.bandwidth() * 0.5)
                .attr("y1", y(quartiles[1] - confidenceInterval[0]))
                .attr("y2", y(quartiles[1] + confidenceInterval[1]))
                .attr("stroke", "black");
        });
    }, [rawData]);

    return <svg ref={svgRef}></svg>;
};

// Kernel density estimator
type KernelFunction = (value: number) => number;

function kernelDensityEstimator(kernel: KernelFunction, X: number[]) {
    return function (V: number[]) {
        return X.map(x => {
            return [x, d3.mean(V, v => kernel(x - v))];
        });
    };
}

// Epanechnikov kernel
function kernelEpanechnikov(k: number) {
    return function (v: number) {
        return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
    };
}

export default ViolinPlot;