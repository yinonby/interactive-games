
import type { AccountIdT } from '@ig/app-engine-models';

// query

export const healthQuery = `
  query Health {
    _health
  }
`;

export type HealthQuryResultT = {
  _health: boolean,
}

// mutation

export type GuestLoginResultDataT = {
  accountId: AccountIdT,
}

export type GuestLoginResultT = {
  guestLoginResult: GuestLoginResultDataT,
}

export type GuestLoginResponseT = {
  data: GuestLoginResultT,
}

export const guestLoginMutation = `
  mutation GuestLogin {
    guestLoginResult: guestLogin {
      accountId
    }
  }
`;

export type EmailLoginInputT = {
  email: string,
  password: string,
}

export type EmailLoginResultDataT = {
  accountId: AccountIdT,
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
      accountId
    }
  }
`;
