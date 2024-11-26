import { getData, getFilteredDataColumns, getRawDataColumns } from "../../redux/dataSlice";
import * as d3 from "d3";
import styled from "styled-components";
import React, { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { updateCSVLoaderBlock } from "../../service/blockService";
import { fetchFullBlock, getFrequency } from "../../redux/pipelineSlice";
import { getMean, getMedian, getQuartiles } from "../../util/util";

const StyledTableContainer = styled.div`
    height: fit-content;
    width: fit-content;
    max-width: 95%;
    max-height: 95%;
`;

const StyledTableHeader = styled.th<{ $isSelected: boolean }>`
    background-color: ${props => (props.$isSelected ? '#3D3D3D' : '#adacac')};
    color: ${props => (props.$isSelected ? '#00bfa6' : '#808080')};
    border: 1px solid #00bfa6;
    padding: 8px;
    text-align: left;
`;
export const StyledTableCell = styled.td<{ $isSelected: boolean }>`
    border: 1px solid #00bfa6;
    color: ${props => (props.$isSelected ? '#ffffff' : '#808080')};
    padding: 0px;
    background-color: ${props => (props.$isSelected ? '#3D3D3D' : '#adacac')};
`;

export const StyledCheckbox = styled.input`
    margin-right: 10px;
    color: white;
`;

const StyledCSVTable = styled.table<{ $small?: boolean, $mini?: boolean }>`
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    margin-top: ${props => (props.$small ? '0' : '0px')};
    border: 1px solid #ddd;
    font-size: ${props => (!props.$small ? '1rem' : (props.$mini ? '0.4rem' : '0.6rem'))};
    max-height: 100%;
`;

export default function BoxPlot() {
    const rawData = useAppSelector(getData);
    //const mean = getMean(rawData.map(row => row[hoveredColumn as string]));
    const filteredColumns = useAppSelector(getFilteredDataColumns);
    const [selectedColumns, setSelectedColumns] = useState<string[]>(filteredColumns);
    const columns = useAppSelector(getRawDataColumns);

    useEffect(() => {
        console.log("BoxPlot component mounted");
        columns.forEach(col => {
            drawBoxPlot(col);
        });
        return () => {
            console.log("BoxPlot component unmounted");
        };
    }, []);

    const drawBoxPlot = (column: string) => {
        console.log("Drawing box plot for column: ", column);
        const container = d3.select(`#boxplot-container-${column}`);
        //container.selectAll("*").remove(); // Clear previous content

        const svg = container.append("svg")
            .attr("width", 150)
            .attr("height", 180);
    
        const quartiles = getQuartiles(rawData.map(row => row[column]));
        const median = quartiles[1];
        const columnData = rawData.map(row => row[column])
            .filter((value): value is string => value !== null && !isNaN(Number(value)))
            .map(value => Number(value));
        console.log("columnData: ", columnData);
        const width = 150;
        const height = 180;
        const margin = { top: 20, right: 10, bottom: 10, left: 40 };

        const x = d3.scaleBand()
            .domain([column])
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
            .attr("x1", x(column) as number + x.bandwidth() / 2)
            .attr("x2", x(column) as number + x.bandwidth() / 2)
            .attr("y1", y(d3.min(columnData) as number))
            .attr("y2", y(d3.max(columnData) as number))
            .attr("stroke", "#7eb0d5");

        g.append("rect") //box
            .attr("x", x(column) as number)
            .attr("y", y(quartiles[2]))
            .attr("width", x.bandwidth())
            .attr("height", y(quartiles[0]) - y(quartiles[2]))
            .attr("fill", "teal")
            .attr("stroke", "white");

        g.append("line") // median
            .attr("x1", x(column) as number)
            .attr("x2", x(column) as number + x.bandwidth())
            .attr("y1", y(median))
            .attr("y2", y(median))
            .attr("stroke", "yellow");

        g.append("line") //bottom whisker
            .attr("x1", x(column) as number)
            .attr("x2", x(column) as number + x.bandwidth())
            .attr("y1", y(d3.min(columnData) as number))
            .attr("y2", y(d3.min(columnData) as number))
            .attr("stroke", "#7eb0d5");

        g.append("line") //top whisker
            .attr("x1", x(column) as number)
            .attr("x2", x(column) as number + x.bandwidth())
            .attr("y1", y(d3.max(columnData) as number))
            .attr("y2", y(d3.max(columnData) as number))
            .attr("stroke", "#7eb0d5");

        console.log("g container: ", g.data());
        svg.append("g") // Add y-axis instances
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(5))
            .attr("stroke", "white")
            .selectAll("path")
            .attr("stroke", "black");
        
        console.log("svg container: ", svg.data());
    };

    const handleColumnChange = (column: string) => {
        setSelectedColumns(prevSelectedColumns =>
            prevSelectedColumns.includes(column)
                ? prevSelectedColumns.filter(col => col !== column)
                : [...prevSelectedColumns, column]
        );
    };

    return (
        <StyledTableContainer>
            <StyledCSVTable $small={false} $mini={false}>
                <thead>
                    <tr>
                        {columns.map(col => (
                            <StyledTableHeader $isSelected={selectedColumns.includes(col)}>
                                <StyledCheckbox
                                    type="checkbox"
                                    checked={selectedColumns.includes(col)}
                                    onChange={() => handleColumnChange(col)}
                                />
                                {col}
                            </StyledTableHeader>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {columns.map(col => (
                            <StyledTableCell $isSelected={selectedColumns.includes(col)}>
                                <div id={`boxplot-container-${col}`}></div>
                            </StyledTableCell>))}
                    </tr>
                </tbody>
            </StyledCSVTable>
        </StyledTableContainer>
    );
}