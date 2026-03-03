
import { buildSchema, print } from 'graphql';
import { gameInstanceGraphqlTypeDefs } from './GameInstanceGraphqlTypeDefs';

describe('GameInstanceGraphqlTypeDefs', () => {
  const sdl = print(gameInstanceGraphqlTypeDefs);

  it('should build executable schema without errors', () => {
    expect(() => buildSchema(sdl)).not.toThrow();
  });
});
