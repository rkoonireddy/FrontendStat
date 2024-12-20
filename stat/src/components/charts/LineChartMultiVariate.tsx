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
import { convertRawDataToDataDocument } from "../../util/util";
import { COLOR_PALETTE } from "../../Theme";
import { convertToDataDocument } from "../../util/blockUtil";

interface LineChartProps {
    block: BlockModel;
    small?: boolean;
    mini?: boolean;
    dataLoader?: boolean;
}

export function LineChartMultiVariate({ block, dataLoader = false }: LineChartProps) {
    const pipeline = useAppSelector(getPipeline);
    const rawData = useAppSelector(getData);
    const filteredData = useAppSelector(getFilteredData);
    const [chartData, setChartData] = useState<DataDocument[]>([]);
    const [legendLabels, setLegendLabels] = useState<string[]>([]);

    useEffect(() => {
        if (block?.output?.Dataframe?.data) {
            const dataArray = convertToDataDocument(block.output.Dataframe.data);
            setChartData(dataArray);

            const columnNames = Object.keys(dataArray[0] || {}).slice(1);
            setLegendLabels(columnNames);
        } else if (dataLoader && rawData.length > 0) {
            const dataArray = convertRawDataToDataDocument(filteredData);
            setChartData(dataArray);

            const columnNames = Object.keys(dataArray[0] || {}).slice(1);
            setLegendLabels(columnNames);
        } else {
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
    }, []);

    useEffect(() => {
        if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0) return;

        const svg = select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous renders

        const margin = { top: 20, right: 10, bottom: 30, left: 50 };
        const chartHeight = (dimensions.height - margin.top - margin.bottom) / legendLabels.length;
        const width = dimensions.width - margin.left - margin.right;

        legendLabels.forEach((label, lineIndex) => {
            const chartGroup = svg.append("g")
                .attr("transform", `translate(0, ${lineIndex * chartHeight})`);

            const lineData = chartData.map(row => row[label] ?? null);
            const xValues = chartData.map((_, i) => i);
            const yValues = lineData.filter((d): d is number => d !== null);

            const yScale = scaleLinear()
                .domain([min(yValues) ?? 0, max(yValues) ?? 0])
                .range([chartHeight - margin.bottom, margin.top])
                .nice();

            const xScale = scaleLinear()
                .domain([0, xValues.length - 1])
                .range([0, width])
                .nice();

            const xAxis = axisBottom(xScale).ticks(5);
            const yAxis = axisLeft(yScale).ticks(5);

            chartGroup.append("g")
                .attr("class", "x-axis")
                .attr("transform", `translate(${margin.left}, ${chartHeight - margin.bottom})`)
                .call(xAxis)
                .selectAll("text")
                .style("fill", "white")
                .style("font-size", "12px");

            chartGroup.select(".x-axis")
                .selectAll("line")
                .style("stroke", "black")
                .style("stroke-width", "1px");

            chartGroup.select(".x-axis")
                .selectAll("path")
                .style("stroke", "black");

            chartGroup.append("g")
                .attr("class", "y-axis")
                .attr("transform", `translate(${margin.left}, 0)`)
                .call(yAxis)
                .selectAll("text")
                .style("fill", "white")
                .style("font-size", "12px");

            chartGroup.select(".y-axis")
                .selectAll("line")
                .style("stroke", "black")
                .style("stroke-width", "1px");

            chartGroup.select(".y-axis")
                .selectAll("path")
                .style("stroke", "black");

            const lineGenerator = line<number | null>()
                .defined(d => d !== null)
                .x((_, i) => xScale(i) + margin.left)
                .y(d => (d !== null ? yScale(d) : yScale(0)));

            chartGroup.append("path")
                .datum(lineData)
                .attr("d", lineGenerator)
                .attr("fill", "none")
                .attr("stroke", COLOR_PALETTE[lineIndex % COLOR_PALETTE.length])
                .attr("stroke-width", "2px");

            chartGroup.append("text")
                .attr("class", "chart-label")
                .attr("x", margin.left)
                .attr("y", margin.top - 5)
                .style("font-size", "10px")
                .style("font-weight", "bold")
                .style("fill", COLOR_PALETTE[lineIndex % COLOR_PALETTE.length])
                .text(label);
        });

    }, [chartData, dimensions, legendLabels]);

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {block?.output?.Dataframe?.data !== undefined || dataLoader ? (
                <div style={{ width: '100%', height: '100%' }}>
                    <svg
                        ref={svgRef}
                        width="100%"
                        height="100%"
                        style={{ display: 'block' }}
                    />
                </div>
            ) : (
                <div style={{
                    color: "#ffffff",
                    alignContent: "center",
                    textAlign: "center",
                }}>
                    Please run the pipeline to visualize your data!
                </div>
            )}
        </div>
    );
}
