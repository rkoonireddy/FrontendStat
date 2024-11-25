import { getData, getFilteredDataColumns, getRawDataColumns } from "../../redux/dataSlice";
import * as d3 from "d3";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
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
export const StyledTableCell = styled.td<{ $isSelected: boolean}>`
    border: 1px solid #00bfa6;
    color: ${props => (props.$isSelected ? '#ffffff' : '#808080')};
    padding: 8px;
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
    margin-top: ${props => (props.$small ? '0' : '10px')};
    border: 1px solid #ddd;
    font-size: ${props => (!props.$small ? '1rem' : (props.$mini ? '0.4rem' : '0.6rem'))};
    max-height: 100%;
`;

export default function BoxPlot({ hoveredColumn }: { hoveredColumn: string | null }) {
    const rawData = useAppSelector(getData);
    const mean = getMean(rawData.map(row => row[hoveredColumn as string]));
    const median = getMedian(rawData.map(row => row[hoveredColumn as string]));
    const quartiles = getQuartiles(rawData.map(row => row[hoveredColumn as string]));
    const filteredColumns = useAppSelector(getFilteredDataColumns);
    const [selectedColumns, setSelectedColumns] = useState<string[]>(filteredColumns);
    const columns = useAppSelector(getRawDataColumns);

    const svgRef = useRef<SVGSVGElement | null>(null);
    const columnData = rawData
        .map(row => row[hoveredColumn as string])
        .filter((value): value is string => value !== null && !isNaN(Number(value)))
        .map(value => Number(value));

    const handleColumnChange = (column: string) => {
        setSelectedColumns(prevSelectedColumns =>
            prevSelectedColumns.includes(column)
                ? prevSelectedColumns.filter(col => col !== column)
                : [...prevSelectedColumns, column]
        );
    };

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

    /*return (
        <StyledTableContainer>
                <svg ref={svgRef} width={150} height={200}></svg>
        </StyledTableContainer>
    );*/
    return (
        <StyledTableContainer>
            <StyledCSVTable $small={false} $mini={false}>
                <thead>
                    <tr>
                        {columns.map(col => (
                            <StyledTableHeader key={col}
                                $isSelected={selectedColumns.includes(col)}
                            /*onMouseEnter={() => setHoveredColumn(col)}
                            onMouseLeave={() => setHoveredColumn(null)}*/
                            >
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
                            <StyledTableCell key={col} $isSelected={selectedColumns.includes(col)}>
                                <svg ref={svgRef} width={150} height={200}></svg>
                            </StyledTableCell>))}
                    </tr>
                </tbody>
            </StyledCSVTable>
        </StyledTableContainer>
    );
}
