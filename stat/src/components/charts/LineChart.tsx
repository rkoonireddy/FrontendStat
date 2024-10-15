import { DataPoint } from "../../types/dataType";
import { convertToDataPoints, getMinMax } from "../../util/util";
import { useEffect, useRef, useState } from "react";
import { axisBottom, axisLeft, curveCardinal, line, scaleLinear, select } from "d3";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { getPipeline } from "../../redux/pipelineSlice";
import { BlockModel } from "../../types/responseType";

// Color blind friendly colors
const DEFAULT_COLORS = [
    "#00bfa6",
    "#ff5733",
    "#009E73", // green
    "#E69F00", // orange
    "#56B4E9", // sky blue
    "#F0E442", // yellow
    "#0072B2", // blue
    "#D55E00", // red
    "#CC79A7", // pink
    "#999999", // grey
    "#C5B0D5", // lavender
    "#C45E24", // brown
];

export function LineChart({ block, small = false }: { block: BlockModel, small?: boolean }) {
    const dispatch = useAppDispatch();
    const pipeline = useAppSelector(getPipeline);
    const [chartData, setChartData] = useState<DataPoint[][]>([]);
    const [legendLabels, setLegendLabels] = useState<string[]>([]);
    const [selectedLineIndex, setSelectedLineIndex] = useState<number | null>(null); // State to track the selected line

    useEffect(() => {
        if (block?.output?.Dataframe?.data !== undefined) {
            const data = convertToDataPoints(block.output.Dataframe.data);
            setChartData(data);

            // Extract column names from the second column of data, skipping the first column
            const columnNames = block.output.Dataframe.data.map((column: any) => column.name).slice(1); // Start from the second name
            setLegendLabels(columnNames);
        } else {
            setChartData([]);
            setLegendLabels([]);
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

        const margin = { top: 20, right: 30, bottom: 60, left: 60 };
        const width = dimensions.width - margin.left - margin.right;
        const height = dimensions.height - margin.top - margin.bottom;

        const minMax = getMinMax(chartData);

        // Scales
        const xScale = scaleLinear()
            .domain([0, minMax.x.max])
            .range([0, width])
            .nice();

        const yScale = scaleLinear()
            .domain([minMax.y.min, minMax.y.max])
            .range([height, 0])
            .nice();

        // Axes
        const xAxis = axisBottom(xScale)
            .ticks(6)
            .tickFormat((d) => `${d}`);

        svg.select<SVGGElement>(".x-axis")
            .attr("transform", `translate(${margin.left}, ${height + margin.top})`)
            .style("stroke", "white")
            .call(xAxis)
            .selectAll("path, line")
            .style("stroke", "white")
            .style("stroke-width", "2px");

        const yAxis = axisLeft(yScale)
            .ticks(5)
            .tickFormat((d) => `${d}`);

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

        // Drawing the lines
        svg.selectAll(".line")
            .data(chartData)
            .join("path")
            .attr("class", "line")
            .attr("d", myLine)
            .attr("fill", "none")
            .attr("stroke", (d, i) => (i === selectedLineIndex ? DEFAULT_COLORS[i % DEFAULT_COLORS.length] : DEFAULT_COLORS[i % DEFAULT_COLORS.length])) // Use default colors
            .attr("stroke-opacity", (d, i) => (i === selectedLineIndex ? 1 : 0.4)) // Set opacity based on selection
            .attr("stroke-width", "2px")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .on("click", (event, d) => {
                const index = chartData.indexOf(d); // Get the index of the clicked data
                // console.log(`Clicked Line Index: ${index}`); // Log the index of the selected line
                setSelectedLineIndex(index); // Set the selected line index
            });

        if (!small) {
            // X-axis label (white text)
            svg.select(".x-axis-label")
                .data([null])
                .join("text")
                .attr("class", "x-axis-label")
                .attr("text-anchor", "middle")
                .attr("x", width / 2 + margin.left)
                .attr("y", height + margin.top + 40)
                .style("fill", "white")
                .text("Time");

            // Y-axis label (white text)
            svg.select(".y-axis-label")
                .data([null])
                .join("text")
                .attr("class", "y-axis-label")
                .attr("text-anchor", "middle")
                .attr("x", -(height / 2 + margin.top))
                .attr("y", margin.left - 40)
                .attr("transform", "rotate(-90)")
                .style("fill", "white")
                .text("Amplitude");

            // Legend
            const legend = svg.selectAll(".legend")
                .data(chartData)
                .join("g")
                .attr("class", "legend")
                .attr("transform", (d, i) => `translate(${width - margin.right}, ${i * 20})`);

            legend.append("rect")
                .attr("x", -18)
                .attr("y", 14)
                .attr("width", 15)
                .attr("height", 10)
                .attr("fill", (d, i) => DEFAULT_COLORS[i % DEFAULT_COLORS.length]); // Default color for legend

            legend.append("text")
                .attr("x", -24)
                .attr("y", 20)
                .attr("dy", "0.35em")
                .style("text-anchor", "end")
                .style("fill", "white") // White legend text
                .text((d, i) => legendLabels[i] || `Line ${i + 1}`)
                .on("click", function(event: MouseEvent) {
                    // Get the index from the closure scope (i)
                    const i = legendLabels.indexOf(this.textContent || ""); // Get the index of the clicked legend item using textContent
                    
                    // Log the index of the clicked legend
                    // console.log(`Clicked Legend Index: ${i}`); 
                    
                    // When clicking on the legend, select the corresponding line
                    setSelectedLineIndex(i);
                });
            
            
        }

    }, [chartData, dimensions, legendLabels, selectedLineIndex]); // Add selectedLineIndex to the dependencies

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
