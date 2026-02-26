
import type { UserIdT } from '../../../../ig-auth-plugin/ig-auth-models';

export type AccountIdT = string;

export type AccountT = {
  accountId: AccountIdT,
  userId: UserIdT,
  nickname: string,
}
