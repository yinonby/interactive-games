
import { buildSchema, parse, print, validate } from 'graphql';
import { getMinimalGameConfigsQuery, updateGameConfigMutation } from './GameConfigGraphqlClientTypes';
import { gameConfigGraphqlTypeDefs } from './GameConfigGraphqlTypeDefs';

describe('GameConfigGraphqlClientTypes', () => {
  const sdl = print(gameConfigGraphqlTypeDefs);
  const schema = buildSchema(sdl);

  it('client query is valid against the GraphQL schema', () => {
    const document = parse(getMinimalGameConfigsQuery);
    const errors = validate(schema, document);

    expect(errors).toHaveLength(0);
  });

  it('client mutation is valid against the GraphQL schema', () => {
    const document = parse(updateGameConfigMutation);
    const errors = validate(schema, document);

    expect(errors).toHaveLength(0);
  });
});
