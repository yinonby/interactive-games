
import type { UserIdT } from '@ig/engine-models';

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
  userId: UserIdT,
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
      userId
    }
  }
`;

export type EmailLoginInputT = {
  email: string,
  password: string,
}

export type EmailLoginResultDataT = {
  userId: UserIdT,
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
      userId
    }
  }
`;
