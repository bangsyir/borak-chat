export type AuthRepository = {
  hashPassword: (plain: string) => Promise<string>;
  comparePassword: (plain: string, hash: string) => Promise<boolean>;
  genereteToken: (userId: number) => Promise<string>;
};
