import React, {useState} from 'react';
import {Handle, Position} from '@xyflow/react';
import {CustomNodeProps} from "../../types/nodeTypes";
import {
    StyledNodeContainer,
    StyledNodeLabel, StyledNodeOutputContainer,
    StyledNodeOutputPopup,
    StyledNodeType,
} from "./CustomNode";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {getActiveBlockId, getBlockById, setActiveBlockId} from "../../redux/pipelineSlice";
import CSVViewer from "../charts/CSVViewer";
import styled from "styled-components";


export const StyledNodeOutputPopupStart = styled(StyledNodeOutputPopup)`
    left: -50px;
    width: fit-content;
    padding: 5px;
`;


const CustomStartNode = ({data}: CustomNodeProps) => {
    const dispatch = useAppDispatch();
    const activeNodeId = useAppSelector(getActiveBlockId);
    const block = useAppSelector(state => getBlockById(state, data.blockId));
    const [showOutputPopup, setShowOutputPopup] = useState(true);

    return (
        <StyledNodeContainer $active={data.id === activeNodeId} onClick={() => dispatch(setActiveBlockId(data.id))}>
            <StyledNodeLabel $active={data.id === activeNodeId} $small={data.label.length > 14}>{data.label}</StyledNodeLabel>
            <StyledNodeType>{data.type}</StyledNodeType>
            <Handle type="source" position={Position.Bottom}/>
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