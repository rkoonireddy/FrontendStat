import styled from "styled-components";

const StyledLoadingContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background: #ffffff80;
  z-index: 100;
`;

export function Loading() {
    return (
        <StyledLoadingContainer>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </StyledLoadingContainer>
    )
}