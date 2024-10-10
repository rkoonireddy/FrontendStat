import { DataPoint } from "../../types/dataType";
import { convertToDataPoints, getMinMax } from "../../util/util";
import { useEffect, useRef, useState } from "react";
import { axisBottom, axisLeft, curveCardinal, line, scaleLinear, select } from "d3";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { getPipeline } from "../../redux/pipelineSlice";
import { BlockModel } from "../../types/responseType";

export function LineChart({ block }: { block: BlockModel }) {
    const dispatch = useAppDispatch();
    const pipeline = useAppSelector(getPipeline);
    const [chartData, setChartData] = useState<DataPoint[][]>([]);

    useEffect(() => {
        if (block?.output?.Dataframe?.data !== undefined) {
            const data = convertToDataPoints(block.output.Dataframe.data);
            setChartData(data);
        } else {
            setChartData([]);
        }
    }, [block, pipeline]);

    // Refs
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const svgElement = svgRef.current;
        if (!svgElement) return;

        const resizeObserver = new ResizeObserver((entries) => {
            if (!entries || entries.length === 0) return;
            const { width, height } = entries[0].contentRect;
            setDimensions({ width, height });
        });

        resizeObserver.observe(svgElement);

        return () => {
            if (resizeObserver && svgElement) {
                resizeObserver.unobserve(svgElement);
            }
        };
    }, [block]);

    // Draw chart
    useEffect(() => {
        if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0) return;
        const svg = select(svgRef.current);

        const margin = { top: 20, right: 30, bottom: 60, left: 60 }; // Adjusted margins
        const width = dimensions.width - margin.left - margin.right;
        const height = dimensions.height - margin.top - margin.bottom;

        const minMax = getMinMax(chartData);

        // Scales
        const xScale = scaleLinear()
            .domain([0, minMax.x.max]) // X-axis data range
            .range([0, width])
            .nice(); // Add padding to X-axis range

        const yScale = scaleLinear()
            .domain([minMax.y.min, minMax.y.max]) // Y-axis data range
            .range([height, 0]) // Y-axis is reversed
            .nice(); // Add padding to Y-axis range

        // Axes
        const xAxis = axisBottom(xScale)
            .ticks(6) // Adjust number of ticks
            .tickFormat((d) => `${d}`); // Customize X-axis tick labels

        svg.select<SVGGElement>(".x-axis")
            .attr("transform", `translate(${margin.left}, ${height + margin.top})`)
            .style("stroke", "white")
            .call(xAxis)
            .selectAll("path, line")
            .style("stroke", "white")
            .style("stroke-width", "2px");

        const yAxis = axisLeft(yScale)
            .ticks(5) // Adjust number of ticks
            .tickFormat((d) => `${d}`); // Customize Y-axis tick labels

        svg.select<SVGGElement>(".y-axis")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .style("stroke", "white")
            .call(yAxis)
            .selectAll("path, line")
            .style("stroke", "white")
            .style("stroke-width", "2px");

        // Line generator
        const myLine = line<{ x: number, y: number }>()
            .x((d, i) => xScale(i))
            .y((d) => yScale(d.y))
            .curve(curveCardinal);

        // Drawing the line
        svg.selectAll(".line")
            .data(chartData)
            .join("path")
            .attr("class", "line")
            .attr("d", myLine)
            .attr("fill", "none")
            .attr("stroke", (d, i) => (i === 0 ? "#00bfa6" : "#ff5733"))
            .attr("stroke-width", "2px")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // X-axis label (white text)
        svg.select(".x-axis-label")
            .data([null])
            .join("text")
            .attr("class", "x-axis-label")
            .attr("text-anchor", "middle")
            .attr("x", width / 2 + margin.left)
            .attr("y", height + margin.top + 40)
            .style("fill", "white")
            .text("Time"); //change the text here for Y-Axis label

        // Y-axis label (white text)
        svg.select(".y-axis-label")
            .data([null])
            .join("text")
            .attr("class", "y-axis-label")
            .attr("text-anchor", "middle")
            .attr("x", -(height / 2 + margin.top))
            .attr("y", margin.left - 50)
            .attr("transform", "rotate(-90)")
            .style("fill", "white")
            .text("Amplitude"); //change the text here for Y-Axis label

        // Legend
        const legend = svg.selectAll(".legend")
            .data(chartData)
            .join("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(${width - margin.right}, ${i * 20})`);

        legend.append("rect")
            .attr("x", -18)
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", (d, i) => (i === 0 ? "#00bfa6" : "#ff5733"));

        legend.append("text")
            .attr("x", -24)
            .attr("y", 9)
            .attr("dy", "0.35em")
            .style("text-anchor", "end")
            .style("fill", "white") // White legend text
            .text((d, i) => `Line ${i + 1}`);

    }, [chartData, dimensions]);

    return (
        block?.output?.Dataframe?.data !== undefined ? (
            <svg ref={svgRef} width="100%" height="100%">
                <g className="x-axis" />
                <g className="y-axis" />
                <text className="x-axis-label" />
                <text className="y-axis-label" />
            </svg>
        ) : (
            <div>Please run the pipeline to visualize your data!</div>
        )
    );
}
