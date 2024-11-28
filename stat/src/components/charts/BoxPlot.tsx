import {
    getData, getFilteredDataColumns, getRawDataColumns, setFilteredData,
    getFilteredDataAsCSVString, getFilteredDataChanged, setFilteredDataChanged
} from "../../redux/dataSlice";
import * as d3 from "d3";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { updateCSVLoaderBlock } from "../../service/blockService";
import { fetchFullBlock, getFrequency } from "../../redux/pipelineSlice";
import { getQuartiles } from "../../util/util";
import {StyledTableCell, StyledTableContainer, StyledTableHeader, StyledCheckbox, StyledCSVTable} from "./CSVViewer";


export default function BoxPlot({ blockId, setHoveredColumn }: { blockId: string, setHoveredColumn: (column: string | null) => void }) {
    const dispatch = useAppDispatch();
    const rawData = useAppSelector(getData);
    const filteredColumns = useAppSelector(getFilteredDataColumns);
    const filteredDataCSVString = useAppSelector(getFilteredDataAsCSVString);
    const filteredDataChanged = useAppSelector(getFilteredDataChanged);
    const dataFrequency = useAppSelector(getFrequency);
    const [selectedColumns, setSelectedColumns] = useState<string[]>(filteredColumns);
    const columns = useAppSelector(getRawDataColumns);

    useEffect(() => {
        if (filteredDataCSVString == '') {
            updateRawData();
        }
        columns.map(col => { drawBoxPlot(col) });
        return () => {
        };
    }, []);

    const drawBoxPlot = (column: string) => {
        const width = 150;
        const height = 165;
        const container = d3.select(`#boxplot-container-${column.replace('\r', '')}`);
        container.selectAll("*").remove(); // Clear previous content
        const svg = container.append("svg")
            .attr("width", width)
            .attr("height", height);

        const quartiles = getQuartiles(rawData.map(row => row[column]));
        const median = quartiles[1];
        const columnData = rawData.map(row => row[column])
            .filter((value): value is string => value !== null && !isNaN(Number(value)))
            .map(value => Number(value));
        const margin = { top: 10, right: 10, bottom: 10, left: 40 };

        const x = d3.scaleBand()
            .domain([column])
            .range([margin.left, width - margin.right])
            .padding(0.2);

        const y = d3.scaleLinear()
            .domain([d3.min(columnData) as number, d3.max(columnData) as number])
            .nice()
            .range([height - margin.bottom, margin.top]);

        const g = svg.append("g") // Create a group element, which will contain all the box plot elements
            .attr("transform", `translate(0,0)`); // Move the group relative to the SVG element

        // Box plot elements
        g.append("line") // whisker
            .attr("x1", x(column) as number + x.bandwidth() / 2)
            .attr("x2", x(column) as number + x.bandwidth() / 2)
            .attr("y1", y(d3.min(columnData) as number))
            .attr("y2", y(d3.max(columnData) as number))
            .attr("stroke", "#7eb0d5");

        g.append("rect") //box
            .attr("x", x(column) as number)
            .attr("y", y(quartiles[2]))
            .attr("width", x.bandwidth())
            .attr("height", y(quartiles[0]) - y(quartiles[2]))
            .attr("fill", "teal")
            .attr("stroke", "white");

        g.append("line") // median
            .attr("x1", x(column) as number)
            .attr("x2", x(column) as number + x.bandwidth())
            .attr("y1", y(median))
            .attr("y2", y(median))
            .attr("stroke", "yellow");

        g.append("line") //bottom whisker
            .attr("x1", x(column) as number)
            .attr("x2", x(column) as number + x.bandwidth())
            .attr("y1", y(d3.min(columnData) as number))
            .attr("y2", y(d3.min(columnData) as number))
            .attr("stroke", "#7eb0d5");

        g.append("line") //top whisker
            .attr("x1", x(column) as number)
            .attr("x2", x(column) as number + x.bandwidth())
            .attr("y1", y(d3.max(columnData) as number))
            .attr("y2", y(d3.max(columnData) as number))
            .attr("stroke", "#7eb0d5");

        svg.append("g") // Add y-axis instances
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(5))
            .attr("stroke", "white")
            .selectAll("path")
            .attr("stroke", "black");

    };

    const handleColumnChange = (column: string) => {
        setSelectedColumns(prevSelectedColumns =>
            prevSelectedColumns.includes(column)
                ? prevSelectedColumns.filter(col => col !== column)
                : [...prevSelectedColumns, column]
        );
    };

    // Update filtered data if column selection changes
    useEffect(() => {
        if (selectedColumns !== columns) {
            updateRawData();
        }

    }, [selectedColumns]);

    function updateRawData() {
        if (rawData.length > 0) {
            const filteredData = rawData.map(row =>
                Object.fromEntries(Object.entries(row).filter(([key]) => selectedColumns.includes(key)))
            );
            dispatch(setFilteredData(filteredData));
        }
    }

    // Update the csv loader block with the filtered data
    useEffect(() => {
        if (filteredDataChanged && blockId) {
            dispatch(setFilteredDataChanged(false));
            updateCSVLoaderBlock({
                blockId: blockId,
                frequency_hz: dataFrequency,
                csvString: filteredDataCSVString,
                header: true
            }).then(r => {
                dispatch(fetchFullBlock(blockId));
            });
        }
    }, [filteredDataCSVString, blockId]);

    // Update filtered data if column selection changes
    useEffect(() => {
        if (selectedColumns !== columns) {
            updateRawData();
        }

    }, [selectedColumns]);

    return (
        <StyledTableContainer>
            <StyledCSVTable $small={false} $mini={false} $border={false}>
                <thead>
                    {<tr>
                        {columns.map(col => (
                            <StyledTableHeader key={"header_" + col} $isSelected={selectedColumns.includes(col)} $textAlign={'center'} $border={false}
                                onMouseEnter={() => setHoveredColumn(col)}
                            >
                                <StyledCheckbox
                                    type="checkbox"
                                    checked={selectedColumns.includes(col)}
                                    onChange={() => handleColumnChange(col)}
                                />
                                {col}
                            </StyledTableHeader>
                        ))}
                    </tr>}
                </thead>
                <tbody>
                    <tr>
                        {columns.map(col => (
                            <StyledTableCell key={"cell_" + col} $isSelected={selectedColumns.includes(col)} $border={false}
                                onMouseEnter={() => setHoveredColumn(col)}
                            >
                                <div id={`boxplot-container-${col.replace('\r', '')}`}></div>
                            </StyledTableCell>))
                        }
                    </tr>
                </tbody>
            </StyledCSVTable>
        </StyledTableContainer>
    );
}