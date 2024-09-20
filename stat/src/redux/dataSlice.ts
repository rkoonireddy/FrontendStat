import {createAsyncThunk, createSelector, createSlice} from "@reduxjs/toolkit";
import {parseCSV} from "../service/dataService";
import {RootState} from "../store";
import {convertToCSV} from "../util/util";


interface IDataState {
    rawData: { [key: string]: string; }[],
    filteredData: { [key: string]: string; }[],
    filteredDataChanged: boolean
}

const initialState: IDataState = {
    rawData: [] as Array<{ [key: string]: string }>,
    filteredData: [] as Array<{ [key: string]: string }>,
    filteredDataChanged: false
}

export const readData = createAsyncThunk("data/readData",
    async (rawData: FormData, thunkAPI) => {
        try {
            return await parseCSV({formData: rawData});
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }

    });


export const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        resetData: (state) => {
            console.log("resetting data");
            state.rawData = [];
            state.filteredData = [];
            state.filteredDataChanged = false;
        },
        setRawData: (state: { rawData: { [key: string]: string; }[]; }, action: {
            payload: { [key: string]: string; }[];
        }) => {
            state.rawData = action.payload;
        },
        setFilteredData: (state: {
            filteredData: { [key: string]: string; }[],
            filteredDataChanged: boolean;
        }, action: { payload: { [key: string]: string; }[]; }) => {
            state.filteredData = action.payload;
            state.filteredDataChanged = true;
        },
        setFilteredDataChanged: (state: { filteredDataChanged: boolean; }, action: { payload: boolean; }) => {
            state.filteredDataChanged = action.payload;
        }
    },
    extraReducers: builder => {
        builder.addCase(readData.fulfilled, (state, action) => {
            state.rawData = action.payload;
            state.filteredData = action.payload;
            state.filteredDataChanged = true;
        });
        builder.addCase(readData.rejected, (state, action) => {
            console.log(action.error.message);
        });
    }
})

export const {
    resetData,
    setRawData,
    setFilteredData,
    setFilteredDataChanged} = dataSlice.actions;

export default dataSlice.reducer;

export const getData = (state: RootState) => state.data.rawData;

export const rawDataExists = createSelector(
    getData,
    (data) => data.length > 0
);

export const getFilteredDataChanged = (state: RootState) => state.data.filteredDataChanged;

export const getFilteredData = (state: RootState) => state.data.filteredData;

export const getFilteredDataAsCSVString = createSelector(
    getFilteredData,
    (filteredData) => {
        return filteredData.length > 0 ? convertToCSV(filteredData) : '';
    }
);
