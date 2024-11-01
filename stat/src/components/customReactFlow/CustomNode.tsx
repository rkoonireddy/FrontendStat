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

export const StyledRunButton = styled.div`
    position: absolute;
    top: -1px;
    right: -1px;
    opacity: 0.25;

    &:hover {
        cursor: pointer;
        opacity: 0.8;
    }
`;

export const StyledNodeOutputContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: -30px;
    right: -10px;
    width: 40px;
    height: 20px;
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
    const [isInfoVisible, setIsInfoVisible] = useState(false);
    const pipeline = useAppSelector(getPipelineModel);
    const dispatch = useAppDispatch();
    const activeNodeId = useAppSelector(getActiveBlockId);
    const block = useAppSelector(state => getBlockById(state, data.blockId));
    const [showOutputPopup, setShowOutputPopup] = useState(false);
    const blockConnected = useAppSelector(state => blockConnectedToPipeline(state, data.blockId))
    const togglePopup = () => {
        setIsInfoVisible(prev => !prev);
    };

    return (

        <StyledNodeContainer $active={data.id === activeNodeId} onClick={() => dispatch(setActiveBlockId(data.id))}>
            <Handle type="target" position={Position.Top}/>
            <StyledDeleteButton title={"Delete Block"} onClick={(e) => {
                dispatch(deleteBlockFromPipeline({pipelineId: pipeline.id, blockId: data.id}));
                e.stopPropagation();
            }}>
                <TrashSVG style={{width: "7px", height: "7px", color: "#ff0000"}}/>
            </StyledDeleteButton>
            <StyledNodeLabel $active={data.id === activeNodeId}
                             $small={data.label.length > 14}>{data.label}</StyledNodeLabel>
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
            <StyledPopup $visible={isInfoVisible}>
                <StyledCloseInfoIcon onClick={(e) => {
                    e.stopPropagation(); // Prevents closing due to parent clicks
                    setIsInfoVisible(false); // Close the popup
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