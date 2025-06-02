export interface CreateUserData {
  username: string;
  email?: string;
  password: string;
}

export interface UpdateUserData {
  username: string;
  email: string;
  password: string;
}
