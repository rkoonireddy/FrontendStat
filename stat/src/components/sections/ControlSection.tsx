import styled from "styled-components";


const StyledControlContainer = styled.div`
  display: flex;
  height: 50%;
`;

const StyledControl = styled.div`
  margin: 10px;
  width: 150px;
  height: 150px;
  background-color: #ffffff08;
  padding: 5px;
  border-radius: 15px;
`;

export function ControlSection() {
    return (
        <StyledControlContainer id={"control-section"}>
            <StyledControl>Control 1</StyledControl>
            <StyledControl>Control 2</StyledControl>
            <StyledControl>Control 3</StyledControl>
        </StyledControlContainer>
    )
}