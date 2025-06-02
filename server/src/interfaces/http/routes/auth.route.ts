import { Hono } from "hono";
import {
  authUser,
  LoginParams,
  RegisterParams,
  validateLogin,
  validateRegister,
  validateUserUpdate,
} from "../middleware/auth.middlware";
import { UserService } from "../../../domain/user/user.service";
import { userRepositoryImpl } from "../../../infrastructure/repositories/user.repositoryimpl";
import {
  createErrorResponse,
  createSuccessResponse,
} from "../../../shared/utils/response.util";
import { AuthService } from "../../../domain/auth/auth.service";
import { AuthRepositoryImpl } from "../../../infrastructure/repositories/auth.repositoryimpl";
import { Prisma } from "../../../../generated/prisma";
import { UpdateUserData } from "../../../domain/user/user.model";

// returning type from middleware
type Variables = {
  validateLoginData: LoginParams;
  validateRegisterData: RegisterParams;
  validateUserUpdate: UpdateUserData;
  userId: number;
};

// initialize services
const authservice = AuthService(
  UserService(userRepositoryImpl),
  AuthRepositoryImpl,
);

// initialize hono route
const authRoutes = new Hono<{ Variables: Variables }>();

authRoutes.post("/login", validateLogin, async (c) => {
  const validate = c.get("validateLoginData");
  try {
    const result = await authservice.login(validate);
    return c.json(createSuccessResponse("Success", result));
  } catch (error: any) {
    return c.json(createErrorResponse(error?.message), 400);
  }
});

authRoutes.post("/register", validateRegister, async (c) => {
  const validate = c.get("validateRegisterData");

  try {
    await authservice.register(validate);
    return c.json(createSuccessResponse("you successful registered"));
  } catch (error: any) {
    return c.json(createErrorResponse(error?.message), 400);
  }
});

authRoutes.get("/me", authUser, async (c) => {
  const userId = c.get("userId");
  try {
    const user = await authservice.me(userId);
    return c.json(createSuccessResponse("success", user));
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return c.json(createErrorResponse("Something wrong", error.message), 400);
    } else if (error instanceof Error) {
      return c.json(
        createErrorResponse("Something wrong", error?.message),
        400,
      );
    }
  }
});
authRoutes.put("/me", authUser, validateUserUpdate, async (c) => {
  const userId = c.get("userId");
  const validated = c.get("validateUserUpdate");
  try {
    const user = await authservice.updatUser(
      {
        username: validated.username,
        email: validated.email,
        password: validated.password,
      },
      userId,
    );
    return c.json(createSuccessResponse("success", user));
  } catch (error) {
    if (error instanceof Error) {
      return c.json(createErrorResponse(error.message), 400);
    }
  }
});

export { authRoutes };
