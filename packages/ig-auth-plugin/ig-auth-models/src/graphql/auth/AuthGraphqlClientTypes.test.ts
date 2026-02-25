
import { buildSchema, parse, print, validate } from 'graphql';
import { emailLoginMutation, guestLoginMutation, healthQuery } from './AuthGraphqlClientTypes';
import { authGraphqlTypeDefs } from './AuthGraphqlTypeDefs';

describe('GameConfigGraphqlClientTypes', () => {
  const sdl = print(authGraphqlTypeDefs);
  const schema = buildSchema(sdl);

  it('health query is valid against the GraphQL schema', () => {
    const document = parse(healthQuery);
    const errors = validate(schema, document);

    expect(errors).toHaveLength(0);
  });

  it('guestLogin mutation is valid against the GraphQL schema', () => {
    const document = parse(guestLoginMutation);
    const errors = validate(schema, document);

    expect(errors).toHaveLength(0);
  });

  it('emailLogin mutation is valid against the GraphQL schema', () => {
    const document = parse(emailLoginMutation);
    const errors = validate(schema, document);

    expect(errors).toHaveLength(0);
  });
});
