
import { buildSchema, print } from 'graphql';
import { gameUserGraphqlTypeDefs } from './GameUserGraphqlTypeDefs';

describe('GameUserGraphqlTypeDefs', () => {
  const sdl = print(gameUserGraphqlTypeDefs);

  it('should build executable schema without errors', () => {
    expect(() => buildSchema(sdl)).not.toThrow();
  });
});
