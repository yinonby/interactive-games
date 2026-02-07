
import { print } from 'graphql';
import { gql } from 'graphql-tag';
import { gamesGraphqlCommonTypeDefs, gamesGraphqlDirectiveTypeDefs } from '../common/GamesGraphqlCommonTypeDefs';
import { gameInfoGraphqlTypesTypeDefs } from '../game-info/GameInfoGraphqlTypeDefs';

const gameConfigGraphqlTypesTypeDefs = gql`
  type GameConfig {
    gameConfigId: ID!
    gameInfoNoId: GameInfoNoId!
  }
`;

const gameConfigGraphqlQueryTypeDefs = gql`
  type Query {
    getGameConfigs: [GameConfig!]! @auth(requires: gamesSystemAdmin)
  }
`;

const gameConfigGraphqlMutationTypeDefs = gql`
  type Mutation {
    updateGameConfig(input: UpdateGameConfigInput!): UpdateGameConfigResult! @auth(requires: gamesSystemAdmin)
  }

  input UpdateGameConfigInput {
    gameConfigId: ID!
    gameInfoNoId: GameInfoNoIdInput!
  }

  input GameInfoNoIdInput {
    kind: GameInfoKind
    gameName: String
    maxDurationInfo: DurationInfoInput
    gamePriceInfo: PriceInfoInput
    maxParticipants: Int
    imageInfo: ImageInfoInput
    extraTimeMinutes: Int
    extraTimeLimitDurationInfo: DurationInfoInput
    levelExposedConfigs: [LevelExposedConfigInput!]
  }

  input LevelExposedConfigInput {
    levelName: String
  }

  type UpdateGameConfigResult {
    status: UpdateStatus!
  }
`;

const gameConfigGraphqlTypeDefsStr = [
  print(gamesGraphqlDirectiveTypeDefs),
  print(gamesGraphqlCommonTypeDefs),
  print(gameInfoGraphqlTypesTypeDefs),
  print(gameConfigGraphqlTypesTypeDefs),
  print(gameConfigGraphqlQueryTypeDefs),
  print(gameConfigGraphqlMutationTypeDefs),
].join('\n');

export const gameConfigGraphqlTypeDefs = gql(gameConfigGraphqlTypeDefsStr);
