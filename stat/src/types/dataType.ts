
export type DataPoint = {x: number, y: number};

export type PipelineStep = {
    id: string,
    name: string,
    type: string,
    historyVisible: boolean,
    historyExpanded: boolean,
    controlsVisible: boolean,
    controlsExpanded: boolean,
    controls: string[],

}

export type Pipeline = {
    id: string,
    steps: PipelineStep[],
}