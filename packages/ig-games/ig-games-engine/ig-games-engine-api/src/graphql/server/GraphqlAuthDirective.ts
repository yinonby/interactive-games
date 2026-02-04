
import { makeGraphqlAuthDirectiveTransformer, type GraphqlSchemaTransformerT } from '@ig/be-utils';

export const DEV_SPECIAL_AUTH_TOKEN_TMP_BYPASS = '5dd96f9f-bb05-4034-b095-5819ad6e3fce';

function userHasRole(authToken: string, requiredRole: string): boolean {
  const roles = ['systemAdmin'];

  if (!roles.includes(requiredRole)) {
    return false;
  }
  if (authToken === DEV_SPECIAL_AUTH_TOKEN_TMP_BYPASS) {
    return true;
  }

  // TODO implement authorization
  return false;
}

export const makeGamesGraphqlAuthDirectiveTransformer = (): GraphqlSchemaTransformerT =>
  makeGraphqlAuthDirectiveTransformer('auth', userHasRole);
