import styled from "styled-components";
import {ReactNode} from "react";
import {ReactComponent as XSVG} from "../../../assets/x.svg";

const StyledPopup = styled.div<{ $large: boolean, $noPadding: boolean }>`
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: ${props => props.$large ? '1000px' : '800px'};
    height: ${props => props.$large ? '625px' : '500px'};
    background: linear-gradient(to bottom right, #3D3D3D 0%, #000000 100%);;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    margin: auto;
    z-index: 100;
    border-radius: 15px;
    box-shadow: 5px 5px 5px 0 rgba(147, 147, 147, 0.75);
    padding: ${props => props.$noPadding ? '0' : '20px'};
    border: 1px solid #ccc;
    & svg {
        fill: #ff0000;
        position: absolute;
        right: 10px;
        top: 10px;
        cursor: pointer;
        width: 30px;
        height: 30px;
    }
`;

const StyledTitle = styled.div`
    font-size: 2rem;
    color: white;
    margin: 5px auto;
    white-space: pre-line;
    text-align: center;
`;

export function Popup({children, title, onCloseAction, large = false, noPadding = false}: {
    children: ReactNode,
    title: string,
    onCloseAction: () => void,
    large?: boolean,
    noPadding?: boolean
}) {
    return (
        <StyledPopup $large={large} $noPadding={noPadding}>
            <XSVG onClick={onCloseAction}/>
            {!noPadding && <StyledTitle>{title}</StyledTitle> }
            {children}
        </StyledPopup>
    )
}