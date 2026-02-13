
import { print } from 'graphql';
import { gql } from 'graphql-tag';

const authGraphqlQueryTypeDefs = gql`
  type Query {
    _health: Boolean!
  }
`;

const authGraphqlMutationTypeDefs = gql`
  type Mutation {
    guestLogin: GuestLoginResult!
    emailLogin(input: EmailLoginInput!): EmailLoginResult!
  }

  type GuestLoginResult {
    accountId: String!
  }

  input EmailLoginInput {
    email: String!
    password: String!
  }

  type EmailLoginResult {
    accountId: String!
  }
`;

const authGraphqlTypeDefsStr = [
  print(authGraphqlQueryTypeDefs),
  print(authGraphqlMutationTypeDefs),
].join('\n');

export const authGraphqlTypeDefs = gql(authGraphqlTypeDefsStr);
