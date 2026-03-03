
import { extractAppErrorCodeFromUnknownObject, type ModelT } from '@ig/app-engine-ui';
import { type PublicGameUserT } from '@ig/games-engine-models';
import { useGetPublicGameUserQuery } from './GameUserRtkApi';

export type GameUserModelDataT = {
  publicGameUser: PublicGameUserT,
};

export type GameUserModelT = ModelT<GameUserModelDataT>;

export const useGameUserModel = (): GameUserModelT => {
  const {
    isLoading: getPublicGameUser_isLoading,
    isError: getPublicGameUser_isError,
    error: getPublicGameUser_error,
    data: getPublicGameUser_data
  } = useGetPublicGameUserQuery();

  if (getPublicGameUser_isLoading) {
    return {
      isLoading: true,
      isError: false,
    }
  } else if (getPublicGameUser_isError) {
    return {
      isLoading: false,
      isError: true,
      appErrCode: extractAppErrorCodeFromUnknownObject(getPublicGameUser_error),
    }
  } else if (getPublicGameUser_data === undefined) {
    return {
      isLoading: false,
      isError: true,
      appErrCode: "appError:invalidResponse",
    }
  }

  return {
    isLoading: false,
    isError: false,
    data: {
      publicGameUser: getPublicGameUser_data.publicGameUser,
    }
  }
}
