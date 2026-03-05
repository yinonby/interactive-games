
import type { AuthLogicAdapter } from '@ig/auth-be-models';
import type {
  EmailLoginInputT, EmailLoginResultDataT,
  GetLoginInfoResultDataT, GuestLoginInputT, GuestLoginResultDataT
} from '@ig/auth-models';
import type { Response } from 'express';
import type { AuthGraphqlContextT } from '../../types/AuthInternalTypes';

type QueryResolvers = {
  getLoginInfo: (
    parent: unknown,
    args: unknown,
    context: AuthGraphqlContextT,
  ) => Promise<GetLoginInfoResultDataT>,
};

type MutationResolvers = {
  guestLogin: (
    parent: unknown,
    args: { input: GuestLoginInputT },
    context: AuthGraphqlContextT,
  ) => Promise<GuestLoginResultDataT>,

  emailLogin: (
    parent: unknown,
    args: { input: EmailLoginInputT },
    context: { res: Response },
  ) => Promise<EmailLoginResultDataT>,
};

type AuthResolvers = {
  Query: QueryResolvers,
  Mutation: MutationResolvers,
};

export const createAuthResolvers = (
  authLogicAdapter: AuthLogicAdapter,
): AuthResolvers => ({
  Query: {
    // eslint-disable-next-line @typescript-eslint/require-await
    getLoginInfo: async (
      parent: unknown,
      args: unknown,
      context: AuthGraphqlContextT,
    ): Promise<GetLoginInfoResultDataT> => {
      return {
        authId: context.reqAuthId,
      };
    },
  },

  Mutation: {
    guestLogin: async (
      parent: unknown,
      args: { input: GuestLoginInputT },
      context: AuthGraphqlContextT,
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
