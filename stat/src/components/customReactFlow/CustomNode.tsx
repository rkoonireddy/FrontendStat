import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {Handle, Position} from '@xyflow/react';
import {CustomNodeProps} from "../../types/nodeTypes";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {
    blockConnectedToPipeline,
    deleteBlockFromPipeline,
    getActiveBlockId, getBlockById, getBlocks,
    getPipelineModel,
    setActiveBlockId
} from "../../redux/pipelineSlice";
import {ReactComponent as TrashSVG} from "../../assets/trash3-fill.svg";
import {ReactComponent as InfoSVG} from "../../assets/info-circle-fill.svg"
import { ReactComponent as CloseSVG } from '../../assets/close-circle-svgrepo-com.svg';
import {useState} from 'react';
import {LineChart} from "../charts/LineChart";

export const StyledNodeContainer = styled.div<{ $active?: boolean }>`
    padding: 5px;
    border: 1px solid ${props => !props.$active ? '#73B5B4' : '#73B5B4'};
    border-radius: 5px;
    background: ${props => props.$active ? '#eeede9' : 'linear-gradient(to bottom right, #3D3D3D 0%, #000000 100%)'};
    position: relative;
    width: 100px;
    min-height: 25px;
    text-align: center;
`;

export const StyledNodeLabel = styled.div<{ $active?: boolean, $small?: boolean }>`
    font-size: ${props => (props.$small ? '0.5rem' : '0.75rem')};
    font-weight: normal;
    color: ${props => !props.$active ? '#ffffff' : '#73B5B4'};
`;

export const StyledNodeType = styled.div`
    font-size: 5px;
    position: absolute;
    bottom: 0;
    right: 3px;
    color: #888;
`;

export const StyledTag = styled.div`
    font-size: 5px;
    position: fixed;
    bottom: -4px;
    left: 3px;
    color: #888;
`;

export const StyledDeleteButton = styled.div`
    position: absolute;
    top: -5px;
    right: 3px;
    opacity: 0.25;

    &:hover {
        cursor: pointer;
        opacity: 0.8;
    }
`;

// export const StyledRunButton = styled.div`
//     position: absolute;
//     top: -1px;
//     right: -1px;
//     opacity: 0.25;

//     &:hover {
//         cursor: pointer;
//         opacity: 0.8;
//     }
// `;

export const StyledNodeInfoIcon = styled(InfoSVG)`
    position: absolute;
    top: 2px;
    left: 3px;
    width: 7px;
    height: 7px;
    // opacity: 0.25;
    color: 	#989898; //grey
    &:hover {
        cursor: pointer;
        opacity: 0.8;
        color: #0056b3; 
    }
`;    

export const StyledPopup = styled.div<{ $visible: boolean }>`
    position: overlay; 
    top: 10px; // Overlay positioning
    left: 50px; 
    font-size: 0.5vw; // Adjust font size as necessary
    background-color: #f5fffa;
    color: black;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 100;
    width: 200px; 
    max-height: 250px; // Set max height
    overflow-y: auto; // Enable vertical scrolling
    display: ${({ $visible }) => ($visible ? 'block' : 'none')};
    transition: opacity 0.3s ease; 
    opacity: ${({ $visible }) => ($visible ? 1 : 0)}; 
    animation: ${({ $visible }) => ($visible ? 'fadeIn 0.3s' : 'none')};

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Scrollbar styles for WebKit browsers */
    &::-webkit-scrollbar {
        width: 8px; /* Width of the scrollbar */
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1; /* Color of the scrollbar track */
        border-radius: 10px; /* Rounded corners */
    }

    &::-webkit-scrollbar-thumb {
        background: #888; /* Color of the scrollbar thumb */
        border-radius: 10px; /* Rounded corners */
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #555; /* Darker color on hover */
    }
`;

export const StyledCloseInfoIcon = styled(CloseSVG)`
    position: fixed; // Correct positioning
    top: 25px; // Adjust position as needed
    left: 190px; // Adjust position as needed
    width: 10px;
    height: 10px;
    opacity: 0.5;
    // z-index: 100; // Ensures the icon appears above other content
    &:hover {
        cursor: pointer; // Shows a pointer cursor on hover
        opacity: 0.8; // Increases opacity on hover for a visual effect
    }
`;

export const StyledNodeOutputContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: -40px;
    right: -20px;
    width: 50px;
    height: 30px;
    border-radius: 5px;
    background: linear-gradient(to bottom right, #3D3D3D 0%, #000000 100%);
    color: #9e9d9d;

    &:hover {
        cursor: pointer;
    }
`;

export const StyledNodeOutputPopup = styled.div`
    position: absolute;
    display: flex;
    top: -105px;
    left: -100px;
    width: 200px;
    height: 100px;
    overflow-y: clip;
    background: linear-gradient(to bottom right, #3D3D3DDD 0%, #000000DD 100%);
    border-radius: 5px;
    z-index: 100;
`;

const CustomNode = ({data}: CustomNodeProps) => {
    const [isPopupVisible, setPopupVisible] = useState(false);
    const pipeline = useAppSelector(getPipelineModel);
    const dispatch = useAppDispatch();
    const activeNodeId = useAppSelector(getActiveBlockId);
    const block = useAppSelector(state => getBlockById(state, data.blockId));
    const [showOutputPopup, setShowOutputPopup] = useState(false);
    const blockConnected = useAppSelector(state => blockConnectedToPipeline(state, data.blockId))

    return (
    const togglePopup = () => {
        setPopupVisible(prev => !prev);
    };

    return (
        <StyledNodeContainer $active={data.id === activeNodeId} onClick={() => dispatch(setActiveBlockId(data.id))}>
            <Handle type="target" position={Position.Top} />
            <StyledDeleteButton title={"Delete Block"} onClick={(e) => {
                dispatch(deleteBlockFromPipeline({pipelineId: pipeline.id, blockId: data.id}));
                e.stopPropagation(); // Prevents closing due to parent clicks
            }}>
                <TrashSVG style={{width: "7px", height: "7px", color: "#ff0000"}}/>
            </StyledDeleteButton>
            <StyledNodeLabel $active={data.id === activeNodeId} $small={data.label.length > 14}>
                {data.label}
            </StyledNodeLabel>
            <StyledNodeType>{data.type}</StyledNodeType>
            <Handle type="source" position={Position.Bottom} />
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
                    dispatch(setActiveBlockId(data.id)); // Set active block ID
                }}>
                    <CloseSVG />
                </StyledCloseInfoIcon>
                {data.description}
            </StyledPopup>
            <StyledTag>
            {data.tag}
            </StyledTag>
            <Handle type="source" position={Position.Bottom}/>
            {blockConnected && block && block?.output?.Dataframe?.data !== undefined &&
                <StyledNodeOutputContainer onMouseEnter={() => setShowOutputPopup(true)}
                                           onMouseLeave={() => setShowOutputPopup(false)}>
                    <LineChart block={block} small={true} mini={true}/>
                    {showOutputPopup &&
                        <StyledNodeOutputPopup>
                            <LineChart block={block} small={true}/>
                        </StyledNodeOutputPopup>}
                </StyledNodeOutputContainer>}
        </StyledNodeContainer>
    )
        ;
};

export default CustomNode;