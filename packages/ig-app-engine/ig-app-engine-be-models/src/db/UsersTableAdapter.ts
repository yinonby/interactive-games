
import type { UserIdT, UserT } from '../../../ig-app-engine-models';

export interface UsersTableAdapter {
  getUsers(): Promise<UserT[]>;
  getUser(userId: UserIdT): Promise<UserT | null>;
  createUser(user: UserT): Promise<void>;
}
