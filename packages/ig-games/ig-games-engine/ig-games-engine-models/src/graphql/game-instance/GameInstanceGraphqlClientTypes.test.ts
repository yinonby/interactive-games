
import { buildSchema, parse, print, validate } from 'graphql';
import {
  addPlayerInputMutation,
  getGameConfigInstanceIdsQuery,
  getGameInstanceQuery,
  startPlayingInputMutation,
  submitGuessInputMutation
} from './GameInstanceGraphqlClientTypes';
import { gameInstanceGraphqlTypeDefs } from './GameInstanceGraphqlTypeDefs';

describe('GameInstanceGraphqlClientTypes', () => {
  const sdl = print(gameInstanceGraphqlTypeDefs);
  const schema = buildSchema(sdl);

  it('get game config instances query is valid against the GraphQL schema', () => {
    const document = parse(getGameConfigInstanceIdsQuery);
    const errors = validate(schema, document);

    expect(errors).toHaveLength(0);
  });

  it('get game instance query is valid against the GraphQL schema', () => {
    const document = parse(getGameInstanceQuery);
    const errors = validate(schema, document);

    expect(errors).toHaveLength(0);
  });

  it('add player mutation is valid against the GraphQL schema', () => {
    const document = parse(addPlayerInputMutation);
    const errors = validate(schema, document);

    expect(errors).toHaveLength(0);
  });

  it('start playing mutation is valid against the GraphQL schema', () => {
    const document = parse(startPlayingInputMutation);
    const errors = validate(schema, document);

    expect(errors).toHaveLength(0);
  });

  it('submit guess mutation is valid against the GraphQL schema', () => {
    const document = parse(submitGuessInputMutation);
    const errors = validate(schema, document);

    expect(errors).toHaveLength(0);
  });
});
