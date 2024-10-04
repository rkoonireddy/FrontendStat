import React from 'react';
import {Handle, Position} from '@xyflow/react';
import {CustomNodeProps} from "../../types/nodeTypes";
import {StyledNodeContainer, StyledNodeLabel, StyledNodeType, StyledRunButton} from "./CustomNode";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {executeBlock, getActiveBlockId, setActiveBlockId} from "../../redux/pipelineSlice";
import {ReactComponent as RunSVG} from "../../assets/run.svg";



const CustomStartNode = ({data}: CustomNodeProps) => {
    const dispatch = useAppDispatch();
    const activeNodeId = useAppSelector(getActiveBlockId);
    return (
        <StyledNodeContainer $active={data.id === activeNodeId} onClick={() => dispatch(setActiveBlockId(data.id))}>
            {/* <StyledRunButton title={"Run Block"} onClick={(e) => {
                dispatch(executeBlock({blockId: data.id}));
                e.stopPropagation();
            }}>
                <RunSVG style={{width: "15px", height: "15px", color: "#00ff00"}}/>
            </StyledRunButton> */}
            <StyledNodeLabel $active={data.id === activeNodeId}>{data.label}</StyledNodeLabel>
            <StyledNodeType>{data.type}</StyledNodeType>
            <Handle type="source" position={Position.Bottom}/>
        </StyledNodeContainer>
    );
};

export default CustomStartNode;