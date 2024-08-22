import {getData} from "../../redux/dataSlice";
import {useSelector} from "react-redux";
import styled from "styled-components";

const StyledCSVTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  margin-top: 20px;
  border: 1px solid #ddd;
`;

const StyledTableHeader = styled.th`
  background-color: #f2f2f2;
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
`;

const StyledTableCell = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;


export default function CSVViewer() {
    const rawData = useSelector(getData);

    const data = rawData.slice(0, 20);


    if (data.length === 0) {
        return <div>No data available</div>;
    }

    const columns = Object.keys(data[0]);

    return (
        <StyledCSVTable>
            <thead>
            <tr>
                {columns.map((col) => (
                    <StyledTableHeader key={col}>{col}</StyledTableHeader>
                ))}
            </tr>
            </thead>
            <tbody>
            {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                    {columns.map((col) => (
                        <StyledTableCell key={col}>{row[col]}</StyledTableCell>
                    ))}
                </tr>
            ))}
            </tbody>
        </StyledCSVTable>
    );
}