import styled from "styled-components";

const StyledToggleButton = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px auto;
    width: 200px;
    cursor: pointer;
    border: 1px solid #73b5b4;
    border-radius: 15px;
`;

const StyledToggleOption = styled.div<{ $isSelected: boolean }>`
    flex: 1;
    text-align: center;
    padding: 4px 10px;
    color: ${(props) => (props.$isSelected ? "#73B5B4" : "#ffffff")};
    background: ${props => props.$isSelected ? '#eeede9' : 'linear-gradient(to bottom right, #3D3D3D 0%, #000000 100%)'};
    font-weight: ${(props) => (props.$isSelected ? "bold" : "normal")};
    transition: background-color 0.3s, color 0.3s;
    border-radius: 15px;

    &:hover {
        background-color: ${(props) => (props.$isSelected ? "#d0d0d0" : '#73b5b4')};
    }
`;

export function ToggleButton({option1, option2, selection, onSelect}: {
    option1: string,
    option2: string,
    selection: boolean,
    onSelect: (option: boolean) => void
}) {

    return (
        <StyledToggleButton>
            <StyledToggleOption
                $isSelected={!selection}
                onClick={() => onSelect(false)}
            >
                {option1}
            </StyledToggleOption>
            <StyledToggleOption
                $isSelected={selection}
                onClick={() => onSelect(true)}
            >
                {option2}
            </StyledToggleOption>
        </StyledToggleButton>
    )
}