export interface CreateUserData {
  publicId: string;
  username: string;
  email?: string;
  password: string;
}

export interface UpdateUserData {
  username: string;
  email: string;
  password: string;
}
