import { User } from 'src/modules/users/entities/user.entity';

export type TUser = Omit<User, 'password'>;

export type TUserPayload = {
  id: number;
  username: string;
};
export type TUserRequest = { user: TUserPayload };
export type TToken = { access_token: string };
