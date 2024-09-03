import React from 'react';
import styled from 'styled-components';
import { Handle, Position } from '@xyflow/react';
import {CustomNodeProps} from "../../types/nodeTypes";
import {useAppSelector} from "../../hooks";
import {getActiveBlockId, setActiveStepId} from "../../redux/pipelineSlice";
import {useDispatch} from "react-redux";

export const StyledNodeContainer = styled.div<{ $active?: boolean }>`
  padding: 10px;
  border: 2px solid ${props => !props.$active ? '#73B5B4' : '#ffffff'};
  border-radius: 5px;
  background: linear-gradient(to bottom right, #3D3D3D 0%, #000000 100%);
  position: relative;
  width: 150px;
  text-align: center;
`;

export const StyledNodeLabel = styled.div<{ $active?: boolean }>`
  font-size: 12px;
  font-weight: bold;
  color: ${props => !props.$active ? '#ffffff' : '#73B5B4'};
`;

export const StyledNodeType = styled.div`
  font-size: 7px;
  position: absolute;
  bottom: 0;
  right: 3px;
  color: #888;
`;

const CustomNode = ({ data }: CustomNodeProps) => {
    const dispatch = useDispatch();
    const activeNodeId = useAppSelector(getActiveBlockId);
    return (
        <StyledNodeContainer $active={data.id === activeNodeId} onClick={() => dispatch(setActiveStepId(data.id))}>
            <Handle type="target" position={Position.Top} />
            <StyledNodeLabel  $active={data.id === activeNodeId}>{data.label}</StyledNodeLabel>
            <StyledNodeType>{data.type}</StyledNodeType>
            <Handle type="source" position={Position.Bottom} />
        </StyledNodeContainer>
    );
};

export default CustomNode;