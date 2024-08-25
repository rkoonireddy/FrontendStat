import {useState} from "react";
import {StyledControl, StyledControlTitle} from "../sections/ControlSection";
import {Dropdown} from "primereact/dropdown";


export function DropdownControl({title, options, placeHolder = "Select...", columnSpan = 1, rowSpan = 1}: {
    title: string,
    options: {label: string, value: string}[],
    placeHolder?: string,
    columnSpan?: number,
    rowSpan?: number
}) {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const width = 150 * columnSpan;

    return (
        <StyledControl $columnSpan={columnSpan} $rowSpan={rowSpan}>
            <StyledControlTitle margin={'0'}>{title}</StyledControlTitle>
            <Dropdown id={"dropdown"}
                      value={selectedOption}
                      options={options}
                      placeholder={placeHolder}
                      style={{width: width + "px"}}
                      onChange={(e) => setSelectedOption(e.value)}/>
        </StyledControl>
    )
}