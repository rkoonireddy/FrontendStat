import styled from "styled-components";
import {useState} from "react";
import {Slider} from "primereact/slider";
import {StyledControl} from "../sections/ControlSection";
import {ControlTitle} from "./ControlTitle";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {getActiveBlock, updateControl} from "../../redux/pipelineSlice";

const StyledRangeContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: auto;
`;


const StyledRangeValue = styled.div<{$left: boolean}>`
  position: absolute;
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  color: #ffffff;
  left: ${props => props.$left? '10px' : ''};
  right: ${props => !props.$left? '10px' : ''};
  bottom: -50px;
`;


export function RangeControl({title, range, initial_range, step, columnSpan = 2, rowSpan = 1}: {
    title: string,
    range: [number, number],
    step: number,
    initial_range: [number, number],
    columnSpan?: number,
    rowSpan?: number
}) {
    const activeBlock = useAppSelector(getActiveBlock);
    const dispatch = useAppDispatch();
    const [value, setValue] = useState<[number, number]>(initial_range);
    const width = 175 * columnSpan;

    function updateRange(minMaxValue: [number, number]) {
        // make sure the order is lower, higher
        if(minMaxValue[0] > minMaxValue[1]) {
            minMaxValue = [minMaxValue[1], minMaxValue[0]];
        }
        
        if(activeBlock) {
            dispatch(updateControl({blockId: activeBlock.id, filter: {key: title, value: minMaxValue}}));
        }
        setValue(minMaxValue);
    }

    return (
        <StyledControl $columnSpan={columnSpan} $rowSpan={rowSpan}>
            <ControlTitle title={title} margin={'0'}/>
            <StyledRangeContainer>
                <StyledRangeValue $left={true}>{value[0]}</StyledRangeValue>
                <Slider value={value}
                        range
                        min={range[0]}
                        max={range[1]}
                        step={step}
                        orientation={"horizontal"}
                        style={{width: width + "px", margin: "auto 10px"}}
                        onChange={(e) => updateRange(e.value as [number, number])}
                />
                <StyledRangeValue $left={false}>{value[1]}</StyledRangeValue>
            </StyledRangeContainer>
        </StyledControl>
    )
}