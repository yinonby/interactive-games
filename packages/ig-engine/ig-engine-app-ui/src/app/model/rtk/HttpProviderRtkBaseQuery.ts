
import type { HttpAdapter } from '@ig/client-utils/src/types/HttpProvider';
import type { BaseQueryApi, BaseQueryFn } from '@reduxjs/toolkit/query';
import type { AppRtkErrorT } from "../../../types/AppRtkTypes";
import type { GameUiConfigT } from "../../../types/GameUiConfigTypes";
import { useClientLogger } from "../../providers/useClientLogger";
import { gameUiConfigReducerPath, type GameUiConfigPartialReducerStateT } from "../reducers/GameUiConfigReducer";
import { extractAppRtkError } from "./AppRtkUtils";

export const httpProviderBaseQuery =
  (getHttpProvider: (apiUrl: string, isDevel: boolean) => HttpAdapter): BaseQueryFn<
    {
      url: string;
      method: 'GET' | 'POST' | 'PUT' | 'DELETE';
      data?: unknown;
    },
    unknown,
    AppRtkErrorT
  > =>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async ({ url, method, data }, api: BaseQueryApi, extraOptions: object) => {
      const logger = useClientLogger();
      const state: GameUiConfigPartialReducerStateT = api.getState() as unknown as GameUiConfigPartialReducerStateT;
      // here we cannot access useAppConfig() because this is not a component context
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
      } catch (error: unknown) {
        if (gameUiConfig && !gameUiConfig.isTesting) {
          logger.error("An error ocurred", error);
        }
        return { error: extractAppRtkError(error) };
      }
    };
