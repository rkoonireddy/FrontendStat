import {
    getData,
    getFilteredDataAsCSVString,
    getFilteredDataChanged,
    setFilteredData,
    setFilteredDataChanged
} from "../../redux/dataSlice";
import {useSelector, useDispatch} from "react-redux";
import styled from "styled-components";
import {useState, useEffect} from "react";
import {FilterControl} from "../controls/FilterControl";
import {InputSwitch} from "primereact/inputswitch";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {updateCSVLoaderBlock} from "../../service/blockService";
import {fetchFullBlock, getActiveBlockId} from "../../redux/pipelineSlice";
import {convertToCSV} from "../../util/util";

const StyledCSVTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  margin-top: 20px;
  border: 1px solid #ddd;
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

export default function CSVViewer() {
    const dispatch = useAppDispatch();
    const rawData = useAppSelector(getData);
    const filteredDataChanged = useAppSelector(getFilteredDataChanged);
    const filteredDataCSVString = useAppSelector(getFilteredDataAsCSVString)
    const activeBlockId = useAppSelector(getActiveBlockId);
    const data = rawData.slice(0, 20);
    const columns = data.length > 0 ? Object.keys(data[0]) : [];

    const [selectedColumns, setSelectedColumns] = useState<string[]>(columns);

    // Update the csv loader block with the initial data
    useEffect(() => {
        if (activeBlockId) {
            updateCSVLoaderBlock({
                blockId: activeBlockId,
                frequency_hz: 120,
                csvString: convertToCSV(rawData),
                header: true
            }).then(r => {
                dispatch(fetchFullBlock(activeBlockId));
            })
        }
    }, [])

    // Update the csv loader block with the filtered data
    useEffect(() => {
        if (filteredDataChanged && activeBlockId) {
            updateCSVLoaderBlock({
                blockId: activeBlockId,
                frequency_hz: 120,
                csvString: filteredDataCSVString,
                header: true
            }).then(r =>{
                dispatch(fetchFullBlock(activeBlockId));
                dispatch(setFilteredDataChanged(false));
            })
        }
    }, [filteredDataChanged]);

    // update filtered data if column selection changes
    useEffect(() => {
        const filteredData = rawData.map(row =>
            Object.fromEntries(Object.entries(row).filter(([key]) => selectedColumns.includes(key)))
        );
        dispatch(setFilteredData(filteredData));

    }, [selectedColumns, rawData, dispatch]);

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
                <StyledCSVTable>
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