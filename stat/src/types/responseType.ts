export interface CreateBlockResponse {
    block_id: string;
}

type DataColumn = {
    data: number[] | (number | string | null)[];
};

type DataCollection = {
    id: string;
    name: string;
    freq_hz: number;
    data: {
        data: DataColumn;
        freq_hz: number;
        index: number[];
        name: string;
    }[];
    input_data: {
        data: {
            [key: string]: DataColumn;
        };
    };
    metadata: {
        created_at: string;
        some_other_metadata: string;
    };
};

export type FilterModel = {
    filter_type: string;
    filter_description: string;
    name: string;
    dtype: string;
    required: boolean;
    label: string;
    [key: string]: any;
}

export type BlockModel = {
    id: string;
    name: string;
    type: string;
    input: {
        [key: string]: DataCollection;
    };
    output: {
        [key: string]: DataCollection;
    };
    metadata: {
        created_at: string;
        some_other_metadata: string;
    };
    filters: {[key: string]: FilterModel};
};

export type SettableField = {
    [key: string]: {
        title: string,
        description: string,
        example: string
    }
}

export type BlockTypeModel =  {
    type: string,
    name: string,
    description: string,
    settable_fields: SettableField[]
}