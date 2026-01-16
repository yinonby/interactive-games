
import type { BaseQueryApi, BaseQueryFn } from '@reduxjs/toolkit/query';
import type { HttpAdapter } from '../../../../../../ig-lib/ig-client-utils/src/types/HttpProvider';
import type { ApiError } from '../../../types/AppApiTypes';
import type { GameUiConfigT } from "../../../types/GameUiConfigTypes";
import { useClientLogger } from "../../providers/useClientLogger";
import { gameUiConfigReducerPath, type GameUiConfigPartialReducerStateT } from "../reducers/GameUiConfigReducer";

export const httpProviderBaseQuery =
  (getHttpProvider: (apiUrl: string, isDevel: boolean) => HttpAdapter): BaseQueryFn<
    {
      url: string;
      method: 'GET' | 'POST' | 'PUT' | 'DELETE';
      data?: unknown;
    },
    unknown,
    ApiError
  > =>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async ({ url, method, data }, api: BaseQueryApi, extraOptions: object) => {
      const logger = useClientLogger();
      const state: GameUiConfigPartialReducerStateT = api.getState() as unknown as GameUiConfigPartialReducerStateT;
      const gameUiConfig: GameUiConfigT | null = state[gameUiConfigReducerPath].gameUiConfig;

      try {
        if (gameUiConfig === null) {
          // bug
          logger.error("Unexpected missing gameUiConfig in state");
          throw new Error("Unexpected missing gameUiConfig in state");
        }
        const httpProvider: HttpAdapter = getHttpProvider(gameUiConfig.apiUrl, gameUiConfig.isDevel);

        const result = await httpProvider.request({
          url,
          method,
          data,
        });

        return { data: result };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        return {
          error: {
            status: error?.status ?? 500,
            code: error?.code,
            message: error?.message,
          },
        };
      }
    };
