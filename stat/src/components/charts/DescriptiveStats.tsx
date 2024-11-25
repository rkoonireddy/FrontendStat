import {getData} from "../../redux/dataSlice";
import * as d3 from "d3";
import styled from "styled-components";
import {useState, useEffect, useRef} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {updateCSVLoaderBlock} from "../../service/blockService";
import {fetchFullBlock, getFrequency} from "../../redux/pipelineSlice";
import {getMean, getMedian, getRange, formatNumber, getVariance, getStandardDeviation, getQuartiles} from "../../util/util";

const StyledTableContainer = styled.div`
    height: fit-content;
    width: fit-content;
    max-width: 95%;
    max-height: 95%;
`;

export const StyledTableHeader = styled.th<{ $isSelected: boolean }>`
    background-color: ${props => (props.$isSelected ? '#3D3D3D' : '#adacac')};
    color: ${props => (props.$isSelected ? '#00bfa6' : '#808080')};
    border: 1px solid #00bfa6;
    padding: 8px;
    text-align: left;
`;

export const StyledTableCell = styled.td<{ $isSelected: boolean, $mini?: boolean }>`
    border: 1px solid #00bfa6;
    color: ${props => (props.$isSelected ? '#ffffff' : '#808080')};
    padding: ${props => (props.$mini ? '2px' : '8px')};
    background-color: ${props => (props.$isSelected ? '#3D3D3D' : '#adacac')};
`;

export const StyledFilterContainer = styled.div`
    margin-bottom: 20px;
`;

export const StyledCheckbox = styled.input`
    margin-right: 10px;
    color: white;
`;

const StyledFrequency = styled.div`
    margin-top: 15px;
    text-align: right;
    font-size: 1.0rem;
    color: white;
`;

export default function DescriptiveStats({blockId, hoveredColumn}: { blockId: string; hoveredColumn: string | null }) {
    //const dispatch = useAppDispatch();
    const rawData = useAppSelector(getData);
    const dataFrequency = useAppSelector(getFrequency);
    const columnLength = rawData.map(row => row[hoveredColumn as string]).filter((value): value is string => value !== null).length;
    const mean = getMean(rawData.map(row => row[hoveredColumn as string]));
    const median = getMedian(rawData.map(row => row[hoveredColumn as string]));
    const range = getRange(rawData.map(row => row[hoveredColumn as string]));
    const variance = getVariance(rawData.map(row => row[hoveredColumn as string]));
    const stdev = getStandardDeviation(rawData.map(row => row[hoveredColumn as string]));
    const quartiles = getQuartiles(rawData.map(row => row[hoveredColumn as string]));

    const svgRef = useRef<SVGSVGElement | null>(null);
    const columnData = rawData
        .map(row => row[hoveredColumn as string])
        .filter((value): value is string => value !== null && !isNaN(Number(value)))
        .map(value => Number(value));


    useEffect(() => {
        if (svgRef.current) {
            const svg = d3.select(svgRef.current);
            svg.selectAll("*").remove(); // Clear previous content

            const width = 150;
            const height = 180;
            const margin = { top: 20, right: 10, bottom: 10, left: 40 };

            const x = d3.scaleBand()
                .domain([hoveredColumn as string])
                .range([margin.left, width - margin.right])
                .padding(0.2);

            const y = d3.scaleLinear()
                .domain([d3.min(columnData) as number, d3.max(columnData) as number])
                .nice()
                .range([height - margin.bottom, margin.top]);

            const g = svg.append("g") // Create a group element, which will contain all the box plot elements
                .attr("transform", `translate(0,0)`); // Move the group relative to the SVG element

            // Box plot elements
            g.append("line") // whisker
                .attr("x1", x(hoveredColumn as string) as number + x.bandwidth() / 2)
                .attr("x2", x(hoveredColumn as string) as number + x.bandwidth() / 2)
                .attr("y1", y(d3.min(columnData) as number))
                .attr("y2", y(d3.max(columnData) as number))
                .attr("stroke", "#7eb0d5");

            g.append("rect") //box
                .attr("x", x(hoveredColumn as string) as number)
                .attr("y", y(quartiles[2]))
                .attr("width", x.bandwidth())
                .attr("height", y(quartiles[0]) - y(quartiles[2]))
                .attr("fill", "teal")
                .attr("stroke", "white");

            g.append("line") // median
                .attr("x1", x(hoveredColumn as string) as number)
                .attr("x2", x(hoveredColumn as string) as number + x.bandwidth())
                .attr("y1", y(median))
                .attr("y2", y(median))
                .attr("stroke", "yellow");

            g.append("line") //bottom whisker
                .attr("x1", x(hoveredColumn as string) as number)
                .attr("x2", x(hoveredColumn as string) as number + x.bandwidth())
                .attr("y1", y(d3.min(columnData) as number))
                .attr("y2", y(d3.min(columnData) as number))
                .attr("stroke", "#7eb0d5");

            g.append("line") //top whisker
                .attr("x1", x(hoveredColumn as string) as number)
                .attr("x2", x(hoveredColumn as string) as number + x.bandwidth())
                .attr("y1", y(d3.max(columnData) as number))
                .attr("y2", y(d3.max(columnData) as number))
                .attr("stroke", "#7eb0d5");
            
            svg.append("g") // Add x-axis instances
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(x).ticks(1))
                .attr("stroke", "white")
                .selectAll("path")
                .attr("stroke", "black");

            svg.append("g") // Add y-axis instances
                .attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(y).ticks(5))
                .attr("stroke", "white")
                .selectAll("path")
                .attr("stroke", "black");
        }
    }, [columnData, hoveredColumn]);

    return (
        <StyledTableContainer>
            <div>
                <svg ref={svgRef} width={150} height={200}></svg>
            </div>
            <StyledFrequency>Data Frequency: {dataFrequency} Hz</StyledFrequency>
            <StyledFrequency>Column: {hoveredColumn} has {columnLength} observations</StyledFrequency>
            <StyledFrequency>Mean: {formatNumber(mean)}</StyledFrequency>
            <StyledFrequency>Median: {formatNumber(median)}</StyledFrequency>
            <StyledFrequency>Range: {formatNumber(range)}</StyledFrequency>
            <StyledFrequency>Variance: {formatNumber(variance)}</StyledFrequency>
            <StyledFrequency>Standard Deviation: {formatNumber(stdev)}</StyledFrequency>
        </StyledTableContainer>
    );
}
