import React from 'react';
import {Handle, Position} from '@xyflow/react';
import {CustomNodeProps} from "../../types/nodeTypes";
import {StyledDeleteButton, StyledNodeContainer, StyledNodeLabel, StyledNodeType} from "./CustomNode";
import {useAppSelector} from "../../hooks";
import {getActiveBlockId, removeBlock, setActiveBlockId} from "../../redux/pipelineSlice";
import {useDispatch} from "react-redux";
import {ReactComponent as TrashSVG} from "../../assets/trash.svg";


const CustomStartNode = ({data}: CustomNodeProps) => {
    const dispatch = useDispatch();
    const activeNodeId = useAppSelector(getActiveBlockId);
    return (
        <StyledNodeContainer $active={data.id === activeNodeId} onClick={() => dispatch(setActiveBlockId(data.id))}>
            <StyledDeleteButton onClick={(e) => {dispatch(removeBlock(data.id)); e.stopPropagation();}}>
                <TrashSVG style={{width: "10px", height: "10px", color: "#ff0000"}}/>
            </StyledDeleteButton>
            <StyledNodeLabel $active={data.id === activeNodeId}>{data.label}</StyledNodeLabel>
            <StyledNodeType>{data.type}</StyledNodeType>
            <Handle type="source" position={Position.Bottom}/>
        </StyledNodeContainer>
    );
};

export default CustomStartNode;