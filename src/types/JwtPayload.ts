import { Role } from '../orm/entities/users/types';

export type JwtPayload = {
  id: number;
  role: Role;
};
