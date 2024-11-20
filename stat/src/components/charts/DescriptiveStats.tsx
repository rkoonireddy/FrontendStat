import {
    getData,
    getFilteredDataAsCSVString,
    getFilteredDataChanged,
    setFilteredData,
    setFilteredDataChanged,
    getRawDataColumns,
    getFilteredDataColumns
} from "../../redux/dataSlice";
import styled from "styled-components";
import {useState, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {updateCSVLoaderBlock} from "../../service/blockService";
import {fetchFullBlock, getFrequency} from "../../redux/pipelineSlice";
import {getMean, getMedian, getRange, formatNumber, getVariance, getStandardDeviation} from "../../util/util";

const StyledTableContainer = styled.div`
    height: fit-content;
    width: fit-content;
    max-width: 95%;
    max-height: 95%;
`;

export const StyledTableHeader = styled.th<{ $isSelected: boolean }>`
    background-color: ${props => (props.$isSelected ? '#3D3D3D' : '#adacac')};
    color: ${props => (props.$isSelected ? '#00bfa6' : '#808080')};
    border: 1px solid #00bfa6;
    padding: 8px;
    text-align: left;
`;

export const StyledTableCell = styled.td<{ $isSelected: boolean, $mini?: boolean }>`
    border: 1px solid #00bfa6;
    color: ${props => (props.$isSelected ? '#ffffff' : '#808080')};
    padding: ${props => (props.$mini ? '2px' : '8px')};
    background-color: ${props => (props.$isSelected ? '#3D3D3D' : '#adacac')};
`;

export const StyledFilterContainer = styled.div`
    margin-bottom: 20px;
`;

export const StyledCheckbox = styled.input`
    margin-right: 10px;
    color: white;
`;

const StyledFrequency = styled.div`
    margin-top: 15px;
    text-align: right;
    font-size: 1.0rem;
    color: white;
`;

export default function DescriptiveStats({blockId, hoveredColumn}: { blockId: string; hoveredColumn: string | null }) {
    //const dispatch = useAppDispatch();
    const rawData = useAppSelector(getData);
    //const filteredDataChanged = useAppSelector(getFilteredDataChanged);
    const dataFrequency = useAppSelector(getFrequency);
    const columnLength = rawData.map(row => row[hoveredColumn as string]).filter((value): value is string => value !== null).length;
    const mean = getMean(rawData.map(row => row[hoveredColumn as string]));
    const median = getMedian(rawData.map(row => row[hoveredColumn as string]));
    const range = getRange(rawData.map(row => row[hoveredColumn as string]));
    const variance = getVariance(rawData.map(row => row[hoveredColumn as string]));
    const stdev = getStandardDeviation(rawData.map(row => row[hoveredColumn as string]));

    return (
        <StyledTableContainer>
            <StyledFrequency>Data Frequency: {dataFrequency} Hz</StyledFrequency>
            <StyledFrequency>Column: {hoveredColumn} has {columnLength} observations</StyledFrequency>
            <StyledFrequency>Mean: {formatNumber(mean)}</StyledFrequency>
            <StyledFrequency>Median: {formatNumber(median)}</StyledFrequency>
            <StyledFrequency>Range: {formatNumber(range)}</StyledFrequency>
            <StyledFrequency>Variance: {formatNumber(variance)}</StyledFrequency>
            <StyledFrequency>Standard Deviation: {formatNumber(stdev)}</StyledFrequency>
        </StyledTableContainer>
    );
}
