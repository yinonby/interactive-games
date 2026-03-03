
import { print } from 'graphql';
import { gql } from 'graphql-tag';
import { gamesGraphqlCommonTypeDefs, gamesGraphqlDirectiveTypeDefs } from '../common/GamesGraphqlCommonTypeDefs';

export const gameUserGraphqlTypesTypeDefs = gql`
  type PublicGameUser {
    gameUserId: ID!
    joinedGameConfigIds: [String!]!
  }
`;

export const gameUserGraphqlInputsTypeDefs = gql`
  input AddGameConfigIdInput {
    gameConfigId: ID!
  }

  type AddGameConfigIdResult {
    gameUserId: ID!
  }
`;

const gameUserGraphqlQueryTypeDefs = gql`
  type Query {
    getPublicGameUser: PublicGameUser!
  }
`;

const gameUserGraphqlMutationTypeDefs = gql`
  type Mutation {
    addGameConfigId(input: AddGameConfigIdInput!): AddGameConfigIdResult!
  }
`;

const gameUserGraphqlTypeDefsStr = [
  print(gamesGraphqlDirectiveTypeDefs),
  print(gamesGraphqlCommonTypeDefs),
  print(gameUserGraphqlTypesTypeDefs),
  print(gameUserGraphqlInputsTypeDefs),
  print(gameUserGraphqlQueryTypeDefs),
  print(gameUserGraphqlMutationTypeDefs),
].join('\n');

export const gameUserGraphqlTypeDefs = gql(gameUserGraphqlTypeDefsStr);
