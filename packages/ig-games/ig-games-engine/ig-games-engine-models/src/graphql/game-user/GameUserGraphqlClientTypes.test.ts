
import { buildSchema, parse, print, validate } from 'graphql';
import {
  addGameConfigIdInputMutation,
  getPublicGameUserQuery,
} from './GameUserGraphqlClientTypes';
import { gameUserGraphqlTypeDefs } from './GameUserGraphqlTypeDefs';

describe('GameInstanceGraphqlClientTypes', () => {
  const sdl = print(gameUserGraphqlTypeDefs);
  const schema = buildSchema(sdl);

  it('getPublicGameUserQuery is valid against the GraphQL schema', () => {
    const document = parse(getPublicGameUserQuery);
    const errors = validate(schema, document);

    expect(errors).toHaveLength(0);
  });

  it('addGameConfigIdInputMutation is valid against the GraphQL schema', () => {
    const document = parse(addGameConfigIdInputMutation);
    const errors = validate(schema, document);

    expect(errors).toHaveLength(0);
  });
});
