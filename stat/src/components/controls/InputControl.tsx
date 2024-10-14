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


// String input is always valid, no validation needed
export function InputControlString({title, initialValue, columnSpan = 1, rowSpan = 1}: {
    title: string,
    initialValue: string,
    columnSpan?: number,
    rowSpan?: number
}) {
    const activeBlock = useAppSelector(getActiveBlock);
    const dispatch = useAppDispatch();
    const [value, setValue] = useState(initialValue);
    
    function handleChange() {
        console.log(value);
        if(activeBlock) {
            dispatch(updateControl({blockId: activeBlock.id, filter: {key: title, value: value}}));
        }
    }

    return (
        <StyledControl $columnSpan={columnSpan} $rowSpan={rowSpan}>
            <ControlTitle title={title} margin={'0'}/>
            <StyledInputContainer>
                <StyledInput id={"input string"}
                             value={value}
                             onChange={(e) => setValue(e.target.value)}/>
            </StyledInputContainer>
            <PrimaryButton text={"Confirm"} action={handleChange} size={130}/>
        </StyledControl>
    )
}

export function InputControlInt({title, initialValue, columnSpan = 1, rowSpan = 1}: {
    title: string,
    initialValue: string,
    columnSpan?: number,
    rowSpan?: number
}) {
    const activeBlock = useAppSelector(getActiveBlock);
    const dispatch = useAppDispatch();
    const [value, setValue] = useState<string>(initialValue);
    const [isValid, setIsValid] = useState<boolean>(validate(value));
    
    function validate(v: string): boolean {
        return Number.isInteger(Number(v));
    }

    function handleChange(newValue: string) {
        // Change the value anyways
        setValue(newValue)

        // Catch empty, converted to 0
        if (newValue.trim() === "") {
            setIsValid(false);
            return;
        }
        setIsValid(validate(newValue));
    }

    function handleConfirm() {
        if(activeBlock) {
            const valueInt = Number(value); // make sure an number is passed to redux
            dispatch(updateControl({blockId: activeBlock.id, filter: {key: title, value: valueInt}}));
        }
    }

    return (
        <StyledControl $columnSpan={columnSpan} $rowSpan={rowSpan}>
            <ControlTitle title={title} margin={'0'}/>
            <StyledInputContainer>
                <StyledInput id={"input int"}
                             value={value}
                             onChange={(e) => handleChange(e.target.value)}/>
            </StyledInputContainer>
            {isValid ? <PrimaryButton text={"Confirm"} action={handleConfirm} size={130}/> : <ControlTitle title="Enter integer"/>}
        </StyledControl>
    )
}

export function InputControlFloat({title, initialValue, columnSpan = 1, rowSpan = 1}: {
    title: string,
    initialValue: string,
    columnSpan?: number,
    rowSpan?: number
}) {
    const activeBlock = useAppSelector(getActiveBlock);
    const dispatch = useAppDispatch();
    const [value, setValue] = useState<string>(initialValue);
    const [isValid, setIsValid] = useState<boolean>(validate(value));
    
    function validate(v: string): boolean {
        return !isNaN(Number(v));
    }

    function handleChange(newValue: string) {
        // Change the value anyways
        setValue(newValue)

        // Catch empty, converted to 0
        if (newValue.trim() === "") {
            setIsValid(false);
            return;
        }
        setIsValid(validate(newValue));
    }

    function handleConfirm() {
        if(activeBlock) {
            const valueInt = Number(value); // make sure an number is passed to redux
            dispatch(updateControl({blockId: activeBlock.id, filter: {key: title, value: valueInt}}));
        }
    }

    return (
        <StyledControl $columnSpan={columnSpan} $rowSpan={rowSpan}>
            <ControlTitle title={title} margin={'0'}/>
            <StyledInputContainer>
                <StyledInput id={"input float"}
                             value={value}
                             onChange={(e) => handleChange(e.target.value)}/>
            </StyledInputContainer>
            {isValid ? <PrimaryButton text={"Confirm"} action={handleConfirm} size={130}/> : <ControlTitle title="Enter float"/>}
        </StyledControl>
    )
}