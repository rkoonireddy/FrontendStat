import styled from "styled-components";
import {StyledControl} from "../sections/ControlSection";
import {useState} from "react";
import {PrimaryButton} from "../buttons/PrimaryButton";
import {ControlTitle} from "./ControlTitle";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {getActiveBlock, updateControl} from "../../redux/pipelineSlice";
import {ControlsChangedPopup} from "../pageElements/ControlsChangedPopup";

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

export const StyledControlError = styled.div`
    font-size: 0.75rem;
    color: #ff0000;
    text-align: center;
`;

export function InputControl({title, initialValue, columnSpan = 1, rowSpan = 1, validate, invalidMessage}:
                                 {
                                     title: string,
                                     initialValue: string,
                                     columnSpan?: number,
                                     rowSpan?: number,
                                     validate: (value: string|undefined) => boolean,
                                     invalidMessage?: string
                                 }) {
    const activeBlock = useAppSelector(getActiveBlock);
    const dispatch = useAppDispatch();
    const [value, setValue] = useState<string|undefined>(initialValue);
    const [isValid, setIsValid] = useState<boolean>(validate(initialValue));
    const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);

    function handleChange(newValue: string) {
        // trim whitespaces
        newValue = newValue.trim();

        // Convert to string or undefined
        let newValueOptional = newValue === "" ? undefined : newValue;

        // Set isValid and value
        setIsValid(validate(newValueOptional));
        setValue(newValueOptional);
    }

    function handleConfirm() {
        if (activeBlock) {
            const valueToDispatch = typeof value === undefined ? undefined : Number(value);
            dispatch(updateControl({blockId: activeBlock.id, filter: {key: title, value: valueToDispatch}}));
        }
        setIsPopupVisible(true);
    }

    return (
        <StyledControl $columnSpan={columnSpan} $rowSpan={rowSpan}>
            <ControlTitle title={title} margin={'0'}/>
            <StyledInputContainer>
                <StyledInput id={`input-${title.toLowerCase()}`}
                             value={value ?? ""}
                             onChange={(e) => handleChange(e.target.value)}/>
            </StyledInputContainer>
            {isValid ? <PrimaryButton text={"Confirm"} action={handleConfirm} size={130}/> :
                <StyledControlError>{invalidMessage}</StyledControlError>}
            {isPopupVisible && (
                <ControlsChangedPopup text={value ?? "<None>"} onCloseAction={() => {
                    setIsPopupVisible(false);
                }}/>
            )}
        </StyledControl>
    );
}