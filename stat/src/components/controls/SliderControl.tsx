import styled from "styled-components";
import {useState} from "react";
import {Slider} from "primereact/slider";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {getActiveBlock, updateControl} from "../../redux/pipelineSlice";
import {ControlContainer} from "./ControlContainer";

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


export function VerticalIntegerSliderControl({title, displayName, description, min, max, step, start, columnSpan = 1, rowSpan = 1}: {
    title: string,
    displayName: string,
    description: string,
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
        <ControlContainer displayName={displayName} description={description} columnSpan={columnSpan} rowSpan={rowSpan}>
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
        </ControlContainer>
    )
}