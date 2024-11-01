import React, {useState} from 'react';
import {Handle, Position} from '@xyflow/react';
import {CustomNodeProps} from "../../types/nodeTypes";
import {
    StyledNodeContainer,
    StyledNodeLabel,
    StyledNodeType,
    StyledPopup,
    StyledCloseInfoIcon,
    StyledNodeInfoIcon,
    StyledTag,
    StyledNodeOutputContainer,
    StyledNodeOutputPopup} from "./CustomNode"; 
import {useAppDispatch, useAppSelector} from "../../hooks";
import {ReactComponent as InfoSVG} from "../../assets/info-circle-fill.svg"
import { ReactComponent as CloseSVG } from '../../assets/close-circle-svgrepo-com.svg';
import {getActiveBlockId, getBlockById, setActiveBlockId} from "../../redux/pipelineSlice";
import CSVViewer from "../charts/CSVViewer";
import styled from "styled-components";


export const StyledNodeOutputPopupStart = styled(StyledNodeOutputPopup)`
    left: -50px;
    width: fit-content;
    padding: 5px;
`;


const CustomStartNode = ({data}: CustomNodeProps) => {
    const [isPopupVisible, setPopupVisible] = useState(false);
    const dispatch = useAppDispatch();
    const activeNodeId = useAppSelector(getActiveBlockId);
    const block = useAppSelector(state => getBlockById(state, data.blockId));
    const [showOutputPopup, setShowOutputPopup] = useState(false);

    const togglePopup = () => {
        setPopupVisible(prev => !prev);
    };
    

    return (
        <StyledNodeContainer $active={data.id === activeNodeId} onClick={() => dispatch(setActiveBlockId(data.id))}>
            <StyledNodeLabel $active={data.id === activeNodeId} $small={data.label.length > 14}>{data.label}</StyledNodeLabel>
            <StyledNodeType>{data.type}</StyledNodeType>
            <Handle type="source" position={Position.Bottom}/>
            <StyledNodeInfoIcon 
                title={"More information"} 
                onClick={(e) => {
                    e.stopPropagation(); // Prevents closing due to parent clicks
                    dispatch(setActiveBlockId(data.id)); // Set active block ID
                    togglePopup(); // Toggle the popup visibility
                }}
            >
                <InfoSVG />
            </StyledNodeInfoIcon>
            <StyledPopup $visible={isPopupVisible}>
                <StyledCloseInfoIcon onClick={(e) => {
                    e.stopPropagation(); // Prevents closing due to parent clicks
                    setPopupVisible(false); // Close the popup
                }}>
                    <CloseSVG />
                </StyledCloseInfoIcon>
                <p>{data.description}</p> {/* Displaying the node description */}
            </StyledPopup>
            <StyledTag>
                {data.tag} {/* Displaying the node tag */}
            </StyledTag>
            <StyledNodeOutputContainer onMouseEnter={() => setShowOutputPopup(true)}
                                       onMouseLeave={() => setShowOutputPopup(false)}>
                {block &&
                    <>
                        CSV
                        {showOutputPopup &&
                            <StyledNodeOutputPopupStart>
                                <CSVViewer blockId={block.id} small={true} mini={true}/>
                            </StyledNodeOutputPopupStart>}
                    </>
                }
            </StyledNodeOutputContainer>
        </StyledNodeContainer>
    );
};

export default CustomStartNode;