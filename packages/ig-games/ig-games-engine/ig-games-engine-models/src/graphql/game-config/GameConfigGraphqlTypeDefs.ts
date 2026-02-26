
import { print } from 'graphql';
import { gql } from 'graphql-tag';
import { gamesGraphqlCommonTypeDefs, gamesGraphqlDirectiveTypeDefs } from '../common/GamesGraphqlCommonTypeDefs';

export const gameConfigGraphqlTypesTypeDefs = gql`
  enum GameConfigKind {
    jointGame
  }

  type LevelExposedConfig {
    levelName: String
  }

  type MinimalPublicGameConfig {
    gameConfigId: ID!
    kind: GameConfigKind!
    gameName: String!
    maxDurationInfo: DurationInfo!
    gamePriceInfo: PriceInfo!
    maxParticipants: Int!
    imageInfo: ImageInfo!
  }

  type PublicGameConfig {
    gameConfigId: ID!
    kind: GameConfigKind!
    gameName: String!
    maxDurationInfo: DurationInfo!
    gamePriceInfo: PriceInfo!
    maxParticipants: Int!
    imageInfo: ImageInfo!
    extraTimeMinutes: Int!
    extraTimeLimitDurationInfo: DurationInfo!
    levelExposedConfigs: [LevelExposedConfig!]!
  }

  enum SolutionKind {
    textSolution
  }

  type FixedGameSolution {
    kind: SolutionKind
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
    levelExposedConfigs: [LevelExposedConfig!]!
    fixedGameSolution: FixedGameSolution
  }
`;

const gameConfigGraphqlQueryTypeDefs = gql`
  type Query {
    getGameConfigs: [GameConfig!]! @auth(requires: gamesSystemAdmin)
    getMinimalPublicGameConfigs: [MinimalPublicGameConfig!]!
    getPublicGameConfigs: [PublicGameConfig!]!
  }
`;

const gameConfigGraphqlMutationTypeDefs = gql`
  type Mutation {
    updateGameConfig(input: UpdateGameConfigInput!): UpdateGameConfigResult! @auth(requires: gamesSystemAdmin)
  }

  input UpdateGameConfigInput {
    gameConfigId: ID!
    partialGameConfigNoId: PartialGameConfigNoIdInput!
  }

  input PartialGameConfigNoIdInput {
    kind: GameConfigKind
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
  print(gameConfigGraphqlTypesTypeDefs),
  print(gameConfigGraphqlQueryTypeDefs),
  print(gameConfigGraphqlMutationTypeDefs),
].join('\n');

export const gameConfigGraphqlTypeDefs = gql(gameConfigGraphqlTypeDefsStr);
