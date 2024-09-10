import {BaseEdge, getBezierPath, EdgeProps, EdgeLabelRenderer, useReactFlow} from '@xyflow/react';
import {ReactComponent as TrashSVG} from "../../assets/trash.svg";
import styled from "styled-components";

const StyledBaseEdge = styled(BaseEdge)`
  stroke-width: 2;
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
    width: 10px;
    height: 10px;
    color: #ff0000;
    opacity: 0.3;
  }

  & svg:hover {
    opacity: 0.8;
  }
`;

export default function CustomEdge({id, sourceX, sourceY, targetX, targetY}: EdgeProps) {
    const {setEdges} = useReactFlow();
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
                            $transform={`translate(-5%, -50%) translate(${labelX}px, ${labelY}px)`} onClick={() => {
                            setEdges((es) => es.filter((e) => e.id !== id));
                        }}>
                            <TrashSVG/>
                        </StyledDeleteIconContainer>
                    </EdgeLabelRenderer>

        </>
    );
}