import {getData} from "../../redux/dataSlice";
import styled from "styled-components";
import {useAppSelector} from "../../hooks";
import {getFrequency} from "../../redux/pipelineSlice";
import {getMean, getMedian, getRange, formatNumber, getVariance, getStandardDeviation} from "../../util/util";

const StyledTableContainer = styled.div`
    height: fit-content;
    width: fit-content;
    max-width: 95%;
    max-height: 95%;
`;

const StyledFrequency = styled.div`
    margin-top: 15px;
    text-align: right;
    font-size: 1.0rem;
    color: white;
`;

export default function BoxPlot({column}: {column: string | null }) {
    //const dispatch = useAppDispatch();
    const rawData = useAppSelector(getData);
    const dataFrequency = useAppSelector(getFrequency);
    const columnLength = rawData.map(row => row[column as string]).filter((value): value is string => value !== null).length;
    const mean = getMean(rawData.map(row => row[column as string]));
    const median = getMedian(rawData.map(row => row[column as string]));
    const range = getRange(rawData.map(row => row[column as string]));
    const variance = getVariance(rawData.map(row => row[column as string]));
    const stdev = getStandardDeviation(rawData.map(row => row[column as string]));

    return (
        <StyledTableContainer>
            <StyledFrequency>Data Frequency: {dataFrequency} Hz</StyledFrequency>
            <StyledFrequency>Column: {column} has {columnLength} observations</StyledFrequency>
            <StyledFrequency>Mean: {formatNumber(mean)}</StyledFrequency>
            <StyledFrequency>Median: {formatNumber(median)}</StyledFrequency>
            <StyledFrequency>Range: {formatNumber(range)}</StyledFrequency>
            <StyledFrequency>Variance: {formatNumber(variance)}</StyledFrequency>
            <StyledFrequency>Standard Deviation: {formatNumber(stdev)}</StyledFrequency>
        </StyledTableContainer>
    );
}
