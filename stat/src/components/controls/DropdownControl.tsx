import {useState} from "react";
import {Dropdown} from "primereact/dropdown";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {getActiveBlock, updateControl} from "../../redux/pipelineSlice";
import {ControlContainer} from "./ControlContainer";


export function DropdownControl({
                                    title,
                                    displayName,
                                    description,
                                    options,
                                    placeHolder = "Select...",
                                    columnSpan = 1,
                                    rowSpan = 1,
                                    defaultValue = null
                                }: {
    title: string,
    displayName: string,
    description: string,
    options: { label: string, value: string }[],
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
        if (activeBlock) {
            dispatch(updateControl({blockId: activeBlock.id, filter: {key: title, value: value}}));
        }
        setSelectedOption(value);
    }

    return (
        <ControlContainer displayName={displayName} description={description} columnSpan={columnSpan} rowSpan={rowSpan}>
                <Dropdown id={"dropdown"}
                          value={selectedOption}
                          options={options}
                          placeholder={placeHolder}
                          style={{width: width + "px"}}
                          onChange={(e) => updateOptions(e.value)}/>
        </ControlContainer>
    )
}