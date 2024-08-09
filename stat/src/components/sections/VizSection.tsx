import styled from "styled-components";
import {
    select,
    line,
    curveCardinal,
    scaleLinear,
    axisBottom,
    axisLeft,
} from "d3";
import {useEffect, useRef, useState} from "react";

const StyledVizSectionContainer = styled.div`
  display: flex;
  background-color: #ffffff08;
  height: calc(100vh - 10px);
  margin: 5px;
`;

const StyledChartContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 10px;
  background-color: #ffffff08;
  padding: 5px;
  width: calc(100% - 20px);
  height: 50%;
  border-radius: 5px;
`;


//data
const data: { x: number, y: number }[] = [
    {x: 0, y: 10},
    {x: 1, y: 20},
    {x: 2, y: 15},
    {x: 3, y: 25},
    {x: 4, y: 30},
];

//chart component
const LineChart = () => {
    //refs
    const [dimensions, setDimensions] = useState({width: 0, height: 0});
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const resizeObserver = new ResizeObserver((entries) => {
            if (!entries || entries.length === 0) return;
            const { width, height } = entries[0].contentRect;
            setDimensions({ width, height });
        });

        resizeObserver.observe(svgRef.current as Element);

        return () => resizeObserver.unobserve(svgRef.current as Element);
    }, []);

    //draws chart
    useEffect(() => {
        if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0) return;
        const svg = select(svgRef.current);

        const margin = { top: 20, right: 30, bottom: 40, left: 30 };
        const width = dimensions.width - margin.left - margin.right;
        const height = dimensions.height - margin.top - margin.bottom;

        //scales
        const xScale = scaleLinear()
            .domain([0, data.length - 1])
            .range([0, width]);

        const yScale = scaleLinear()
            .domain([0, 100])
            .range([height, 0]);

        //axes
        const xAxis = axisBottom(xScale).ticks(data.length);
        svg.select<SVGSVGElement>(".x-axis")
            .style("transform", `translate(${margin.left}px, ${height + margin.top}px)`)
            .style("stroke", "white")
            .call(xAxis)
            .selectAll("path, line")
            .style("stroke", "white")
            .style("stroke-width", "2px");

        const yAxis = axisLeft(yScale);
        svg.select<SVGSVGElement>(".y-axis")
            .style("transform", `translate(${margin.left}px, ${margin.top}px)`)
            .style("stroke", "white")
            .call(yAxis)
            .selectAll("path, line")
            .style("stroke", "white")
            .style("stroke-width", "2px");

        //line generator
        const myLine = line<{ x: number, y: number }>()
            .x((d: { x: number; y: number }, i: number) => xScale(i))
            .y((d: { x: number; y: number }) => yScale(d.y))
            .curve(curveCardinal);

        //drawing the line
        svg
            .selectAll(".line")
            .data([data])
            .join("path")
            .attr("class", "line")
            .attr("d", myLine)
            .attr("fill", "none")
            .attr("stroke", "#00bfa6")
            .attr("stroke-width", "3px")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
    }, [data, dimensions]);

    return (
        <svg ref={svgRef} width="100%" height="100%">
            <g className="x-axis" />
            <g className="y-axis" />
        </svg>
    );
};

export function VizSection() {
    return (
        <StyledVizSectionContainer>
            <StyledChartContainer>
                <LineChart/>
            </StyledChartContainer>
        </StyledVizSectionContainer>
    )
}