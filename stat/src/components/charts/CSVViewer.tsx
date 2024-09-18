import {
    getData,
    getFilteredDataAsCSVString,
    getFilteredDataChanged,
    setFilteredData,
    setFilteredDataChanged
} from "../../redux/dataSlice";
import styled from "styled-components";
import {useState, useEffect, useRef} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {updateCSVLoaderBlock} from "../../service/blockService";
import {fetchFullBlock} from "../../redux/pipelineSlice";

const StyledCSVTable = styled.table<{ $small?: boolean }>`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  margin-top: 20px;
  border: 1px solid #ddd;
  font-size: ${props => props.$small ? '0.6rem' : '1rem'};
  max-height: 100%;
`;

const StyledTableHeader = styled.th<{ $isSelected: boolean }>`
  background-color: ${props => props.$isSelected ? '#3D3D3D' : '#adacac'};
  color: ${props => props.$isSelected ? '#00bfa6' : '#808080'};
  border: 1px solid #00bfa6;
  padding: 8px;
  text-align: left;
`;

const StyledTableCell = styled.td<{ $isSelected: boolean }>`
  border: 1px solid #00bfa6;
  color: ${props => props.$isSelected ? '#ffffff' : '#808080'};
  padding: 8px;
  background-color: ${props => props.$isSelected ? '#3D3D3D' : '#adacac'};
`;

const StyledFilterContainer = styled.div`
  margin-bottom: 20px;
`;

const StyledCheckbox = styled.input`
  margin-right: 10px;
  color: white
`;

export default function CSVViewer({blockId, small}: { blockId: string, small?: boolean }) {
    const dispatch = useAppDispatch();
    const rawData = useAppSelector(getData);
    const filteredDataChanged = useAppSelector(getFilteredDataChanged);
    const filteredDataCSVString = useAppSelector(getFilteredDataAsCSVString)
    // const activeBlockId = useAppSelector(getActiveBlockId);
    const data = rawData.slice(0, 20);
    const columns = data.length > 0 ? Object.keys(data[0]) : [];

    const [selectedColumns, setSelectedColumns] = useState<string[]>(columns);

    // Update the csv loader block with the filtered data
    useEffect(() => {
        if (filteredDataChanged && blockId) {
            dispatch(setFilteredDataChanged(false));
            updateCSVLoaderBlock({
                blockId: blockId,
                frequency_hz: 120,
                csvString: filteredDataCSVString,
                header: true
            }).then(r => {
                dispatch(fetchFullBlock(blockId));
            });
        }
    }, [filteredDataChanged, blockId, filteredDataCSVString]);

    // update filtered data if column selection changes
    useEffect(() => {
        if (rawData.length > 0) {
            const filteredData = rawData.map(row =>
                Object.fromEntries(Object.entries(row).filter(([key]) => selectedColumns.includes(key)))
            );
            dispatch(setFilteredData(filteredData));
        }

    }, [selectedColumns, rawData]);

    const handleColumnChange = (column: string) => {
        setSelectedColumns(prevSelectedColumns =>
            prevSelectedColumns.includes(column)
                ? prevSelectedColumns.filter(col => col !== column)
                : [...prevSelectedColumns, column]
        );
    };

    return (
        <div>
            {data.length === 0 ? (
                <div>No data available</div>
            ) : (
                <StyledCSVTable $small={small}>
                    <thead>
                    <tr>
                        {columns.map(col => (
                            <StyledTableHeader key={col} $isSelected={selectedColumns.includes(col)}>
                                <StyledCheckbox
                                    type="checkbox"
                                    checked={selectedColumns.includes(col)}
                                    onChange={() => handleColumnChange(col)}
                                />
                                {col}
                            </StyledTableHeader>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map(col => (
                                <StyledTableCell key={col} $isSelected={selectedColumns.includes(col)}>
                                    {row[col]}
                                </StyledTableCell>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </StyledCSVTable>
            )}
        </div>
    );
}