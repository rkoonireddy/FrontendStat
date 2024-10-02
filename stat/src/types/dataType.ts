
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
    active: boolean

}

export type Pipeline = {
    id: string,
    steps: PipelineStep[],
}

export interface PipelineModel {
    id: string,
    block_dict: { [key: string]: string[] },
    edge_dict: { [key: string]: string[] },
    // edge_data_dict: { [key: string]: string },
    type: string
}
