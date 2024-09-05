import styled from 'styled-components';

const StyledPrimaryButton = styled.button<{ size: number }>`
  color: white;
  //padding: 10px;
  border: 2px solid #73B5B4;
  border-radius: 5px;
  cursor: pointer;
  width: ${props => props.size}px;
  height: ${props => props.size / 4}px;
  background: none;
  font-size: ${props => Math.max((props.size / 200), 1)}rem;
  font-family: 'Gaoel', sans-serif;
  margin: 0 auto;

  &:hover {
    background-color: #73B5B4;
    border: 2px solid white;
  }

  &:disabled {
    background-color: rgba(147, 147, 147, 0.75);
    border: 2px solid white;
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export function PrimaryButton({text, action, size = 200, disabled = false}: {
    text: string,
    action: () => void,
    size?: number,
    disabled?: boolean
}) {
    return (
        <StyledPrimaryButton size={size} onClick={() => action()} disabled={disabled}>
            {text}
        </StyledPrimaryButton>
    )
}