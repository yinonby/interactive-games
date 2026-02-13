
// user

export type UserIdT = string;

export type UserT = {
  userId: UserIdT,
  username?: string,
}

// account

export type AccountIdT = string;

export type AccountT = {
  accountId: AccountIdT,
  userId: UserIdT,
  nickname: string,
}
