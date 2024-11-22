import {ReactComponent as InfoSVG} from "../../assets/info-circle-fill.svg"
import {ReactComponent as CloseSVG} from '../../assets/x.svg';
import {StyledControl} from "../sections/ControlSection";
import {ControlTitle} from "./ControlTitle";
import React, {useState} from "react";
import {StyledCloseInfoIcon, StyledInfoPopup, StyledNodeInfoIcon} from "../customReactFlow/CustomNode";

export function ControlContainer({displayName, description, children, columnSpan = 1, rowSpan = 1}: {
    displayName: string,
    description: string,
    children: any,
    columnSpan?: number,
    rowSpan?: number
}) {

    const [isInfoVisible, setIsInfoVisible] = useState(false);
    const togglePopup = () => {
        setIsInfoVisible(prev => !prev);
    };

    return (
        <StyledControl $columnSpan={columnSpan} $rowSpan={rowSpan}>
            <StyledNodeInfoIcon $scale={2}
                title={"More information"}
                onClick={(e) => {
                    e.stopPropagation();
                    togglePopup();
                }}
            >
                <InfoSVG/>
            </StyledNodeInfoIcon>
            <StyledInfoPopup $visible={isInfoVisible} $scale={2}>
                <StyledCloseInfoIcon $scale={2} onClick={(e) => {
                    e.stopPropagation();
                    setIsInfoVisible(false);
                }}>
                    <CloseSVG/>
                </StyledCloseInfoIcon>
                <p>{description}</p>
            </StyledInfoPopup>
            <ControlTitle title={displayName} />
            {children}
        </StyledControl>
    )
}