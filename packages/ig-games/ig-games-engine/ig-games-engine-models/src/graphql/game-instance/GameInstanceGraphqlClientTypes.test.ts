
import { buildSchema, parse, print, validate } from 'graphql';
import {
  createGameInstanceInputMutation,
  getGameInstanceIdsForGameConfigQuery,
  getGameInstanceQuery,
  joinGameByInviteInputMutation,
  startPlayingInputMutation,
  submitGuessInputMutation
} from './GameInstanceGraphqlClientTypes';
import { gameInstanceGraphqlTypeDefs } from './GameInstanceGraphqlTypeDefs';

describe('GameInstanceGraphqlClientTypes', () => {
  const sdl = print(gameInstanceGraphqlTypeDefs);
  const schema = buildSchema(sdl);

  it('get game config instances query is valid against the GraphQL schema', () => {
    const document = parse(getGameInstanceIdsForGameConfigQuery);
    const errors = validate(schema, document);

    expect(errors).toHaveLength(0);
  });

  it('get game instance query is valid against the GraphQL schema', () => {
    const document = parse(getGameInstanceQuery);
    const errors = validate(schema, document);

    expect(errors).toHaveLength(0);
  });

  it('create game instance is valid against the GraphQL schema', () => {
    const document = parse(createGameInstanceInputMutation);
    const errors = validate(schema, document);

    expect(errors).toHaveLength(0);
  });

  it('add player mutation is valid against the GraphQL schema', () => {
    const document = parse(joinGameByInviteInputMutation);
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
