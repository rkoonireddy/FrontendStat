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
        id: '1',
        data: {label: 'Hello'},
        position: {x: 0, y: 0},
        type: 'input',
    },
    {
        id: '2',
        data: {label: 'World'},
        position: {x: 100, y: 100},
    },
];

function Flow() {

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

    return (
        <ReactFlow
            nodes={nodes}
            onNodesChange={onNodesChange}
            edges={edges}
            onEdgesChange={onEdgesChange}
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