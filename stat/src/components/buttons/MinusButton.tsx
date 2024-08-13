import styled from 'styled-components';
import {ReactComponent as MinusSVG} from "../../assets/dash-square.svg";


const StyledMinusButton = styled.div`
  display: flex;

  & svg:hover {
    fill: #73B5B4;
    cursor: pointer;
  }
`;

type PlusButtonProps = {
    action: () => void;
};

export function MinusButton({ action }: PlusButtonProps) {
    return (

        <StyledMinusButton onClick={action}>
            <MinusSVG style={{width: "25px", height: "25px", color: "#ffffff"}}/>
        </StyledMinusButton>
    );
}