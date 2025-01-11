import styled from "styled-components";
import Dagre from '@dagrejs/dagre';
import {
    ReactFlow,
    Controls,
    Background,
    addEdge, useNodesState, useEdgesState, ReactFlowProvider, Panel, Edge, useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import React, {useCallback, useEffect, useRef} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {
    blockConnectedToPipeline,
    getActiveBlock,
    getActiveBlockId,
    getAllEdges,
    getAllNodes,
    getBlocks,
    getPipeline, getReactFlowNodes,
    setLoading, setReactFlowNodes,
    showDeletePipelinePopup
} from "../../redux/pipelineSlice";
import {createEdges, getFirstKey} from "../../util/util";
import CustomNode from "../customReactFlow/CustomNode";
import CustomStartNode from "../customReactFlow/CustomStartNode";
import CustomEdge from "../customReactFlow/CustomEdge";
import {ReactComponent as RunSVG} from "../../assets/run.svg";
import {ReactComponent as ExportSVG} from "../../assets/filetype-py.svg";
import {ReactComponent as CopySVG} from "../../assets/copy.svg";
import {ReactComponent as TrashSVG} from "../../assets/trash.svg";
import {ReactComponent as AlignSVG} from "../../assets/align.svg";
import {ReactComponent as ZoomInSVG} from "../../assets/zoom-in.svg";
import {ReactComponent as ZoomOutSVG} from "../../assets/zoom-out.svg";
import {ReactComponent as FitToViewSVG} from "../../assets/fit-to-screen.svg";
import {createNodesFromBlocks, saveLayout} from "../../util/blockUtil";
import {connectTwoBlocks, executePipeline, fetchExportPipeline, snoopPipelineColumns} from "../../redux/pipelineThunk";
import {CompleteNode} from "../../types/reactFlowCustomTypes";

const NodeTypes = {customNode: CustomNode, customStartNode: CustomStartNode};
const edgeTypes = {
    'custom-edge': CustomEdge
}

const StyledStepsContainer = styled.div`
    display: flex;
    justify-content: center;
    margin: 5px;
    height: calc(100vh - 10px);
    background-color: #ffffff08;
`;

const StyledToolbar = styled.div<{ $width?: string }>`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: ${props => props.$width ? props.$width : "450px"};
    left: 0;
    right: 0;
    margin: 0 auto;
`;

const StyledActionButton = styled.div<{ $position?: string }>`
    display: flex;
    justify-content: center;
    align-items: center;
    width: fit-content;
    height: fit-content;

    ${props => props.$position === "left" ? "margin-right: auto;" : ""}
    & svg {
        fill: #ffffff;
    }

    & svg.custom-line {
        stroke: #ffffff;
    }

    &:hover {
        cursor: pointer;
        scale: 1.05;
    }

    & svg.delete:hover {
        fill: #ff0000;
    }
`;

const getLayoutedElements = (nodes: CompleteNode[], edges: Edge[], options: { direction: string }) => {
    const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
    g.setGraph({rankdir: options.direction});

    edges.forEach((edge) => g.setEdge(edge.source, edge.target));
    nodes.forEach((node) =>
        g.setNode(node.id, {
            ...node,
            width: 100,
            height: 25,
        }),
    );

    Dagre.layout(g);

    return {
        nodes: nodes.map((node) => {
            const position = g.node(node.id);
            const x = position.x - 100 / 2;
            const y = position.y - 25 / 2;

            return {...node, position: {x, y}};
        }),
        edges: edges.map((edge) => ({
            ...edge,
            type: edge.type ?? 'custom-edge',
        })),
    };
};

function Flow() {
    const {fitView, zoomIn, zoomOut} = useReactFlow();
    const dispatch = useAppDispatch();
    const pipeline = useAppSelector(getPipeline);
    const blocks = useAppSelector(getBlocks);
    const activeBlockId = useAppSelector(getActiveBlockId);
    const activeBlock = useAppSelector(getActiveBlock);
    const initialNodes = useAppSelector(getAllNodes);
    const initialEdges = useAppSelector(getAllEdges);
    const pipelineExportableRunnable = useAppSelector(state =>
        activeBlockId ? blockConnectedToPipeline(state, activeBlockId) : false
    );
    const reactFlowNodes = useAppSelector(getReactFlowNodes);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const nodesRef = useRef(nodes);

    useEffect(() => {
        nodesRef.current = nodes;
    }, [nodes]);

    useEffect(() => {
        const ns = createNodesFromBlocks(blocks, reactFlowNodes);
        setNodes(ns);
    }, [blocks])

    useEffect(() => {
        const es = createEdges(pipeline);
        setEdges(es);
    }, [pipeline]);


    const onLayout = useCallback(
        (direction: string) => {
            const layouted = getLayoutedElements(nodes, edges, {direction});

            setNodes([...layouted.nodes]);
            setEdges([...layouted.edges]);

            setTimeout(() => {
                fitView({duration: 500});
                saveLayout([...layouted.nodes], dispatch);
            }, 100);
        },
        [nodes, edges],
    );

    const onConnect = useCallback(
        (connection: any) => {
            const edge = {...connection, type: 'custom-edge'};

            // Check if the edge already exists to avoid duplicates
            setEdges((eds) => {
                const edgeExists = eds.some(e => e.source === edge.source && e.target === edge.target);
                if (!edgeExists) {
                    dispatch(
                        connectTwoBlocks({fromBlockId: edge.source, toBlockId: edge.target, pipelineId: pipeline.id}))
                        .unwrap()
                        .then(() => {
                            // If edge creation is successful, first let the pipeline snoop the columns
                            return dispatch(snoopPipelineColumns({pipelineId: pipeline.id})).unwrap();
                        })
                        .then(() => {
                            return addEdge(edge, eds);
                        }).then(() => saveLayout(nodesRef.current, dispatch))
                        .catch((err) => {
                            return eds;
                        })
                }
                return eds;
            });
        },
        [setEdges, dispatch, pipeline.id]
    )

    const onNodeDragStop = useCallback(() => {
        saveLayout(nodes, dispatch);
    }, [nodes]);


    return (
        <ReactFlow
            nodes={nodes}
            onNodesChange={onNodesChange}
            edges={edges}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeDragStop={onNodeDragStop}
            nodeTypes={NodeTypes}
            edgeTypes={edgeTypes}
            fitView
        >
            <Background/>
            {/*<Controls position="top-left"/>*/}
            <Panel position="top-right">
                <StyledToolbar $width={"200px"}>
                    <StyledActionButton title={"Align Blocks"} onClick={() => onLayout("TB")}>
                        <AlignSVG style={{width: "35px", height: "35px"}}/>
                    </StyledActionButton>
                    <StyledActionButton title={"Fit Pipeline into view"} onClick={() => fitView()}>
                        <FitToViewSVG style={{width: "35px", height: "35px"}}/>
                    </StyledActionButton>
                    <StyledActionButton title={"Zoom in"} onClick={() => zoomIn()}>
                        <ZoomInSVG style={{width: "35px", height: "35px"}}/>
                    </StyledActionButton>
                    <StyledActionButton title={"Zoom out"} onClick={() => zoomOut()}>
                        <ZoomOutSVG style={{width: "35px", height: "35px"}}/>
                    </StyledActionButton>
                </StyledToolbar>
            </Panel>
            <Panel position={"bottom-right"}>
                <StyledToolbar>
                    <StyledActionButton $position={"left"} title={"Delete Pipeline"} onClick={() => {
                        dispatch(showDeletePipelinePopup());
                    }}>
                        <TrashSVG className={"delete"} style={{width: "35px", height: "35px"}}/>
                    </StyledActionButton>
                    {pipelineExportableRunnable && activeBlock && activeBlock?.output?.Dataframe?.data !== undefined ?
                        <StyledActionButton title={"Export Pipeline"} onClick={(e) => {
                            dispatch(setLoading(true));
                            dispatch(fetchExportPipeline({
                                pipelineId: pipeline.id,
                                startBlockId: blocks[0].id,
                                endBlockId: activeBlockId ? activeBlockId : blocks[blocks.length - 1].id
                            }));
                            e.stopPropagation();
                        }}>
                            <ExportSVG style={{width: "35px", height: "35px"}}/>
                        </StyledActionButton> : <div style={{width: "35px", height: "35px"}}/>}
                    <StyledActionButton title={"Run Pipeline"} onClick={(e) => {
                        saveLayout(nodes, dispatch);
                        dispatch(setLoading(true));

                        dispatch(executePipeline({
                            pipelineId: pipeline.id,
                            startingBlockId: getFirstKey(pipeline.block_dict) as string
                        }));
                        e.stopPropagation();
                    }}>
                        <RunSVG style={{width: "50px", height: "50px", fill: "#00ff00"}}/>
                    </StyledActionButton>
                    <StyledActionButton title={"Copy Pipeline ID"} onClick={() => {
                        navigator.clipboard.writeText(pipeline.id);
                        alert("Pipeline ID copied to clipboard.");
                    }}>
                        <CopySVG style={{width: "35px", height: "35px"}}/>
                    </StyledActionButton>
                </StyledToolbar>
            </Panel>
        </ReactFlow>
    );
}

export function StepsSection() {
    return (
        <StyledStepsContainer>
            <ReactFlowProvider>
                <Flow/>
            </ReactFlowProvider>
        </StyledStepsContainer>
    );
}