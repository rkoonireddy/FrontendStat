import React from 'react';
import {Handle, Position} from '@xyflow/react';
import {CustomNodeProps} from "../../types/nodeTypes";
import {StyledNodeContainer, StyledNodeLabel, StyledNodeType} from "./CustomNode";
import {useAppSelector} from "../../hooks";
import {getActiveBlockId, setActiveStepId} from "../../redux/pipelineSlice";
import {useDispatch} from "react-redux";

const CustomStartNode = ({data}: CustomNodeProps) => {
    const dispatch = useDispatch();
    const activeNodeId = useAppSelector(getActiveBlockId);
    return (
        <StyledNodeContainer $active={data.id === activeNodeId} onClick={() => dispatch(setActiveStepId(data.id))}>
            <StyledNodeLabel $active={data.id === activeNodeId}>{data.label}</StyledNodeLabel>
            <StyledNodeType>{data.type}</StyledNodeType>
            <Handle type="source" position={Position.Bottom}/>
        </StyledNodeContainer>
    );
};

export default CustomStartNode;