import { useEffect, useRef, useState } from "react";
import {
    axisBottom,
    axisLeft,
    curveCardinal,
    line,
    scaleLinear,
    select,
    min,
    max,
    zoom,
    ZoomBehavior, zoomIdentity
} from "d3";
import { useAppSelector } from "../../hooks";
import { getPipeline } from "../../redux/pipelineSlice";
import { getData, getFilteredData } from "../../redux/dataSlice";
import { BlockModel } from "../../types/responseType";
import { DataDocument } from "../../types/dataType";
import { convertRawDataToDataDocument, getMinMax } from "../../util/util";
import { COLOR_PALETTE } from "../../Theme";
import { convertToDataDocument } from "../../util/blockUtil";


interface LineChartProps {
    block: BlockModel;
    small?: boolean;
    mini?: boolean;
    dataLoader?: boolean;
    hoveredColumn?: string | null;
}

export function LineChart({ block, small = false, mini = false, dataLoader = false, hoveredColumn = null }: LineChartProps) {
    const pipeline = useAppSelector(getPipeline);
    const rawData = useAppSelector(getData);
    const filteredData = useAppSelector(getFilteredData);
    const [chartData, setChartData] = useState<DataDocument[]>([]);
    const [legendLabels, setLegendLabels] = useState<string[]>([]);
    const [selectedLineIndex, setSelectedLineIndex] = useState<number | null>(0);

    useEffect(() => {
        if (block?.output?.Dataframe?.data) {
            const dataArray = convertToDataDocument(block.output.Dataframe.data);
            setChartData(dataArray);

            const columnNames = Object.keys(dataArray[0] || {}).slice(1);
            setLegendLabels(columnNames);
        } else if (dataLoader && rawData.length > 0) {
            // const dataArray = convertRawDataToDataDocument(rawData);
            const dataArray = convertRawDataToDataDocument(filteredData);
            setChartData(dataArray);

            const columnNames = Object.keys(dataArray[0] || {}).slice(1);
            setLegendLabels(columnNames);
        }
        else {
            setChartData([]);
            setLegendLabels([]);
        }
    }, [block, pipeline, filteredData, rawData]);

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const svgElement = svgRef.current;
        if (!svgElement) return;

        const resizeObserver = new ResizeObserver(entries => {
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

    useEffect(() => {
        if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0) return;
        const svg = select(svgRef.current);

        let margin = { top: 20, right: 10, bottom: 50, left: 50 };
        if (small) {
            if (mini) {
                margin = { top: 2, right: 2, bottom: 2, left: 2 };
            } else {
                margin = { top: 10, right: 10, bottom: 25, left: 25 };
            }
        }

        const width = dimensions.width - margin.left - margin.right;
        const height = dimensions.height - margin.top - margin.bottom;

        const xValues = chartData.map((_, index) => index);
        const yValues = legendLabels.flatMap(label => chartData.map(row => row[label] ?? 0));

        const xScale = scaleLinear()
            .domain([0, xValues.length - 1])
            .range([0, width])
            .nice();

        const yScale = scaleLinear()
            .domain([min(yValues) as number, max(yValues) as number])
            .range([height, 0])
            .nice();

        const xAxis = axisBottom(xScale)
            .ticks(small ? 2 : 10)
            .tickFormat(mini ? () => "" : (d) => `${d}`);

        const yAxis = axisLeft(yScale)
            .ticks(small ? 2 : 10)
            .tickFormat(mini ? () => "" : (d) => `${d}`);

        const zoomBehavior: ZoomBehavior<SVGSVGElement, unknown> = zoom<SVGSVGElement, unknown>()
            .scaleExtent([1, 5])
            .translateExtent([[margin.left, margin.top], [width + margin.right, height + margin.bottom]])
            .on("zoom", (event) => {
                const newXScale = event.transform.rescaleX(xScale);
                const newYScale = event.transform.rescaleY(yScale);

                svg.select<SVGGElement>(".x-axis").call(xAxis.scale(newXScale));
                svg.select<SVGGElement>(".y-axis").call(yAxis.scale(newYScale));

                legendLabels.forEach((label, lineIndex) => {
                    const lineData = chartData.map(row => row[label]);
                    const lineGenerator = line<number | null>()
                        .defined(d => d !== null)
                        .x((_, i) => newXScale(i))
                        .y(d => d !== null ? newYScale(d) : newYScale(0))
                        .curve(curveCardinal);

                    svg.selectAll(`.line-${lineIndex}`)
                        .data([lineData])
                        .join("path")
                        .attr("class", `line line-${lineIndex}`)
                        .attr("d", lineGenerator)
                        .attr("fill", "none")
                        .attr("stroke", COLOR_PALETTE[lineIndex % COLOR_PALETTE.length])
                        .attr("stroke-opacity", selectedLineIndex === null || selectedLineIndex === lineIndex ? 1 : 0.4)
                        .attr("stroke-width", small || mini ? "1px" : "1.5px");
                });
            });

        const resetGraph = () => {
            if (svgRef.current) {
                const svg = select(svgRef.current);
                svg.transition().duration(250).call(
                    zoomBehavior.transform,
                    zoomIdentity,
                    select(svgRef.current).select("g").node()
                );
            }
        };

        if (!small && !mini) {
            svg.call(zoomBehavior);
        }
        svg.on("dblclick.zoom", null);
        svg.on("dblclick", resetGraph);

        //axes
        svg.select<SVGGElement>(".x-axis")
            .attr("transform", `translate(${margin.left}, ${height + margin.top})`)
            .style("stroke", "white")
            .call(xAxis)
            .selectAll("path, line")
            .style("stroke", "black")
            .style("stroke-width", small ? "1px" : "2px");

        svg.select<SVGGElement>(".y-axis")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .style("stroke", "white")
            .call(yAxis)
            .selectAll("path, line")
            .style("stroke", "black")
            .style("stroke-width", small ? "1px" : "2px");

        svg.selectAll(".hovered-column-info").remove();

        if (hoveredColumn!) {
            const minMax = getMinMax(rawData.map(row => row[hoveredColumn]));
            svg.append("line") //max-line
                .attr("class", "hovered-column-info")
                .attr("transform", `translate(${margin.left}, ${margin.top})`)
                .attr("x1", 0)
                .attr("x2", width)
                .attr("y1", yScale(minMax[1]))
                .attr("y2", yScale(minMax[1]))
                .style("stroke", "white")
                .style("stroke-dasharray", "4 2")

            // Append text over max line
            svg.append("text")
                .attr("class", "hovered-column-info")
                .attr("transform", `translate(${margin.left}, ${margin.top})`)
                .attr("x", width - 10) // Adjust x position as needed
                .attr("y", yScale(minMax[1]) - 5) // Adjust y position as needed
                .attr("text-anchor", "end")
                .style("fill", "white")
                .text(`Max: ${minMax[1]}`);

            svg.append("line") //min-line
                .attr("class", "hovered-column-info")
                .attr("transform", `translate(${margin.left}, ${margin.top})`)
                .attr("x1", 0)
                .attr("x2", width)
                .attr("y1", yScale(minMax[0]))
                .attr("y2", yScale(minMax[0]))
                .style("stroke", "white")
                .style("stroke-dasharray", "4 2")

            // Append text below min line
            svg.append("text")
                .attr("class", "hovered-column-info")
                .attr("transform", `translate(${margin.left}, ${margin.top})`)
                .attr("x", width - 10) // Adjust x position as needed
                .attr("y", yScale(minMax[0]) + 15) // Adjust y position as needed
                .attr("text-anchor", "end")
                .style("fill", "white")
                .text(`Min: ${minMax[0]}`);
        }

        const lineGenerator = line<number | null>()
            .defined(d => d !== null)
            .x((_, i) => xScale(i))
            .y(d => d !== null ? yScale(d) : yScale(0))
            .curve(curveCardinal);

        legendLabels.forEach((label, lineIndex) => {
            const lineData = chartData.map(row => row[label]);
            svg.selectAll(`.line-${lineIndex}`)
                .data([lineData])
                .join("path")
                .attr("class", `line line-${lineIndex}`)
                .attr("d", lineGenerator)
                .attr("fill", "none")
                .style("cursor", "pointer")
                .attr("transform", `translate(${margin.left}, ${margin.top})`)
                .attr("stroke", COLOR_PALETTE[lineIndex % COLOR_PALETTE.length])
                .attr("stroke-opacity", selectedLineIndex === null || selectedLineIndex === lineIndex ? 1 : 0.25)
                .attr("stroke-width", selectedLineIndex === lineIndex ? "3px" : "1px")
                .attr("stroke-width", small || mini ? "1px" : "2px")
                .on("click", () => setSelectedLineIndex(selectedLineIndex === lineIndex ? null : lineIndex));
        });

        if (small || mini) {
            svg.select<SVGGElement>(".x-axis")
                .selectAll("text")
                .style("font-size", "7px")
                .style("font-weight", "lighter");

            svg.select<SVGGElement>(".y-axis")
                .selectAll("text")
                .style("font-size", "7px")
                .style("font-weight", "lighter");
        }

        const legendGroup = svg.select<SVGGElement>(".legend-group").empty()
            ? svg.append("g").attr("class", "legend-group").attr("transform", `translate(${dimensions.width - margin.right - 20}, ${margin.top})`)
            : svg.select<SVGGElement>(".legend-group");

        if (!small && !mini) {
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

            legendGroup.selectAll(".legend-item").remove();

            legendLabels.forEach((label, lineIndex) => {
                legendGroup.append("text")
                    .attr("x", -120)
                    .attr("y", lineIndex * 20 + 5)
                    .attr("dy", "0.35em")
                    .style("fill", COLOR_PALETTE[lineIndex % COLOR_PALETTE.length])
                    .style("cursor", "pointer")
                    .style("text-anchor", "start")
                    .text(label)
                    .on("click", function (event: MouseEvent) {
                        const index = lineIndex;
                        if (selectedLineIndex === index) {
                            setSelectedLineIndex(null);
                        } else {
                            setSelectedLineIndex(index);
                        }
                    });
            });

            legendGroup.selectAll("text")
                .data(legendLabels)
                .join("text")
                .on("click", function (event: MouseEvent, label: string) {
                    const index = legendLabels.indexOf(label);
                    if (selectedLineIndex === index) {
                        setSelectedLineIndex(null);
                    } else {
                        setSelectedLineIndex(index);
                    }
                })
                .attr("x", -120)
                .attr("y", (d, i) => i * 20 + 5)
                .attr("dy", "0.35em")
                .attr("opacity", (d, i) => selectedLineIndex === i ? 1 : 0.25)
                .style("fill", (d, i) => COLOR_PALETTE[i % COLOR_PALETTE.length])
                .style("cursor", "pointer")
                .style("text-anchor", "start")
                .text(d => d);
        }

    }, [chartData, dimensions, legendLabels, selectedLineIndex, mini, small]);

    useEffect(() => { // Link selected Line Index to hovered column
        if (hoveredColumn) {
            const columnIndex = filteredData[0]?.hasOwnProperty(hoveredColumn) ? Object.keys(filteredData[0]).indexOf(hoveredColumn) : -1;
            setSelectedLineIndex(columnIndex - 1);
        }
        else {
            setSelectedLineIndex(0);
        }
    }, [hoveredColumn]);


    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {block?.output?.Dataframe?.data !== undefined || dataLoader ? (
                <div style={{ width: '100%', height: '100%' }}>
                    <svg
                        ref={svgRef}
                        width="100%"
                        height="100%"
                        style={{ display: 'block' }}
                    >
                        <g className="x-axis" />
                        <g className="y-axis" />
                        <g className="chart-group" />
                    </svg>
                </div>
            ) : (

                <div style={{
                    color: "#ffffff",
                    alignContent: "center",
                    textAlign: "center",
                    transform: small ? 'scale(0.5)' : 'scale(1)'
                }}>
                    {small ? 'Run Pipeline' : 'Please run the pipeline to visualize your data!'}
                </div>

                //     <div style={{width: '100%', height: '100%'}}>
                //     <svg
                //         ref={svgRef}
                //         width="100%"
                //         height="100%"
                //         style={{display: 'block'}}
                //     >
                //         <g className="x-axis"/>
                //         <g className="y-axis"/>
                //         <g className="chart-group"/>
                //     </svg>
                // </div>
            )}
        </div>
    );
}
