import {useState, useEffect} from "react";
import {MultiSelect} from "primereact/multiselect";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {getActiveBlock, updateControl} from "../../redux/pipelineSlice";
import {ControlContainer} from "./ControlContainer";

export function MultiSelectControl({
                                       title,
                                       displayName,
                                       description,
                                       options,
                                       placeHolder = "Select...",
                                       columnSpan = 1,
                                       rowSpan = 1,
                                       defaultValues = null
                                   }: {
    title: string,
    displayName: string,
    description: string,
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
        if (defaultValues) {
            setSelectedOptions(defaultValues);
        }

        if (activeBlock) {
            dispatch(updateControl({blockId: activeBlock.id, filter: {key: title, value: selectedOptions}}));
        }
    }, [defaultValues]);

    function updateOptions(value: string[]) {

        if (activeBlock) {
            dispatch(updateControl({blockId: activeBlock.id, filter: {key: title, value: value}}));
        }

        setSelectedOptions(value);
    }

    return (
        <ControlContainer displayName={displayName} description={description} columnSpan={columnSpan} rowSpan={rowSpan}>
            <MultiSelect id="multiSelect"
                         value={selectedOptions}
                         options={options.map(option => ({
                             ...option,
                             label: option.label.toUpperCase()
                         }))}
                         placeholder={placeHolder.toUpperCase()}
                         style={{width: width + "px", textTransform: 'uppercase'}}
                         onChange={(e) => updateOptions(e.value)}/>
        </ControlContainer>
    );
}