import styled from "styled-components";
import {StyledControl} from "../sections/ControlSection";
import {useState} from "react";
import {PrimaryButton} from "../buttons/PrimaryButton";
import {ControlTitle} from "./ControlTitle";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {getActiveBlock, updateControl} from "../../redux/pipelineSlice";

const StyledInputContainer = styled.div`
  width: 100%;
  margin: auto;
  max-width: 150px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const StyledInput = styled.input<{ $largeText?: boolean, $width?: string, $margin?: string }>`
  border-radius: 5px;
  font-size: ${props => props.$largeText ? '1.5rem' : '1.25rem'};
  border: 1px solid #727272;
  background-color: #2B2B2B;
  color: #ffffff;
  ${props => props.$width ? `max-width: ${props.$width}` : 'max-width: 120px'};
  ${props => props.$margin ? `margin: ${props.$margin};` : ''}
`;

export const StyledUnit = styled.span`
  font-size: 1.25rem;
  color: #ffffff;
  margin-left: 5px;
`;


export function InputControl({title, dtype, columnSpan = 1, rowSpan = 1}: {
    title: string,
    dtype: string,
    columnSpan?: number,
    rowSpan?: number
}) {
    const activeBlock = useAppSelector(getActiveBlock);
    const dispatch = useAppDispatch();
    const [value, setValue] = useState("");


    function action() {
        if(activeBlock) {
            dispatch(updateControl({blockId: activeBlock.id, filter: {key: title, value: value}}));
        }
    }

    return (
        <StyledControl $columnSpan={columnSpan} $rowSpan={rowSpan}>
            <ControlTitle title={title} margin={'0'}/>
            <StyledInputContainer>
                <StyledInput id={"input text"}
                             value={value}
                             onChange={(e) => setValue(e.target.value)}/>
            </StyledInputContainer>
            <PrimaryButton text={"Confirm"} action={action} size={130}/>
        </StyledControl>
    )
}