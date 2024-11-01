import styled from "styled-components";
import {StyledControl} from "../sections/ControlSection";
import {useState} from "react";
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

export const StyledInput = styled.input<{ $largeText?: boolean, $width?: string, $margin?: string, $valid?: boolean }>`
    border-radius: 5px;
    font-size: ${props => props.$largeText ? '1.5rem' : '1.25rem'};
    border: 2px solid ${props => props.$valid === undefined ? '#727272' : (props.$valid ? '#039203' : '#ff0000')};
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

export const StyledControlError = styled.div`
    position: absolute;
    font-size: 0.75rem;
    color: #ff0000;
    text-align: center;
    bottom: 5px;
    left: 0;
    right: 0;
    margin: auto;
`;

export function InputControl(
    {
        title,
        displayName,
        initialValue,
        columnSpan = 1,
        rowSpan = 1,
        validate,
        convert,
        invalidMessage,
        onChange
    }:
    {
        title: string,
        displayName: string,
        initialValue: string,
        columnSpan?: number,
        rowSpan?: number,
        validate: (value: string|undefined) => boolean,
        convert: (value: string) => string|number,
        invalidMessage?: string,
        onChange: (v: boolean) => void
    }) {
    const activeBlock = useAppSelector(getActiveBlock);
    const dispatch = useAppDispatch();
    const [value, setValue] = useState<string|undefined>(initialValue);
    const [isValid, setIsValid] = useState<boolean>(validate(initialValue));

    function handleChange(newValue: string) {
        // trim whitespaces
        newValue = newValue.trim();

        // Convert to string or undefined
        let newValueOptional = newValue === "" ? undefined : newValue;

        // Set isValid and value
        setIsValid(validate(newValueOptional));
        onChange(validate(newValueOptional)); // Notify parent element if value is not valid
        setValue(newValueOptional);

        // Directly handle the confirm by relying it, but dont use the state (due to async nature of state)
        handleConfirm(newValueOptional);
    }

    function handleConfirm(valueToSet: string|undefined) {
        if (activeBlock) {
            if (validate(valueToSet)) {
                let valueToDispatch = valueToSet === undefined ? undefined : convert(valueToSet as string);
                dispatch(updateControl({blockId: activeBlock.id, filter: {key: title, value: valueToDispatch}}));
            }
        }
    }

    return (
        <StyledControl $columnSpan={columnSpan} $rowSpan={rowSpan}>
            <ControlTitle title={displayName} margin={'0'}/>
            <StyledInputContainer>
                <StyledInput id={`input-${title.toLowerCase()}`}
                             value={value ?? ""}
                             onChange={(e) => handleChange(e.target.value)}
                $margin={'auto'}
                $valid={isValid}/>
            </StyledInputContainer>
            {!isValid && <StyledControlError>{invalidMessage}</StyledControlError>}
        </StyledControl>
    );
}