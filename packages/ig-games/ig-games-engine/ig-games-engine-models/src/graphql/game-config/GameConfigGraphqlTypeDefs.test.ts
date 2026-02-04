
import { buildSchema, print } from 'graphql';
import { gameConfigGraphqlTypeDefs } from './GameConfigGraphqlTypeDefs';

describe('GameConfigGraphqlTypeDefs', () => {
  const sdl = print(gameConfigGraphqlTypeDefs);

  it('should build executable schema without errors', () => {
    expect(() => buildSchema(sdl)).not.toThrow();
  });
});
