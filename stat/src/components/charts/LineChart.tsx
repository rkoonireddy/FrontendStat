import { DataPoint } from "../../types/dataType";
import { convertToDataPoints, getMinMax } from "../../util/util";
import { useEffect, useRef, useState } from "react";
import { axisBottom, axisLeft, curveCardinal, line, scaleLinear, select } from "d3";
import { useAppSelector } from "../../hooks";
import { getPipeline } from "../../redux/pipelineSlice";
import { BlockModel } from "../../types/responseType";

// Color-blind friendly colors
const DEFAULT_COLORS = [
    "#00bfa6",
    "#ff5733",
    "#E69F00", // orange
    "#0072B2", // blue
    "#CC79A7", // pink
    "#999999", // grey
    "#C5B0D5", // lavender
    "#C45E24", // brown
    "#009E73", // green
    "#F0E442", // yellow
    "#56B4E9", // sky blue
    "#D55E00", // redu
];

export function LineChart({ block, small = false, mini = false }: { block: BlockModel, small?: boolean, mini?: boolean }) {
    const pipeline = useAppSelector(getPipeline);
    const [chartData, setChartData] = useState<DataPoint[][]>([]);
    const [legendLabels, setLegendLabels] = useState<string[]>([]);
    const [selectedLineIndex, setSelectedLineIndex] = useState<number | null>(null);

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

        let margin = { top: 20, right: 10, bottom: 50, left: 50 };
        if (small) {
            if(mini) {
                margin = { top: 2, right: 2, bottom: 2, left: 2 };
            } else {
                margin = {top: 10, right: 10, bottom: 25, left: 25};
            }
        }
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
            .ticks(small ? 3 : 6)
            .tickFormat(mini ? () => "" : (d) => `${d}`);

        svg.select<SVGGElement>(".x-axis")
            .attr("transform", `translate(${margin.left}, ${height + margin.top})`)
            .style("stroke", "white")
            .call(xAxis)
            .selectAll("path, line")
            .style("stroke", "white")
            .style("stroke-width", small ? "1px" : "2px");


        const yAxis = axisLeft(yScale)
            .ticks(small ? 2 : 6)
            .tickFormat(mini ? () => "" : (d) => `${d}`);

        svg.select<SVGGElement>(".y-axis")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .style("stroke", "white")
            .call(yAxis)
            .selectAll("path, line")
            .style("stroke", "white")
            .style("stroke-width", small ? "1px" : "2px");

        // Line generator
        const myLine = line<{ x: number, y: number | null }>()
            .defined((d) => d.y !== null && d.y !== undefined) // Only use defined data points for the line
            .x((d, i) => xScale(i))
            .y((d) => yScale(d.y as number)) // `as number` since null values are skipped
            .curve(curveCardinal);

        // Drawing the lines
        svg.selectAll(".line")
            .data(chartData)
            .join("path")
            .attr("class", "line")
            .attr("d", myLine)
            .attr("fill", "none")
            .attr("stroke", (d, i) => (i === selectedLineIndex ? DEFAULT_COLORS[i % DEFAULT_COLORS.length] : DEFAULT_COLORS[i % DEFAULT_COLORS.length])) // Use default colors
            .attr("stroke-opacity", (d, i) => (selectedLineIndex !== null  && i !== selectedLineIndex ? 0.4 : 1)) // Set opacity based on selection
            .attr("stroke-width", small || mini ? "1px" : "2px")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .style("cursor", "pointer") // Hand cursor on graph lines
            .on("click", (event, d) => {
                const index = chartData.indexOf(d); // Get the index of the clicked data
                if (selectedLineIndex === index) {
                    setSelectedLineIndex(null);
                } else {
                    setSelectedLineIndex(index);
                }
            });

        // //handling empty values differently on the x-axis
        // chartData.forEach((lineData, lineIndex) => {
        //     svg.selectAll(`.missing-dash-${lineIndex}`)
        //         .data(lineData)
        //         .join("line")
        //         .attr("class", `missing-dash-${lineIndex}`)
        //         .attr("x1", (d, i) => xScale(i) + margin.left - 5) // Adjust x position
        //         .attr("y1", (d) => (d.y === null || d.y === undefined) ? yScale(0) + margin.top : yScale(d.y) + margin.top)
        //         .attr("x2", (d, i) => xScale(i) + margin.left + 5) // Adjust x position
        //         .attr("y2", (d) => (d.y === null || d.y === undefined) ? yScale(0) + margin.top : yScale(d.y) + margin.top)
        //         .attr("stroke", "red")
        //         .attr("stroke-width", 2)
        //         .attr("stroke-dasharray", "4,4") // Create a dashed line
        //         .style("visibility", (d) => (d.y === null || d.y === undefined) ? "visible" : "hidden"); // Hide if data is present
        // });

        if(small || mini) {
            svg.select<SVGGElement>(".x-axis")
                .selectAll("text")
                .style("font-size", "7px")
                .style("font-weight", "lighter");

            svg.select<SVGGElement>(".y-axis")
                .selectAll("text")
                .style("font-size", "7px")
                .style("font-weight", "lighter");
        }

        if (!small && !mini) {
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
                .attr("y", margin.left - 35)
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
                .attr("x", 30)
                .attr("y", 14)
                .attr("width", 15)
                .attr("height", 10)
                .attr("fill", (d, i) => DEFAULT_COLORS[i % DEFAULT_COLORS.length])

            legend.append("text")
                .attr("x", 20)
                .attr("y", 20)
                .attr("dy", "0.35em")
                .style("text-anchor", "end")
                .style("fill", (d, i) => (selectedLineIndex !== null && i !== selectedLineIndex ? "grey" : "white"))
                .style("cursor", "pointer") // Hand cursor on legend
                .text((d, i) => legendLabels[i] || `Line ${i + 1}`)
                .on("click", function (event: MouseEvent) {
                    const i = legendLabels.indexOf(this.textContent || ""); // Get the index of the clicked legend item
                    if (selectedLineIndex === i) {
                        setSelectedLineIndex(null);
                    } else {
                        setSelectedLineIndex(i);
                    }
                });
        }
    }, [chartData, dimensions, legendLabels, selectedLineIndex]);

    return (
        block?.output?.Dataframe?.data !== undefined ? (
            <svg ref={svgRef} width="100%" height="100%">
                <g className="x-axis" />
                <g className="y-axis" />
                <text className="x-axis-label" />
                <text className="y-axis-label" />
            </svg>
        ) : (
            <div style={{ color: "#ffffff", alignContent: "center"}}>Please run the pipeline to visualize your data !</div>
        )
    );
}
