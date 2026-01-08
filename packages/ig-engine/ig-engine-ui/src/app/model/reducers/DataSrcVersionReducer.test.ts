
/*
import { createSlice } from '@reduxjs/toolkit';
import './DataSrcVersionReducer'; // your slice module

// --------------------
// Mock RTK (correct scoping)
// --------------------

jest.mock('@reduxjs/toolkit', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars
  createSlice: jest.fn(({ name, initialState, reducers }: any) => ({
    name,
    reducer: jest.fn(),
    actions: {},
  })),
}));

// --------------------
// Tests
// --------------------

describe('DataSrcVersionReducer createSlice config', () => {
  it('calls createSlice with expected configuration', () => {
    expect(createSlice).toHaveBeenCalledTimes(1);

    const callArg = (createSlice as jest.Mock).mock.calls[0][0];

    expect(callArg).toMatchObject({
      name: 'dataSrcVersion',
      initialState: {
        versionMapping: {
          'user-config': null,
        },
      },
      reducers: {
        setDataSrcVersion: expect.any(Function),
      },
    });
  });

  it('setDataSrcVersion reducer updates versionMapping', () => {
    const callArg = (createSlice as jest.Mock).mock.calls[0][0];
    const reducerFn = callArg.reducers.setDataSrcVersion;

    const state = {
      versionMapping: {
        'user-config': null,
      },
    };

    reducerFn(state, {
      payload: {
        dataSrcKey: 'user-config',
        dataSrcVersion: 'v1.0.0',
      },
    });

    expect(state.versionMapping['user-config']).toBe('v1.0.0');
  });
});
*/
describe('gameUiConfigReducer', () => {
  it('should do nothing', () => {
  });
});
