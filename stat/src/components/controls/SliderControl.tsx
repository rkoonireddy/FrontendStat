import styled from "styled-components";
import {useState} from "react";
import {Slider} from "primereact/slider";
import {StyledControl} from "../sections/ControlSection";
import {ControlTitle} from "./ControlTitle";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {getActiveBlock, updateControl} from "../../redux/pipelineSlice";

const StyledSliderContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;


const StyledSliderValue = styled.div`
  position: absolute;
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  color: #ffffff;
  left: 10px;
`;


export function VerticalIntegerSliderControl({title, display_name, min, max, step, start, columnSpan = 1, rowSpan = 1}: {
    title: string,
    display_name: string,
    min: number,
    max: number,
    step: number,
    start: number,
    columnSpan?: number,
    rowSpan?: number,
}) {
    const activeBlock = useAppSelector(getActiveBlock);
    const dispatch = useAppDispatch();
    const [value, setValue] = useState<number|[number, number]>(start);
    const height = 70 * rowSpan;

    function handleChange(newValue: number|[number, number]) {
        if(activeBlock) {
            dispatch(updateControl({blockId: activeBlock.id, filter: {key: title, value: newValue}}));
        }
        setValue(newValue);
    }

    return (
        <StyledControl $columnSpan={columnSpan} $rowSpan={rowSpan}>
            <ControlTitle title={display_name} />
            <StyledSliderContainer>
                <StyledSliderValue>{value}</StyledSliderValue>
                <Slider min={min}
                        max={max}
                        step={step}
                        value={value}
                        orientation={"vertical"}
                        style={{height: height + "px", margin: "10px 0"}}
                        onChange={(e) => handleChange(e.value)}/>
            </StyledSliderContainer>
        </StyledControl>
    )
}