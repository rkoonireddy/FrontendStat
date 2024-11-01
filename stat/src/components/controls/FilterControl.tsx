import {useState} from "react";
import {InputSwitch} from "primereact/inputswitch";
import {StyledControl} from "../sections/ControlSection";
import {ControlTitle} from "./ControlTitle";
import {getActiveBlock, updateControl} from "../../redux/pipelineSlice";
import {useAppDispatch, useAppSelector} from "../../hooks";

export function FilterControl({title, displayName, onLabel, offLabel, value, columnSpan = 1, rowSpan = 1}: {
    title: string,
    displayName: string,
    onLabel: string,
    offLabel: string,
    value: boolean,
    columnSpan?: number,
    rowSpan?: number,
}) {
    const activeBlock = useAppSelector(getActiveBlock);
    const dispatch = useAppDispatch();
    const [filterValue, setFilterValue] = useState(value);
    const [label, setLabel] = useState(filterValue ? onLabel : offLabel);
    
    const toggle = (e: { value: boolean }) => {
        setFilterValue(e.value);  // Update the state with the new value
        updateLabel(e.value);  // Update the label
    };
    
    function updateLabel(e: boolean) {
        setLabel(e ? onLabel : offLabel);
        update(e);
    }

    function update(e: boolean) {
        if(activeBlock) {
            dispatch(
                updateControl({
                    blockId: activeBlock.id,
                    filter: {key: title, value: e}
                })
            );
        }
    }

    return (
        <StyledControl $columnSpan={columnSpan} $rowSpan={rowSpan}>
            <ControlTitle title={displayName} />
            <InputSwitch id={"input switch"}
                         checked={filterValue}
                         name={label}
                         onChange={toggle}/>
        </StyledControl>
    )
}