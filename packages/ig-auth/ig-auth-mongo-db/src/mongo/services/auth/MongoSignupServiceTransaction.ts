
import type {
  SignupPluginTransactionAdapter,
  SignupServiceTransactionAdapter, UsersTableAdapter
} from '@ig/auth-be-models';
import type { AuthIdT, UserT } from '@ig/auth-models';
import {
  MongoTransaction,
  type MongoDbTransactionContext
} from '@ig/be-utils';

export class MongoSignupServiceTransaction implements SignupServiceTransactionAdapter {
  constructor(
    private readonly usersTableAdapter: UsersTableAdapter,
    private readonly signupPluginTransactionAdapter?: SignupPluginTransactionAdapter,
  ) {}

  async onSignup(user: UserT, nickname: string): Promise<AuthIdT> {
    const transaction = new MongoTransaction();
    const ctx: MongoDbTransactionContext = await transaction.start();
    await this.usersTableAdapter.createUser(user, ctx);

    let authId: AuthIdT;
    if (this.signupPluginTransactionAdapter !== undefined) {
      authId = await this.signupPluginTransactionAdapter.onSignupTransaction(user, nickname, ctx);
    } else {
      authId = user.userId as AuthIdT;
    }

    await transaction.execute();

    return authId;
  }
}
