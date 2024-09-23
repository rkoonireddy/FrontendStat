import {
    getPreviewData
} from "../../redux/dataSlice";
import styled from "styled-components";
import {useState} from "react";
import { PrimaryButton } from "../buttons/PrimaryButton";
import {useAppSelector} from "../../hooks";

const StyledCSVTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  margin-top: 20px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  font-size: '1rem';
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

export function PreviewTable({onAccept} : {onAccept: (arg0: string[]) => void}) {

    const previewData = useAppSelector(getPreviewData);
    const headerData = previewData.slice(0,10);
    const columns = headerData.length > 0 ? Object.keys(headerData[0]) : [];
    const [selectedColumns, setSelectedColumns] = useState<string[]>(columns);

    const handleColumnChange = (column: string) => {
        setSelectedColumns(prevSelectedColumns =>
            prevSelectedColumns.includes(column)
                ? prevSelectedColumns.filter(col => col !== column)
                : [...prevSelectedColumns, column]
        );
    };

    const acceptClicked = () => {
        onAccept(selectedColumns);
    };

    return (
        <div>
            {headerData.length === 0 ? (
                <div>No data available</div>
            ) : (
                <div>
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
                        {headerData.map((row, rowIndex) => (
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
                    {selectedColumns.length > 0 ? <PrimaryButton text = "Upload" action = {acceptClicked}></PrimaryButton> : <p>Select at least one column</p>}
                </div>
            )   
            }
        </div>
    );
};
