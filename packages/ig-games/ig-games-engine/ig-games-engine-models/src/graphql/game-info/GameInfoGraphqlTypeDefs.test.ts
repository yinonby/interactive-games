
import { buildSchema, print } from 'graphql';
import { gameInfoGraphqlTypeDefs } from './GameInfoGraphqlTypeDefs';

describe('GameConfigGraphqlTypeDefs', () => {
  const sdl = print(gameInfoGraphqlTypeDefs);

  it('should build executable schema without errors', () => {
    expect(() => buildSchema(sdl)).not.toThrow();
  });
});
