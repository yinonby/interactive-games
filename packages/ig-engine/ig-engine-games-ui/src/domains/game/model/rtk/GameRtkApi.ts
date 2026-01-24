
import { appRtkApi } from "@ig/engine-app-ui";
import type {
  GameConfigIdT,
  GetGameInstancesResponseT
} from "@ig/engine-models";

const gameRtkApi = appRtkApi.injectEndpoints({
  endpoints: (builder) => ({
    getGameInstances: builder.query<GetGameInstancesResponseT, GameConfigIdT>({
      query: (gameConfigId: GameConfigIdT) => ({
        url: `/games/game/${gameConfigId}/game-instance-ids`,
        method: 'GET',
      }),
      providesTags: (result, error, gameConfigId) => [{ type: 'GameTag', id: gameConfigId }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetGameInstancesQuery,
  util: gameRtkApiUtil,
  endpoints: gameRtkApiEndpoints,
  reducer: gameRtkApiReducer,
  middleware: gameRtkApiMiddleware,
} = gameRtkApi;

export type UseGetGameInstancesQueryResultT = ReturnType<typeof useGetGameInstancesQuery>;
