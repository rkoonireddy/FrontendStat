import styled from "styled-components";
import { ReactComponent as LoadingSVG} from "../../assets/loading.svg";

const StyledLoadingContainer = styled.div`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    background: #ffffff20;
    z-index: 100;
    
    & svg {
        width: 500px;
        height: 500px;
    }
`;

export function Loading() {
    return (
        <StyledLoadingContainer>
            <LoadingSVG />
        </StyledLoadingContainer>
    )
}