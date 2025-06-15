export type AuthRepository = {
  hashPassword: (plain: string) => Promise<string>;
  comparePassword: (plain: string, hash: string) => Promise<boolean>;
  genereteToken: (
    userId: number,
    publicId: String,
    username: string,
    email: string,
  ) => Promise<string>;
};
