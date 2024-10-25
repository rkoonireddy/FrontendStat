import { useState, useEffect } from "react";
import { StyledControl } from "../sections/ControlSection";
import { MultiSelect } from "primereact/multiselect";
import { ControlTitle } from "./ControlTitle";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {getActiveBlock, updateControl} from "../../redux/pipelineSlice";

export function MultiSelectControl({ title, options, placeHolder = "Select...", columnSpan = 1, rowSpan = 1, defaultValues = null}: {
    title: string,
    options: { label: string, value: string }[],
    placeHolder?: string,
    columnSpan?: number,
    rowSpan?: number,
    defaultValues?: string[] | null,
}) {
    const activeBlock = useAppSelector(getActiveBlock);
    const dispatch = useAppDispatch();
    const [selectedOptions, setSelectedOptions] = useState<string[]>(defaultValues || []);

    const width = 150 * columnSpan;

    useEffect(() => {
        // Set any default values if configured by the filter
        if (defaultValues) {
            setSelectedOptions(defaultValues);
        }
        // Only update the controls in the redux store if our block is the currently active block
        if(activeBlock) {
            dispatch(updateControl({blockId: activeBlock.id, filter: {key: title, value: selectedOptions}}));
        }
    }, [defaultValues]);

    function updateOptions(value: string[]) {
        // If our block is the active block, update the control in the redux store
        if(activeBlock) {
            dispatch(updateControl({blockId: activeBlock.id, filter: {key: title, value: value}}));
        }

        // set the currently selected values
        setSelectedOptions(value);
    }

    return (
        <StyledControl $columnSpan={columnSpan} $rowSpan={rowSpan}>
            <ControlTitle title={title} margin={'0'} />
            <MultiSelect id={"multiSelect"}
                         value={selectedOptions}
                         options={options}
                         placeholder={placeHolder}
                         style={{ width: width + "px" }}
                         onChange={(e) => updateOptions(e.value)} />

        </StyledControl>
    );
}