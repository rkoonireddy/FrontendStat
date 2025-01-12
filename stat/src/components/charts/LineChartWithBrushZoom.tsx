import { useEffect, useRef, useState } from "react";
import { axisBottom, axisLeft, curveCardinal, line, scaleLinear, select, min, max, brushX } from "d3";
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

export function LineChart2({ block, small = false, mini = false, dataLoader = false }: LineChartProps) {
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

    // Create brush behavior for zooming
    const brushBehavior = brushX<SVGGElement>()
      .extent([[margin.left, margin.top], [width + margin.left, height + margin.top]])
      .on("end", (event) => {
        if (!event.selection) return;

        const [x0, x1] = event.selection;
        const newXScale = xScale.copy().domain([xScale.invert(x0), xScale.invert(x1)]);

        svg.select<SVGGElement>(".x-axis").call(xAxis.scale(newXScale)); // Update x-axis with new scale

        // Update lines based on new x-scale
        svg.selectAll(".line").attr("d", (d, i) => {
          const lineData = chartData.map((row) => row[legendLabels[i]]);
          return lineGenerator(lineData, newXScale);
        });
      });

    // Apply brush behavior (zooming will be based on brush interaction)
    svg.select<SVGGElement>(".brush").call(brushBehavior as any);

    // Drawing lines
    const lineGenerator = (lineData: (number | null)[], newXScale?: any) => {
      const lineGen = line<number | null>()
        .defined(d => d !== null)
        .x((_, i) => (newXScale ? newXScale(i) : xScale(i)))
        .y(d => d !== null ? yScale(d) : yScale(0))
        .curve(curveCardinal);

      return lineGen(lineData);
    };

    legendLabels.forEach((label, lineIndex) => {
      const lineData = chartData.map(row => row[label]);
      svg.selectAll(`.line-${lineIndex}`)
        .data([lineData])
        .join("path")
        .attr("class", `line line-${lineIndex}`)
        .attr("d", lineGenerator(lineData))
        .attr("fill", "none")
        .style("cursor", "pointer")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .attr("stroke", COLOR_PALETTE[lineIndex % COLOR_PALETTE.length])
        .attr("stroke-opacity", selectedLineIndex === null || selectedLineIndex === lineIndex ? 1 : 0.25)
        .attr("stroke-width", selectedLineIndex === lineIndex ? "3px" : "1px")
        .attr("stroke-width", small || mini ? "1px" : "2px")
        .on("click", () => setSelectedLineIndex(selectedLineIndex === lineIndex ? null : lineIndex));
    });

    // Return function to clean up chart when component unmounts
    return () => {
      svg.selectAll(".line").remove();
    };
  }, [chartData, legendLabels, mini, small, dimensions]);

  return (
    <svg ref={svgRef} width="100%" height={200}>
      <g className="x-axis" />
      <g className="y-axis" />
      <g className="brush" />
    </svg>
  );
}
