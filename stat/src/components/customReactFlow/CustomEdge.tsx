import {BaseEdge, getBezierPath, EdgeProps, EdgeLabelRenderer, useReactFlow} from '@xyflow/react';
import {ReactComponent as TrashSVG} from "../../assets/trash3-fill.svg";
import styled from "styled-components";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {getPipelineModel} from "../../redux/pipelineSlice";
import {deleteEdgeFromPipeline} from "../../redux/pipelineThunk";

const StyledBaseEdge = styled(BaseEdge)`
  stroke-width: 1;
  stroke: #ffffff;
`;

const StyledDeleteIconContainer = styled.div<{ $transform: string }>`
  position: absolute;
  top: 0;
  left: 0;
  padding: 1px;
  transform: ${props => props.$transform};
  pointer-events: all;

  &:hover {
    cursor: pointer;
  }

  & svg {
    width: 7px;
    height: 7px;
    fill: #f0f0f0f0;
    opacity: 0.3;
  }

  & svg:hover {
    opacity: 0.8;
      fill: #ff0000;
  }
`;

export default function CustomEdge({id, sourceX, sourceY, targetX, targetY}: EdgeProps) {
    const pipeline = useAppSelector(getPipelineModel);
    const dispatch = useAppDispatch();
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });

    return (
        <>
                <StyledBaseEdge id={id} path={edgePath}/>
                    <EdgeLabelRenderer>
                        <StyledDeleteIconContainer title={"Delete Edge"}
                            $transform={`translate(-5%, -50%) translate(${labelX}px, ${labelY}px)`} onClick={(e) => {
                                dispatch(deleteEdgeFromPipeline({pipelineId: pipeline.id, edgeId: id}));
                                e.stopPropagation();
                        }}>
                            <TrashSVG/>
                        </StyledDeleteIconContainer>
                    </EdgeLabelRenderer>

        </>
    );
}