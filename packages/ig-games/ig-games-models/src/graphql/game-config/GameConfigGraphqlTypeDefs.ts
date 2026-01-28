
import { print } from 'graphql';
import { gql } from 'graphql-tag';
import { gamesGraphqlCommonTypeDefs, gamesGraphqlDirectiveTypeDefs } from '../common/GamesGraphqlCommonTypeDefs';

const gameConfigGraphqlEnumTypeDefs = gql`
  enum GameConfigKind {
    jointGame
  }
`;

const gameConfigGraphqlQueryTypeDefs = gql`
  type Query {
    getGameConfigs: [GameConfig!]!
  }

  type LevelExposedConfig {
    levelName: String
  }

  type GameConfig {
    gameConfigId: ID!
    kind: GameConfigKind!
    gameName: String!
    maxDurationInfo: DurationInfo!
    gamePriceInfo: PriceInfo!
    maxParticipants: Int!
    imageInfo: ImageInfo!
    extraTimeMinutes: Int!
    extraTimeLimitDurationInfo: DurationInfo!
    levelConfigs: [LevelExposedConfig!]!
  }
`;

const gameConfigGraphqlMutationTypeDefs = gql`
  type Mutation {
    updateGameConfig(input: UpdateGameConfigInput!): UpdateGameConfigResult! @auth(requires: gamesSystemAdmin)
  }

  input LevelExposedConfigInput {
    levelName: String
  }

  input UpdateGameConfigInput {
    gameConfigId: ID!
    kind: GameConfigKind
    gameName: String
    maxDurationInfo: DurationInfoInput
    gamePriceInfo: PriceInfoInput
    maxParticipants: Int
    imageInfo: ImageInfoInput
    extraTimeMinutes: Int
    extraTimeLimitDurationInfo: DurationInfoInput
    levelConfigs: [LevelExposedConfigInput!]
  }

  type UpdateGameConfigResult {
    status: UpdateStatus!
  }
`;

const gameConfigGraphqlTypeDefsStr = [
  print(gamesGraphqlDirectiveTypeDefs),
  print(gamesGraphqlCommonTypeDefs),
  print(gameConfigGraphqlEnumTypeDefs),
  print(gameConfigGraphqlQueryTypeDefs),
  print(gameConfigGraphqlMutationTypeDefs),
].join('\n');

export const gameConfigGraphqlTypeDefs = gql(gameConfigGraphqlTypeDefsStr);
