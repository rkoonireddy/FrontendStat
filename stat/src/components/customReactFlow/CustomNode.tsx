import React from 'react';
import styled from 'styled-components';
import {Handle, Position} from '@xyflow/react';
import {CustomNodeProps} from "../../types/nodeTypes";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {
    deleteBlockFromPipeline,
    getActiveBlockId,
    getPipelineModel, isBlockRunnable,
    setActiveBlockId
} from "../../redux/pipelineSlice";
import {ReactComponent as TrashSVG} from "../../assets/trash3-fill.svg";

export const StyledNodeContainer = styled.div<{ $active?: boolean }>`
  padding: 5px;
  border: 1px solid ${props => !props.$active ? '#73B5B4' : '#73B5B4'};
  border-radius: 5px;
  background: ${props => props.$active ? '#eeede9' : 'linear-gradient(to bottom right, #3D3D3D 0%, #000000 100%)'};
  position: relative;
  width: 100px;
  text-align: center;
`;

export const StyledNodeLabel = styled.div<{ $active?: boolean }>`
  font-size: 0.75rem;
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

const CustomNode = ({data}: CustomNodeProps) => {
    const pipeline = useAppSelector(getPipelineModel);
    const dispatch = useAppDispatch();
    const activeNodeId = useAppSelector(getActiveBlockId);
    const blockRunnable = useAppSelector(state => isBlockRunnable(state, data.id));
    return (

        <StyledNodeContainer $active={data.id === activeNodeId} onClick={() => dispatch(setActiveBlockId(data.id))}>
            <Handle type="target" position={Position.Top}/>
            <StyledDeleteButton title={"Delete Block"} onClick={(e) => {
                dispatch(deleteBlockFromPipeline({pipelineId: pipeline.id, blockId: data.id}));
                e.stopPropagation();
            }}>
                <TrashSVG style={{width: "7px", height: "7px", color: "#ff0000"}}/>
            </StyledDeleteButton>
            <StyledNodeLabel $active={data.id === activeNodeId}>{data.label}</StyledNodeLabel>
            <StyledNodeType>{data.type}</StyledNodeType>
            <Handle type="source" position={Position.Bottom}/>
        </StyledNodeContainer>
    );
};

export default CustomNode;