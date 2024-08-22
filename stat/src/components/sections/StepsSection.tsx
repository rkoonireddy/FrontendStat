import styled from "styled-components";
import {
    ReactFlow,
    Controls,
    Background,
    applyNodeChanges,
    applyEdgeChanges,
    NodeChange,
    EdgeChange, addEdge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {useCallback, useState} from "react";
import {useAppSelector} from "../../hooks";
import {changeActiveStep, getPipeline} from "../../redux/pipelineSlice";
import {createEdges, createNodes} from "../../util/util";
import {NodeType} from "../../types/dataType";
import {useDispatch} from "react-redux";


const StyledStepsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 5px;
  height: calc(100vh - 10px);
  background-color: #ffffff08;
`;

const initialEdges = [{id: '1-2', source: '1', target: '2'}];

const initialNodes = [
    {
        id: '5',
        data: {label: 'Raw Data'},
        position: {x: 0, y: 0},
        type: 'input',
    },
    {
        id: '6',
        data: {label: 'Visualization'},
        position: {x: 100, y: 100},
    },
];

function Flow() {
    const dispatch = useDispatch();
    const pipeline = useAppSelector(getPipeline);
    const initialNodes = createNodes(pipeline);
    const initialEdges = createEdges(pipeline);

    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    const onNodesChange = useCallback(
        (changes: NodeChange<{
            id: string;
            data: { label: string; };
            position: { x: number; y: number; };
            type: string;
        } | {
            id: string;
            data: { label: string; };
            position: { x: number; y: number; };
            type?: undefined;
        }>[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange<{
            id: string;
            source: string;
            target: string;
        }>[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [],
    );

    const onConnect = useCallback(
        (params: any) => setEdges((eds) => addEdge(params, eds)),
        [],
    );

    const selectStep = useCallback((event: React.MouseEvent, node: NodeType) => {
        dispatch(changeActiveStep({ stepId: node.id }));
    }, []);

    return (
        <ReactFlow
            nodes={nodes}
            onNodesChange={onNodesChange}
            edges={edges}
            onEdgesChange={onEdgesChange}
            onNodeClick={selectStep}
            fitView
        >
            <Background/>
            <Controls/>
        </ReactFlow>
    );
}

export function StepsSection() {
    return (
        <StyledStepsContainer>
            <Flow/>
        </StyledStepsContainer>
    )
}