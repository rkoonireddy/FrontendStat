import { getData, getRawDataColumns } from "../../redux/dataSlice";
import styled from "styled-components";
import { useAppSelector } from "../../hooks";
import { getFrequency } from "../../redux/pipelineSlice";
import { getMean, getMedian, getRange, formatNumber, getVariance, getStandardDeviation } from "../../util/util";
import { useEffect } from "react";

const StyledTableCell = styled.td`
    display: table-cell;
    border: 0 solid #00bfa6;
    border-radius: 5px;
    color: white;
    padding: 5px;
    background-color: #3D3D3D;
    font-size: 0.9rem;
`;

const StyledColumnHeader = styled.div`
    font-size: 1.5rem;
    width: 100%;
    color: #00bfa6;
    margin: 10px;
`;


export default function BoxPlot({ column }: { column: string | null }) {
    const rawData = useAppSelector(getData);
    const dataFrequency = useAppSelector(getFrequency);
    const rawDataColumns = useAppSelector(getRawDataColumns);
    const indexColumnName = rawDataColumns[0];
    const columnLength = rawData.map(row => row[column as string])
        .filter((value): value is string => value !== null && value != '' && value !== '\r').length;
    const indexLength = rawData.map(row => row[indexColumnName])
        .filter((value): value is string => value !== null).length;
    const mean = getMean(rawData.map(row => row[column as string]));
    const median = getMedian(rawData.map(row => row[column as string]));
    const range = getRange(rawData.map(row => row[column as string]));
    const variance = getVariance(rawData.map(row => row[column as string]));
    const stdev = getStandardDeviation(rawData.map(row => row[column as string]));



    useEffect(() => {
        //console.log("rawData", rawData);
    }, []);

    return (
        <>
            <StyledColumnHeader>{column}</StyledColumnHeader>
            <table>
                <thead>
                    <tr>
                        <StyledTableCell>Data Frequency:</StyledTableCell>
                        <StyledTableCell>{dataFrequency} Hz</StyledTableCell>
                    </tr>
                </thead>
                {column == null ?
                    <tbody>
                        <tr>
                            <td>hover over columns for descriptice statistics</td>
                        </tr>
                    </tbody>

                    :
                    <tbody>
                        <tr>
                            <StyledTableCell>Observations:</StyledTableCell>
                            <StyledTableCell>{columnLength}</StyledTableCell>
                        </tr>
                        <tr>
                            <StyledTableCell>Data Coverage</StyledTableCell>
                            <StyledTableCell>{String(parseFloat((columnLength / indexLength * 100).toFixed(3)) + "%")}</StyledTableCell>
                        </tr>
                        <tr>
                            <StyledTableCell>Mean</StyledTableCell>
                            <StyledTableCell>{formatNumber(mean)}</StyledTableCell>
                        </tr>
                        <tr>
                            <StyledTableCell>Median</StyledTableCell>
                            <StyledTableCell>{formatNumber(median)}</StyledTableCell>
                        </tr>
                        <tr>
                            <StyledTableCell>Range</StyledTableCell>
                            <StyledTableCell>{formatNumber(range)}</StyledTableCell>
                        </tr>
                        <tr>
                            <StyledTableCell>Variance</StyledTableCell>
                            <StyledTableCell>{formatNumber(variance)}</StyledTableCell>
                        </tr>
                        <tr>
                            <StyledTableCell>Std Dev</StyledTableCell>
                            <StyledTableCell>{formatNumber(stdev)}</StyledTableCell>
                        </tr>
                    </tbody>}
            </table>
        </>
    );
}
