import React, {useState} from 'react';
import {Handle, Position} from '@xyflow/react';
import {CustomNodeProps} from "../../types/nodeTypes";
import {
    StyledNodeContainer,
    StyledNodeLabel,
    StyledNodeType,
    StyledInfoPopup,
    StyledCloseInfoIcon,
    StyledNodeInfoIcon,
    StyledTag,
    StyledNodeOutputContainer,
    StyledNodeOutputPopup
} from "./CustomNode"; 
import {useAppDispatch, useAppSelector} from "../../hooks";
import {ReactComponent as InfoSVG} from "../../assets/info-circle-fill.svg"
import { ReactComponent as CloseSVG } from '../../assets/x.svg';
import {getActiveBlockId, getBlockById, setActiveBlockId} from "../../redux/pipelineSlice";
import {LineChart} from "../charts/LineChart";
import styled from "styled-components";


export const StyledNodeOutputPopupStart = styled(StyledNodeOutputPopup)`
    left: -50px;
    width: fit-content;
    padding: 5px;
`;


const CustomStartNode = ({data}: CustomNodeProps) => {
    const [isInfoVisible, setIsInfoVisible] = useState(false);
    const dispatch = useAppDispatch();
    const activeNodeId = useAppSelector(getActiveBlockId);
    const block = useAppSelector(state => getBlockById(state, data.blockId));
    const [showOutputPopup, setShowOutputPopup] = useState(false);

    const toggleInfo = () => {
        setIsInfoVisible(prev => !prev);
    };
    

    return (
        <StyledNodeContainer $active={data.id === activeNodeId} onClick={() => dispatch(setActiveBlockId(data.id))}>
            <StyledNodeLabel $active={data.id === activeNodeId} $small={data.label.length > 14}>{data.label}</StyledNodeLabel>
            <StyledNodeType>{data.type}</StyledNodeType>
            <Handle type="source" position={Position.Bottom}/>
            <StyledNodeInfoIcon 
                title={"More information"} 
                onClick={(e) => {
                    e.stopPropagation();
                    // dispatch(setActiveBlockId(data.id));
                    toggleInfo();
                }}
            >
                <InfoSVG />
            </StyledNodeInfoIcon>
            <StyledInfoPopup $visible={isInfoVisible}>
                <StyledCloseInfoIcon onClick={(e) => {
                    e.stopPropagation();
                    setIsInfoVisible(false);
                }}>
                    <CloseSVG />
                </StyledCloseInfoIcon>
                <p>{data.description}</p>
            </StyledInfoPopup>
            <StyledTag>
                {data.tag}
            </StyledTag>
            
            { block &&
                <StyledNodeOutputContainer onMouseEnter={() => setShowOutputPopup(true)}
                                           onMouseLeave={() => setShowOutputPopup(false)}>
                    <LineChart block={block} small={true} mini={true} dataLoader={true}/>
                    {showOutputPopup &&
                        <StyledNodeOutputPopup>
                            <LineChart block={block} small={true} dataLoader={true}/>
                        </StyledNodeOutputPopup>}
                </StyledNodeOutputContainer>}

        </StyledNodeContainer>
    );
};

export default CustomStartNode;