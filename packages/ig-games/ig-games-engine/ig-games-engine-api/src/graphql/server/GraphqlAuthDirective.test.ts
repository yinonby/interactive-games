
import * as BeLib from '@ig/be-utils';
import type { GraphQLSchema } from 'graphql';
import {
  DEV_SPECIAL_AUTH_TOKEN_TMP_BYPASS,
  makeGamesGraphqlAuthDirectiveTransformer
} from './GraphqlAuthDirective';

describe('authDirective', () => {
  const makeGraphqlAuthDirectiveTransformerSpy = vi.spyOn(BeLib, 'makeGraphqlAuthDirectiveTransformer');

  it('allows access when user has required role', () => {
    // setup spies
    makeGraphqlAuthDirectiveTransformerSpy.mockReturnValue((schema: GraphQLSchema) => schema)
    makeGamesGraphqlAuthDirectiveTransformer();

    expect(makeGraphqlAuthDirectiveTransformerSpy).toHaveBeenCalled();

    // verify directiveName
    const directiveName = makeGraphqlAuthDirectiveTransformerSpy.mock.calls[0][0];
    expect(directiveName).toEqual('auth');

    // verify getUserHasRoleFn
    const userHasRoleFn = makeGraphqlAuthDirectiveTransformerSpy.mock.calls[0][1];
    expect(userHasRoleFn('invalidToken', 'systemAdmin')).toEqual(false);
    expect(userHasRoleFn(DEV_SPECIAL_AUTH_TOKEN_TMP_BYPASS, 'invalidRole')).toEqual(false);
    expect(userHasRoleFn(DEV_SPECIAL_AUTH_TOKEN_TMP_BYPASS, 'systemAdmin')).toEqual(true);
  });
});
