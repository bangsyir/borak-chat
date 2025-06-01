import { Hono } from "hono";
import {
  LoginParams,
  RegisterParams,
  validateLogin,
  validateRegister,
  authUser,
} from "../middleware/auth.middlware";
import { userService } from "../../../domain/user/user.service";
import { userRepositoryImpl } from "../../../infrastructure/repositories/user.repositoryimpl";
import {
  createErrorResponse,
  createSuccessResponse,
} from "../../../shared/utils/response.util";
import { authService } from "../../../domain/auth/auth.service";
import { authRepositoryImpl } from "../../../infrastructure/repositories/auth.repositoryimpl";
import { Prisma } from "../../../../generated/prisma";

type Variables = {
  validateLoginData: LoginParams;
  validateRegisterData: RegisterParams;
  userId: number;
};

const authRoutes = new Hono<{ Variables: Variables }>();

const authservice = authService(
  userService(userRepositoryImpl),
  authRepositoryImpl,
);

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

authRoutes.get("/me", async (c) => {
  const userId = c.get("userId");
  try {
    const user = await authservice.me(userId);
    return c.json(createSuccessResponse("success", user));
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return c.json(createErrorResponse("Something wrong", error.message), 400);
    } else {
      return c.json(
        createErrorResponse("Something wrong", error?.message),
        400,
      );
    }
  }
});

export { authRoutes };
