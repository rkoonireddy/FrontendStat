import styled from 'styled-components';

const StyledPrimaryButton = styled.button`
  color: white;
  padding: 10px;
  border: 2px solid #73B5B4;
  border-radius: 5px;
  cursor: pointer;
  width: 200px;
  height: 50px;
  background: none;
  font-size: 1rem;
  font-family: 'Gaoel', sans-serif;
  margin: 0 auto;

  &:hover {
    background-color: #73B5B4;
    border: 2px solid white;
  }
`;

export function PrimaryButton({text, action}: { text: string, action: () => void }) {
    return (
        <StyledPrimaryButton onClick={() => action()}>
            {text}
        </StyledPrimaryButton>
    )
}