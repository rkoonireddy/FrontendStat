import React, {useRef, useEffect, useState} from 'react';
import * as d3 from 'd3';
import {scaleLinear, axisBottom, axisLeft, line, curveCardinal} from 'd3';
import {useAppSelector} from "../../hooks";
import {IPipelineState} from "../../redux/pipelineSlice";
import {BlockModel} from "../../types/responseType";
import {convertToDataDocument} from "../../util/blockUtil";
import {COLOR_PALETTE} from "../../Theme";
import styled from "styled-components";

const LINE_PATTERNS = [
    "none", // Solid line
    "4,4",  // Dashed line
    "1,2",  // Dotted line
    "5,2,1,2" // Dash-dot line
];

const StyledCompareChartContainer = styled.div`
    display: flex;
    justify-content: center;
    width: calc(100% - 10px);
    height: calc(100% - 90px);
`;

interface CompareLineChartProps {
    selectedFilters: { [blockId: string]: string[] };
}

export function CompareLineChart({selectedFilters}: CompareLineChartProps) {
    const pipeline = useAppSelector((state: { pipeline: IPipelineState }) => state.pipeline);
    const {blocks} = pipeline;

    const [dimensions, setDimensions] = useState({width: 0, height: 0});
    const svgRef = useRef<SVGSVGElement | null>(null);

    const [selectedLineIndex, setSelectedLineIndex] = useState<number | null>(null);

    const dataToPlot = Object.entries(selectedFilters).map(([blockId, selectedCols]) => {
        const block = blocks.find((b: BlockModel) => b.id === blockId);
        if (block?.output?.Dataframe?.data) {
            const dataArray = convertToDataDocument(block.output.Dataframe.data);
            return {blockId, data: dataArray, columns: selectedCols};
        }
        return {blockId, data: [], columns: selectedCols};
    });

    useEffect(() => {
        const svgElement = svgRef.current;
        if (!svgElement) return;

        const resizeObserver = new ResizeObserver(entries => {
            if (!entries || entries.length === 0) return;
            const {width, height} = entries[0].contentRect;
            setDimensions({width, height});
        });

        resizeObserver.observe(svgElement);

        return () => {
            if (resizeObserver && svgElement) {
                resizeObserver.unobserve(svgElement);
            }
        };
    }, [selectedFilters]);

    useEffect(() => {
        if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0) return;
        const svg = d3.select(svgRef.current);

        const margin = {top: 10, right: 10, bottom: 50, left: 70};
        const width = dimensions.width - margin.left - margin.right;
        const height = dimensions.height - margin.top - margin.bottom;

        svg.selectAll('*').remove();

        const xValues = dataToPlot.flatMap(({data}) => data.map((_, index) => index));
        const yValues = dataToPlot.flatMap(({data, columns}) =>
            columns.flatMap((column: string) => data.map(row => row[column] ?? 0))
        );

        const xScale = scaleLinear()
            .domain([0, d3.max(xValues) ?? 0])
            .range([0, width])
            .nice();

        const yScale = scaleLinear()
            .domain([d3.min(yValues) ?? 0, d3.max(yValues) ?? 0])
            .range([height, 0])
            .nice();

        const xAxis = axisBottom(xScale)
            .ticks(10)
            .tickFormat((d) => `${d}`);

        const yAxis = axisLeft(yScale)
            .ticks(10)
            .tickFormat((d) => `${d}`);

        let xAxisGroup = svg.select(".x-axis") as d3.Selection<SVGGElement, unknown, null, undefined>;
        if (xAxisGroup.empty()) {
            xAxisGroup = svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", `translate(${margin.left}, ${height + margin.top})`)
                .style("stroke", "white")
                .style("stroke-width", "2px");
        }

        let yAxisGroup = svg.select(".y-axis") as d3.Selection<SVGGElement, unknown, null, undefined>;
        if (yAxisGroup.empty()) {
            yAxisGroup = svg.append("g")
                .attr("class", "y-axis")
                .attr("transform", `translate(${margin.left}, ${margin.top})`)
                .style("stroke", "white");
        }

        xAxisGroup.call(xAxis);
        yAxisGroup.call(yAxis);

        svg.selectAll(".x-axis-label")
            .data([null])
            .join("text")
            .attr("class", "x-axis-label")
            .attr("text-anchor", "middle")
            .attr("x", width / 2 + margin.left)
            .attr("y", height + margin.top + 40)
            .style("fill", "white")
            .text("Time (as index)");

        svg.selectAll(".y-axis-label")
            .data([null])
            .join("text")
            .attr("class", "y-axis-label")
            .attr("text-anchor", "middle")
            .attr("x", -(height / 2 + margin.top))
            .attr("y", margin.left - 35)
            .attr("transform", "rotate(-90)")
            .style("fill", "white")
            .text("Amplitude");

        const lineGenerator = line<number | null>()
            .defined((d) => d !== null)
            .x((_, index) => xScale(index))
            .y(d => yScale(d ?? 0))
            .curve(curveCardinal);

        const columnPatterns: { [columnName: string]: string } = {};

        dataToPlot.forEach(({blockId, data, columns}, blockIndex) => {
            columns.forEach((column: string, colIndex: number) => {
                if (!columnPatterns[column]) {
                    columnPatterns[column] = LINE_PATTERNS[colIndex % LINE_PATTERNS.length];
                }

                const lineData = data.map(row => row[column]);
                const lineIndex = blockIndex * columns.length + colIndex;

                svg.append("path")
                    .datum(lineData)
                    .attr("fill", "none")
                    .attr("stroke", COLOR_PALETTE[blockIndex % COLOR_PALETTE.length]) // Block color
                    .attr("stroke-width", 1.5)
                    .attr("transform", `translate(${margin.left}, ${margin.top})`)
                    .attr("d", lineGenerator as any)
                    .style("stroke-dasharray", columnPatterns[column]) // Apply the same pattern based on the column name
                    .attr("stroke-opacity", selectedLineIndex === null || selectedLineIndex === lineIndex ? 1 : 0.4)
                    .on("click", () => setSelectedLineIndex(selectedLineIndex === lineIndex ? null : lineIndex));
            });
        });

    }, [dataToPlot, selectedLineIndex]);

    return (
        <StyledCompareChartContainer>
            <svg ref={svgRef} width="100%" height="100%" style={{display: 'block'}}/>
        </StyledCompareChartContainer>
    );
}
