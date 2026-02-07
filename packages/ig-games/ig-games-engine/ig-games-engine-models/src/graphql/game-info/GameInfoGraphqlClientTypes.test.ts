
import { buildSchema, parse, print, validate } from 'graphql';
import { getMinimalGameInfosQuery } from './GameInfoGraphqlClientTypes';
import { gameInfoGraphqlTypeDefs } from './GameInfoGraphqlTypeDefs';

describe('GameConfigGraphqlClientTypes', () => {
  const sdl = print(gameInfoGraphqlTypeDefs);
  const schema = buildSchema(sdl);

  it('client query is valid against the GraphQL schema', () => {
    const document = parse(getMinimalGameInfosQuery);
    const errors = validate(schema, document);

    expect(errors).toHaveLength(0);
  });
});
