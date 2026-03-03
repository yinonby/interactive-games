
import type { AuthLogicAdapter } from '@ig/auth-be-models';
import type { EmailLoginInputT, EmailLoginResultDataT, GuestLoginInputT, GuestLoginResultDataT } from '@ig/auth-models';
import type { Response } from 'express';
import type { ApolloContextT } from '../../types/AuthPluginTypes';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createAuthResolvers = (authLogicAdapter: AuthLogicAdapter): any => ({
  Query: {
    // eslint-disable-next-line @typescript-eslint/require-await
    _health: async (): Promise<boolean> => {
      return true;
    },
  },

  Mutation: {
    guestLogin: async (
      parent: unknown,
      args: { input: GuestLoginInputT },
      context: ApolloContextT,
    ): Promise<GuestLoginResultDataT> => {
      const { input } = args;
      const authId = await authLogicAdapter.guestLogin(context.res, input.nickname);

      return {
        authId,
      }
    },

    emailLogin: async (
      parent: unknown,
      args: { input: EmailLoginInputT },
      context: { res: Response },
    ): Promise<EmailLoginResultDataT> => {
      const { input } = args;
      const authId = await authLogicAdapter.emailLogin(input, context.res);

      return {
        authId,
      }
    },
  }
});
