import { Route, Tags, Post, Body } from "tsoa";
import { LoginRequest } from "../../model/auth/user";
import { Result } from "../../model/data";

@Route("auth")
@Tags("auth")
export class AuthController {
  /**
   * Login
   * @param body
   */
  @Post("login")
  public async login(@Body() body: LoginRequest): Promise<Result> {
    // PS: please see authService.authMiddleware
    /* istanbul ignore next */
    return {
      api_success: true,
      message: "OK_LOGIN", //body.username,
    };
  }

  /**
   * Logout
   */
  @Post("logout")
  public async logout(): Promise<Result> {
    // PS: please see authService.authMiddleware
    /* istanbul ignore next */
    return {
      api_success: false,
      message: "OK_LOGOUT", //body.username,
    };
  }
}
