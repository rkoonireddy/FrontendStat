import {createAsyncThunk, createSelector, createSlice} from "@reduxjs/toolkit";
import {parseCSV} from "../service/dataService";
import {RootState} from "../store";
import {convertToCSV} from "../util/fileUtil";


interface IDataState {
    previewData: { [key: string]: string }[],
    rawData: { [key: string]: string; }[],
    filteredData: { [key: string]: string; }[],
    filteredDataChanged: boolean,
    initialized: boolean
}

const initialState: IDataState = {
    previewData: [] as Array<{ [key: string]: string }>,
    rawData: [] as Array<{ [key: string]: string }>,
    filteredData: [] as Array<{ [key: string]: string }>,
    filteredDataChanged: true,
    initialized: false
}

export const readData = createAsyncThunk("data/readData",
    async (previewData: FormData, thunkAPI) => {
        try {
            return await parseCSV({formData: previewData});
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }

    }
);


export const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        resetData: (state) => {
            state.previewData = [];
            state.rawData = [];
            state.filteredData = [];
            state.filteredDataChanged = false;
            state.initialized = false;
        },
        resetPreviewData: (state) => {
            state.previewData = [];
        },
        setPreviewData: (state: { previewData: { [key: string]: string; }[]; }, action: {
            payload: { [key: string]: string; }[];
        }) => {
            state.previewData = action.payload;
        },
        setRawData: (state: { rawData: { [key: string]: string; }[]; }, action: {
            payload: { [key: string]: string; }[];
        }) => {
            state.rawData = action.payload;
        },
        setFilteredData: (state: {
            filteredData: { [key: string]: string; }[],
            filteredDataChanged: boolean,
            initialized: boolean;
        }, action: { payload: { [key: string]: string; }[]; }) => {
            state.filteredData = action.payload;
            state.filteredDataChanged = true;
            state.initialized = true;
        },
        setFilteredDataChanged: (state: { filteredDataChanged: boolean; }, action: { payload: boolean; }) => {
            state.filteredDataChanged = action.payload;
        }
    },
    extraReducers: builder => {
        builder.addCase(readData.fulfilled, (state, action) => {
            state.previewData = action.payload;
        });
        builder.addCase(readData.rejected, (state, action) => {
            console.log(action.error.message);
        });
    }
})

export const {
    resetData,
    resetPreviewData,
    setPreviewData,
    setRawData,
    setFilteredData,
    setFilteredDataChanged} = dataSlice.actions;

export default dataSlice.reducer;

export const getData = (state: RootState) => state.data.rawData;

export const getPreviewData = (state: RootState) => state.data.previewData;

export const previewDataExists = createSelector(
    getPreviewData,
    (data) => data.length > 0
);

export const rawDataExists = createSelector(
    getData,
    (data) => data.length > 0
);

export const getFilteredDataChanged = (state: RootState) => state.data.filteredDataChanged;

export const getFilteredData = (state: RootState) => state.data.filteredData;

export const getRawDataColumns = (state: RootState) => 
    state.data.rawData.length > 0 ? Object.keys(state.data.rawData[0]) : [];

// If the filtered data is not initialized, return the columns of the raw data
export const getFilteredDataColumns = (state: RootState): string[] => {
    if(state.data.initialized){
        return state.data.filteredData.length > 0 ? Object.keys(state.data.filteredData[0]) : [];
    }
    return getRawDataColumns(state);
};

export const getFilteredDataAsCSVString = createSelector(
    getFilteredData,
    (filteredData) => {
        return filteredData.length > 0 ? convertToCSV(filteredData) : '';
    }
);
