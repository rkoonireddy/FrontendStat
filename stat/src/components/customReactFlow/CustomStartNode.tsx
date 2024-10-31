import React from 'react';
import {Handle, Position} from '@xyflow/react';
import {CustomNodeProps} from "../../types/nodeTypes";
import {StyledNodeContainer, StyledNodeLabel, StyledNodeType} from "./CustomNode";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {getActiveBlockId, setActiveBlockId} from "../../redux/pipelineSlice";



const CustomStartNode = ({data}: CustomNodeProps) => {
    const dispatch = useAppDispatch();
    const activeNodeId = useAppSelector(getActiveBlockId);
    return (
        <StyledNodeContainer $active={data.id === activeNodeId} onClick={() => dispatch(setActiveBlockId(data.id))}>
            <StyledNodeLabel $active={data.id === activeNodeId} $small={data.label.length > 14}>{data.label}</StyledNodeLabel>
            <StyledNodeType>{data.type}</StyledNodeType>
            <Handle type="source" position={Position.Bottom}/>
        </StyledNodeContainer>
    );
};

export default CustomStartNode;