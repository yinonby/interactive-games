
/*
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { DataSrcVersionT } from "../types/ApiRequestTypes";
import type { DataSrcT } from "../types/AppReducerTypes";

export type DataSrcVersionsReducerStateT = {
  versionMapping: Record<DataSrcT, DataSrcVersionT | null>;
};

const initialState: DataSrcVersionsReducerStateT = {
  versionMapping: {
    "user-config": null,
    "game-instance": null,
  },
};

const dataSrcVersionSlice = createSlice({
  name: 'dataSrcVersionReducer',
  initialState,
  reducers: {
    setDataSrcVersion(state, action: PayloadAction<{ dataSrcKey: DataSrcT, dataSrcVersion: DataSrcVersionT }>) {
      state.versionMapping[action.payload.dataSrcKey] = action.payload.dataSrcVersion;
    },
  },
});

export const { setDataSrcVersion } = dataSrcVersionSlice.actions;
export const { reducerPath: dataSrcVersionReducerPath } = dataSrcVersionSlice;
export const { reducer: dataSrcVersionReducer } = dataSrcVersionSlice;
export type DataSrcVersionsPartialReducerStateT = { [dataSrcVersionReducerPath]: DataSrcVersionsReducerStateT };
*/
