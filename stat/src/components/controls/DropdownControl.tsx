import {useState} from "react";
import {StyledControl} from "../sections/ControlSection";
import {Dropdown} from "primereact/dropdown";
import {ControlTitle} from "./ControlTitle";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {getActiveBlock, updateControl} from "../../redux/pipelineSlice";


export function DropdownControl({title, options, placeHolder = "Select...", columnSpan = 1, rowSpan = 1, defaultValue = null}: {
    title: string,
    options: {label: string, value: string}[],
    placeHolder?: string,
    columnSpan?: number,
    rowSpan?: number,
    defaultValue?: string | null
}) {
    const activeBlock = useAppSelector(getActiveBlock);
    const dispatch = useAppDispatch();
    const [selectedOption, setSelectedOption] = useState<string | null>(defaultValue);

    const width = 150 * columnSpan;

    function updateOptions(value: string) {
        if(activeBlock) {
            dispatch(updateControl({blockId: activeBlock.id, filter: {key: title, value: value}}));
        }
        setSelectedOption(value);
    }

    return (
        <StyledControl $columnSpan={columnSpan} $rowSpan={rowSpan}>
            <ControlTitle title={title} margin={'0'}/>
            <Dropdown id={"dropdown"}
                      value={selectedOption}
                      options={options}
                      placeholder={placeHolder}
                      style={{width: width + "px"}}
                      onChange={(e) => updateOptions(e.value)}/>
        </StyledControl>
    )
}