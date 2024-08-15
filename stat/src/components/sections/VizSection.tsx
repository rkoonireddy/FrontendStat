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
import {getMinMax} from "../../util/util";
import {DataPoint} from "../../types/dataType";
import {getData} from "../../service/dataService";
import {ControlSection} from "./ControlSection";
import {ReactComponent as DownSVG} from "../../assets/caret-down-fill.svg";
import {ReactComponent as UpSVG} from "../../assets/caret-up-fill.svg";
import {PipelineHistorySection} from "./PipelineHistorySection";


const StyledVizSectionContainer = styled.div`
  position: relative;
  display: flex;
  background-color: #ffffff08;
  height: calc(100vh - 10px);
  margin: 5px;
  flex-direction: column;
`;

const StyledChartContainer = styled.div<{controlsVisible: boolean}>`
  display: flex;
  justify-content: center;
  margin: 10px;
  background-color: #ffffff08;
  padding: 5px;
  width: calc(100% - 20px);
  height: calc(${props => props.controlsVisible ? '65%' : '100%'} - 30px);
  border-radius: 15px;
`;

const StyledShowHideControls = styled.div<{marginTop?: string}>`
  display: flex;
  justify-content: center;
  height: 25px;
  opacity: 0.25;
  margin-left: 10px;
  background-color: #ffffff08;
  width: calc(100% - 20px);
  margin-top: ${props => props.marginTop ? props.marginTop : '0'};
  position: ${props => props.marginTop ? 'absolute' : 'relative'};

  &:hover {
    cursor: pointer;
    opacity: 1;
  }
`;


//chart component
function LineChart({chartData}: {chartData: DataPoint[][]}) {

    const minMax = getMinMax(chartData);

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
        console.log(chartData);

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
        <svg ref={svgRef} width="100%" height="100%">
            <g className="x-axis" />
            <g className="y-axis" />
        </svg>
    );
}

// controls


export function VizSection() {
    const [chartData, setChartData] = useState<DataPoint[][]>([]);
    const [controlsVisible, setControlsVisible] = useState<boolean>(true);
    const [historyVisible, setHistoryVisible] = useState<boolean>(true);

    useEffect(() => {
        getData().then(data => setChartData(data));
    }, []);

    return (
        <StyledVizSectionContainer id={"viz-section"}>

            {!historyVisible &&
            <StyledShowHideControls marginTop={"5%"} onClick={() => setHistoryVisible(true)}>
                <DownSVG style={{width: "25px", height: "25px", color: "#ffffff"}}/>
            </StyledShowHideControls>}
            <PipelineHistorySection visible={historyVisible}/>
            {historyVisible &&
                <StyledShowHideControls onClick={() => setHistoryVisible(false)}>
                    <UpSVG style={{width: "25px", height: "25px", color: "#ffffff"}}/>
                </StyledShowHideControls>}

            <StyledChartContainer controlsVisible={controlsVisible}>
                <LineChart chartData={chartData}/>
            </StyledChartContainer>

            {controlsVisible &&
            <StyledShowHideControls onClick={() => setControlsVisible(false)}>
                <DownSVG style={{width: "25px", height: "25px", color: "#ffffff"}}/>
            </StyledShowHideControls> }
            <ControlSection visible={controlsVisible}/>
            {!controlsVisible &&
            <StyledShowHideControls onClick={() => setControlsVisible(true)}>
                <UpSVG style={{width: "25px", height: "25px", color: "#ffffff"}}/>
            </StyledShowHideControls>}

        </StyledVizSectionContainer>
    )
}