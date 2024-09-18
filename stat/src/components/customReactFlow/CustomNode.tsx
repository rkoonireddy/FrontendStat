import React from 'react';
import styled from 'styled-components';
import {Handle, Position} from '@xyflow/react';
import {CustomNodeProps} from "../../types/nodeTypes";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {
    deleteBlockFromPipeline, executeBlock,
    getActiveBlockId,
    getPipelineModel, isBlockRunnable,
    setActiveBlockId
} from "../../redux/pipelineSlice";
import {ReactComponent as TrashSVG} from "../../assets/trash.svg";
import {ReactComponent as RunSVG} from "../../assets/run.svg";

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

export const StyledDeleteButton = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  padding: 1px;
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
                <TrashSVG style={{width: "10px", height: "10px", color: "#ff0000"}}/>
            </StyledDeleteButton>
            <StyledRunButton title={"Run Block"} onClick={(e) => {
                dispatch(executeBlock({blockId: data.id}));
                e.stopPropagation();
            }}>
                {blockRunnable &&
                    <RunSVG style={{width: "15px", height: "15px", color: "#00ff00"}}/>
                }
            </StyledRunButton>
            <StyledNodeLabel $active={data.id === activeNodeId}>{data.label}</StyledNodeLabel>
            <StyledNodeType>{data.type}</StyledNodeType>
            <Handle type="source" position={Position.Bottom}/>
        </StyledNodeContainer>
    );
};

export default CustomNode;