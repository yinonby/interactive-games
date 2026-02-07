
import { print } from 'graphql';
import { gql } from 'graphql-tag';
import { gamesGraphqlCommonTypeDefs, gamesGraphqlDirectiveTypeDefs } from '../common/GamesGraphqlCommonTypeDefs';

export const gameInfoGraphqlTypesTypeDefs = gql`
  enum GameInfoKind {
    jointGame
  }

  interface GameInfoNoIdInterface {
    kind: GameInfoKind!
    gameName: String!
    maxDurationInfo: DurationInfo!
    gamePriceInfo: PriceInfo!
    maxParticipants: Int!
    imageInfo: ImageInfo!
    extraTimeMinutes: Int!
    extraTimeLimitDurationInfo: DurationInfo!
    levelExposedConfigs: [LevelExposedConfig!]!
  }

  type GameInfoNoId implements GameInfoNoIdInterface {
    kind: GameInfoKind!
    gameName: String!
    maxDurationInfo: DurationInfo!
    gamePriceInfo: PriceInfo!
    maxParticipants: Int!
    imageInfo: ImageInfo!
    extraTimeMinutes: Int!
    extraTimeLimitDurationInfo: DurationInfo!
    levelExposedConfigs: [LevelExposedConfig!]!
  }

  type GameInfo implements GameInfoNoIdInterface {
    gameConfigId: ID!
    kind: GameInfoKind!
    gameName: String!
    maxDurationInfo: DurationInfo!
    gamePriceInfo: PriceInfo!
    maxParticipants: Int!
    imageInfo: ImageInfo!
    extraTimeMinutes: Int!
    extraTimeLimitDurationInfo: DurationInfo!
    levelExposedConfigs: [LevelExposedConfig!]!
  }

  type LevelExposedConfig {
    levelName: String
  }
`;

const gameInfoGraphqlQueryTypeDefs = gql`
  type Query {
    getGameInfos: [GameInfo!]!
  }
`;

const gameInfoGraphqlTypeDefsStr = [
  print(gamesGraphqlDirectiveTypeDefs),
  print(gamesGraphqlCommonTypeDefs),
  print(gameInfoGraphqlTypesTypeDefs),
  print(gameInfoGraphqlQueryTypeDefs),
].join('\n');

export const gameInfoGraphqlTypeDefs = gql(gameInfoGraphqlTypeDefsStr);
