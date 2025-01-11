import styled from 'styled-components';
import {ReactComponent as PlusSVG} from "../../../assets/plus-square.svg";


const StyledPlusButton = styled.div`
  display: flex;

  & svg:hover {
    fill: #73B5B4;
    cursor: pointer;
  }
`;

type PlusButtonProps = {
    action: () => void;
};

export function PlusButton({ action }: PlusButtonProps) {
    return (

        <StyledPlusButton onClick={action}>
            <PlusSVG style={{width: "25px", height: "25px", color: "#ffffff"}}/>
        </StyledPlusButton>
    );
}