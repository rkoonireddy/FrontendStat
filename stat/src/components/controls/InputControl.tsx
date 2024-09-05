import styled from "styled-components";
import {StyledControl, StyledControlTitle} from "../sections/ControlSection";
import {useState} from "react";
import {PrimaryButton} from "../buttons/PrimaryButton";

const StyledInputContainer = styled.div`
  width: 100%;
  margin: auto;
  max-width: 150px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const StyledInput = styled.input<{ $largeText?: boolean, $width?: string, $margin?: string}>`
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


export function InputControl({title, unit, columnSpan = 1, rowSpan = 1}: {
    title: string,
    unit: string,
    columnSpan?: number,
    rowSpan?: number
}) {
    const [value, setValue] = useState("");

    function action() {
        console.log(value);
    }

    return (
        <StyledControl $columnSpan={columnSpan} $rowSpan={rowSpan}>
            <StyledControlTitle margin={'0'}>{title}</StyledControlTitle>
            <StyledInputContainer>
            <StyledInput id={"input text"}
                         value={value}
                         onChange={(e) => setValue(e.target.value)}/>
            <StyledUnit>{unit}</StyledUnit>
            </StyledInputContainer>
            <PrimaryButton text={"Confirm"} action={action} size={130}/>
        </StyledControl>
    )
}