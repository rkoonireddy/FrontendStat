import {DataPoint} from "../../types/dataType";
import {convertToDataPoints, getMinMax} from "../../util/util";
import {useEffect, useRef, useState} from "react";
import {axisBottom, axisLeft, curveCardinal, line, scaleLinear, select} from "d3";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {getActiveBlock, getPipeline} from "../../redux/pipelineSlice";

export function LineChart() {
    const dispatch = useAppDispatch();
    const activeBlock = useAppSelector(getActiveBlock);
    const pipeline = useAppSelector(getPipeline);
    const [chartData, setChartData] = useState<DataPoint[][]>([]);

    useEffect(() => {
        if (activeBlock?.output?.Dataframe?.data !== undefined) {
            const data = convertToDataPoints(activeBlock.output.Dataframe.data);
            setChartData(data);
        } else {
            setChartData([]);
        }
    }, [activeBlock, pipeline]);

    //refs
    const [dimensions, setDimensions] = useState({width: 0, height: 0});
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const svgElement = svgRef.current;
        if (!svgElement) return;

        const resizeObserver = new ResizeObserver((entries) => {
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
    }, [activeBlock]);

    //draws chart
    useEffect(() => {
        if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0) return;
        const svg = select(svgRef.current);

        const margin = {top: 20, right: 30, bottom: 40, left: 30};
        const width = dimensions.width - margin.left - margin.right;
        const height = dimensions.height - margin.top - margin.bottom;

        const minMax = getMinMax(chartData);

        //scales
        const xScale = scaleLinear()
            .domain([minMax.x.min, minMax.x.max])
            .range([minMax.x.min, width]);

        const yScale = scaleLinear()
            .domain([minMax.y.min, minMax.y.max])
            .range([height, minMax.y.min]);

        //axes
        const xAxis = axisBottom(xScale).ticks(chartData.length);
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
            .data(chartData)
            .join("path")
            .attr("class", "line")
            .attr("d", myLine)
            .attr("fill", "none")
            .attr("stroke", (d, i) => (i === 0 ? "#00bfa6" : "#ff5733"))
            .attr("stroke-width", "2px")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
    }, [chartData, dimensions]);

    return (
        activeBlock?.output?.Dataframe?.data !== undefined ? (
            <svg ref={svgRef} width="100%" height="100%">
                <g className="x-axis"/>
                <g className="y-axis"/>
            </svg>
        ) : (
            <div>Please run a block to visualize your data!</div>
        )
    );
}