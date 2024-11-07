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
import {formatNumber} from "../../util/util";

const StyledTableContainer = styled.div`
    height: fit-content;
    width: fit-content;
    max-width: 100%;
    max-height: 100%;
`;

const StyledCSVTable = styled.table<{ $small?: boolean, $mini?: boolean }>`
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    margin-top: ${props => (props.$small ? '0' : '10px')};
    border: 1px solid #ddd;
    font-size: ${props => (!props.$small ? '1rem' : (props.$mini ? '0.4rem': '0.6rem'))};
    max-height: 100%;
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
    margin-top: 5px;
    text-align: left;
    font-size: 0.85rem;
    color: white;
`;

export default function CSVViewer({blockId, small, mini, sample = 20}: { blockId: string; small?: boolean, mini?: boolean, sample?: number }) {
    const dispatch = useAppDispatch();
    const rawData = useAppSelector(getData);
    const filteredDataChanged = useAppSelector(getFilteredDataChanged);
    const filteredDataCSVString = useAppSelector(getFilteredDataAsCSVString);
    const dataFrequency = useAppSelector(getFrequency);
    const data = rawData.slice(0, sample);
    const columns = useAppSelector(getRawDataColumns);
    const filteredColumns = useAppSelector(getFilteredDataColumns);

    const [selectedColumns, setSelectedColumns] = useState<string[]>(filteredColumns);

    function updateRawData() {
        if (rawData.length > 0) {
            const filteredData = rawData.map(row =>
                Object.fromEntries(Object.entries(row).filter(([key]) => selectedColumns.includes(key)))
            );
            dispatch(setFilteredData(filteredData));
        }
    }

    // update raw data if empty
    useEffect(() => {
        if (filteredDataCSVString == '') {
            updateRawData();
        }
    }, []);

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

    const handleColumnChange = (column: string) => {
        setSelectedColumns(prevSelectedColumns =>
            prevSelectedColumns.includes(column)
                ? prevSelectedColumns.filter(col => col !== column)
                : [...prevSelectedColumns, column]
        );
    };

    return (
        <StyledTableContainer>
            {data.length === 0 ? (
                <div>No data available</div>
            ) : (
                <>
                    {!small && <StyledFrequency>Data Frequency: {dataFrequency} Hz</StyledFrequency>}
                    <StyledCSVTable $small={small} $mini={mini}>
                        <thead>
                        <tr>
                            {columns.map(col => (
                                <StyledTableHeader key={col} $isSelected={selectedColumns.includes(col)}>
                                    {!mini && !small && <StyledCheckbox
                                        type="checkbox"
                                        checked={selectedColumns.includes(col)}
                                        onChange={() => handleColumnChange(col)}
                                    />}
                                    {col}
                                </StyledTableHeader>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map(col => (
                                    <StyledTableCell key={col} $isSelected={selectedColumns.includes(col)} $mini={mini}>
                                        {formatNumber(row[col])} {/* Use the formatting function */}
                                    </StyledTableCell>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </StyledCSVTable>
                </>
            )}
        </StyledTableContainer>
    );
}
