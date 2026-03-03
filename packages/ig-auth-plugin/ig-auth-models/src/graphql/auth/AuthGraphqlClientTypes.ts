

// query

import type { AuthIdT } from '../../user/AuthTypes';

export const healthQuery = `
  query Health {
    _health
  }
`;

export type HealthQuryResultT = {
  _health: boolean,
}

// mutation

export type GuestLoginInputT = {
  nickname: string,
}

export type GuestLoginResultDataT = {
  authId: AuthIdT,
}

export type GuestLoginResultT = {
  guestLoginResult: GuestLoginResultDataT,
}

export type GuestLoginResponseT = {
  data: GuestLoginResultT,
}

export const guestLoginMutation = `
  mutation GuestLogin($input: GuestLoginInput!) {
    guestLoginResult: guestLogin(input: $input) {
      authId
    }
  }
`;

export type EmailLoginInputT = {
  email: string,
  password: string,
}

export type EmailLoginResultDataT = {
  authId: AuthIdT,
}

export type EmailLoginResultT = {
  emailLoginResult: EmailLoginResultDataT,
}

export type EmailLoginResponseT = {
  data: EmailLoginResultT,
}

export const emailLoginMutation = `
  mutation EmailLogin($input: EmailLoginInput!) {
    emailLoginResult: emailLogin(input: $input) {
      authId
    }
  }
`;
