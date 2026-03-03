
import { buildSchema, parse, print, validate } from 'graphql';
import {
  getMinimalPublicGameConfigsQuery,
  getPublicGameConfigQuery,
  getPublicGameConfigsQuery,
  updateGameConfigMutation
} from './GameConfigGraphqlClientTypes';
import { gameConfigGraphqlTypeDefs } from './GameConfigGraphqlTypeDefs';

describe('GameConfigGraphqlClientTypes', () => {
  const sdl = print(gameConfigGraphqlTypeDefs);
  const schema = buildSchema(sdl);

  it('get minimal public game configs query is valid against the GraphQL schema', () => {
    const document = parse(getMinimalPublicGameConfigsQuery);
    const errors = validate(schema, document);

    expect(errors).toHaveLength(0);
  });

  it('get public game configs query is valid against the GraphQL schema', () => {
    const document = parse(getPublicGameConfigsQuery);
    const errors = validate(schema, document);

    expect(errors).toHaveLength(0);
  });

  it('get public game config query is valid against the GraphQL schema', () => {
    const document = parse(getPublicGameConfigQuery);
    const errors = validate(schema, document);

    expect(errors).toHaveLength(0);
  });

  it('client mutation is valid against the GraphQL schema', () => {
    const document = parse(updateGameConfigMutation);
    const errors = validate(schema, document);

    expect(errors).toHaveLength(0);
  });
});
