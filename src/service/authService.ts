import { UserRepository } from "../lib/repository/UserRepository";
import session from "express-session";
import passport from "passport";
import { Strategy as localStrategy } from "passport-local";
import cfg from "../cfg";
import { User } from "../http/model/auth/user";
import { enc } from "../lib/util/aes";
import { UserService } from "./userService";
import { IUser } from "../lib/repository/UserSchema";
// import MongoStore from "connect-mongo";

initPassport();

export class AuthService {
  public static getCurrentUserName(request: any): string {
    let userName;
    if (request) {
      userName = request.session.userName
        ? request.session.userName + ""
        : null;

      if (!userName) {
        const user = request.session.user;
        if (user) {
          userName = user.name;
        }
      }
      if (!userName) {
        userName = request.query.userName;
      }
    }
    return userName;
  }

  public static getCurrentUser(request: any, forceLoad = false): IUser {
    if (request && request.session) {
      const user = request.session.user;
      // console.info(`${forceLoad} getCurrentUser \n ${JSON.stringify(user)} \n`)
      if (forceLoad) {
        const instance = UserService.getInstance();
        const obj: IUser = instance.getUserById(user._id)[0];
        return obj;
      } else {
        return user;
      }
    } else {
      /* eslint-disable @typescript-eslint/ban-ts-comment */
      // @ts-ignore
      return null;
    }
  }

  public static async getByAccount(
    account: string,
    errWhenNotFound = false
  ): Promise<IUser> {
    const instance = UserService.getInstance();
    const result: IUser[] = await instance.getUserByAccount(account);
    if (errWhenNotFound && !result) {
      throw Error("No data found");
    }

    return result[0];
  }

  public static async getById(
    _id: string,
    errWhenNotFound = false
  ): Promise<IUser> {
    const instance = UserService.getInstance();
    const result: IUser[] = await instance.getUserById(_id);
    if (errWhenNotFound && !result) {
      throw Error("No data found");
    }
    return result[0];
  }

  public static async getByName(
    name: string,
    errWhenNotFound = false
  ): Promise<IUser> {
    const instance = UserService.getInstance();
    const result: IUser[] = await instance.getUserByName(name);
    if (errWhenNotFound && !result) {
      throw Error("No data found");
    }
    return result[0];
  }
}

function initPassport() {
  const fetchUser = (() => {
    return async function (username, password, id) {
      // console.log("[auth.fetchUser.name]", username);
      // console.log("[auth.fetchUser.password]", username);
      // console.log("[auth.fetchUser.id]", id);
      let user;
      if (id) {
        user = AuthService.getById("id", id); // FIXME: Not verify yet
        console.log("[auth.fetchUser.id]", id);
      } else {
        user = AuthService.getByAccount(username);
      }
      return user ? user : false;
    };
  })();

  // 可設定要將哪些 user 資訊，儲存在 Session 中的 passport.user
  passport.serializeUser(function (user, done) {
    console.info(`serializeUser ${JSON.stringify(user)}`);
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    done(null, user.id);
  });

  //   可藉由從 Session 中獲得的資訊去撈該 user 的資料
  passport.deserializeUser(async function (id, done) {
    console.info(`deserializeUser ${id}`);
    try {
      const user = await fetchUser(null, null, id);
    } catch (err) {
      console.error("deserializeUser failure", err);
      done(err);
    }
  });

  passport.use(
    new localStrategy(function (username, password, done) {
      // admin!23 = cb26cc3d8d44f9ca340e5f6b2231088d
      function checkPwd(username, password, dbPassword) {
        const enc_pwd = enc(password);
        return enc_pwd == dbPassword;
      }
      fetchUser(username, password, null)
        .then(function (user) {
          if (user && checkPwd(username, password, user.password)) {
            done(null, user);
          } else {
            done(null, false);
          }
        })
        .catch(function (err) {
          console.error("fetchUser failure", err);
          done(err);
        });
    })
  );
}

export function initSession(app) {
  app.use(
    session({
      secret: "M8pTktbH9NstfvWgKAdNbYbN", // FIXME, change
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 2 * 60 * 1000 }, // 2 分鐘到期 FIXME: 上線應該為 30 分鐘
    })
  );
}

/**
 * init Auth Middleware
 * @param app
 * @param seesionKey
 */
export function initAuth(app) {
  // sessions
  // app.keys = [backendCfg.session.key]
  // let cfg = $c.clone(backendCfg.session)

  // app.use(sessionMiddleware(cfg, app)) // case 2: support whitelist

  // init passport
  app.use(passport.initialize());
  app.use(passport.session());

  // add auth Middleware
  app.use(authMiddleware());
}

// --------------------
// auth Middleware
// --------------------
export function authMiddleware() {
  const LOG_MODULE = "access",
    LOG_LOGIN = "login",
    LOG_LOGIN_SUCCESS = "Login {0} successfully.",
    LOG_LOGIN_FAIL = "Login {0} failure.",
    LOG_LOGOUT = "logout",
    LOG_LOGOUT_SUCCESS = "Logout {0} successfully.";

  const loginUrl = "/api/v1/auth/login",
    logoutUrl = "/api/v1/auth/logout",
    captchaUrl = "/api/v1/auth/captcha",
    loginPage = "/login.html",
    successPage = "/index.html";

  return async (req: any, res: any, next: any) => {
    const path = req.path,
      isAuth = req.session.isAuthenticated,
      isAjax = _isAjax(req),
      isTest = _isTest(req);
    console.info(`[auth] path=${path}, isAuth=${isAuth}, isAjax=${isAjax}`);

    // 3. login page
    if (path === loginPage) {
      return next();
    }
    // 4. login action
    else if (path === loginUrl) {
      return passport.authenticate(
        "local",
        async function (err, user, info, status) {
          // console.info(`${JSON.stringify(user)}`) //FIXME:REMOVE
          if (user && !user.activated) {
            if (isAjax) {
              ajaxError(req, res, "FAIL_ACCOUNT_ACTIVATED");
            } else {
              loginError(
                req,
                res,
                "FAIL_ACCOUNT_ACTIVATED",
                "fail-no-activate"
              );
            }
            return;
          }

          if (user) {
            // login Success
            // login by call passport

            const sessionUser = {};
            // Object assign will all prpoerty
            if (user._doc) {
              Object.assign(sessionUser, user._doc);
            } else {
              Object.assign(sessionUser, user);
            }

            // @ts-ignore
            delete sessionUser.password;
            // @ts-ignore
            delete sessionUser.confirmPassword;

            req.session.account = user.account;
            req.session.userName = user.name;

            req.session.user = sessionUser;
            req.session.isAuthenticated = true;
            // add cookie
            const offset = (user["offset"] = req.body.offset);

            if (isAjax) {
              console.info("isAjax Success");
              ajaxSuccess(
                req,
                res,
                "OK_LOGIN",
                LOG_LOGIN,
                LOG_LOGIN_SUCCESS,
                user.name
              );
            } else {
              loginSuccess(req, res);
            }
            return;
          } else {
            // login failure
            if (isAjax) {
              ajaxError(req, res, "FAIL_INCORRECT_PASSWORD");
            } else {
              loginError(req, res, "FAIL_INCORRECT_PASSWORD", "fail-password");
            }
            return;
          }
        }
      )(req, res, next);
    }
    // 5. logout action
    else if (path === logoutUrl) {
      const userName = AuthService.getCurrentUserName(req);
      // console.info(`logout-${userName}`);
      if (isAjax) {
        res.clearCookie("connect.sid");
        delete req.session.isAuthenticated;
        // console.info(`ajax-logout ${JSON.stringify(req.session)}`);
        ajaxSuccess(
          req,
          res,
          "OK_LOGOUT",
          LOG_LOGOUT,
          LOG_LOGOUT_SUCCESS,
          userName
        );
      } else {
        res.clearCookie("connect.sid");
        delete req.session.isAuthenticated;
        console.info(`logout ${JSON.stringify(req.session)}`);
        logoutSuccess(req, res, userName);
      }
      return;
    }

    // 6. check RBAC
    let errMsg = "FAIL_LOGIN";
    if (isAuth) {
      // logined
      const user = AuthService.getCurrentUser(req);
      if (user && !user.activated) {
        errMsg = "FAIL_ACCOUNT_ACTIVATED";
      } else {
        return next(); // requset PASS !!
      }
    }

    // 7. CICD runner
    if (isTest && process.env.NODE_ENV === "test") {
      return next(); // requset PASS !!
    }

    // 8. not login yet
    console.info("path=" + path + " isAjax=" + isAjax);
    if (isAjax) {
      ajaxError(req, res, errMsg, false);
    } else {
      loginError(req, res, "FAIL_LOGIN", "fail-no-session", false);
    }
  };

  //
  //
  //
  function _isAjax(req) {
    return (
      (req.get("content-type") || "").includes("application/json") ||
      req.get("accept") === "application/json" ||
      req.get("x-requested-with") === "XMLHttpRequest"
    );
  }

  function _isTest(req) {
    return req.get("cicd") === "true";
  }

  function ajaxError(req, res, msg, needLog = true) {
    if (needLog) {
      const username = req.body.username;
      const reason = msg.message ? msg.message : msg;
      return res
        .status(403)
        .json({ api_success: false, message: reason })
        .end();
      // TODO operation log
      // opLog(ctx.request, LOG_MODULE, LOG_LOGIN, _msg(isCli, LOG_LOGIN_FAIL + ' ' + reason), false, username)
    } else {
      return res.status(403).json({ api_success: false, message: msg }).end();
    }
  }

  function ajaxSuccess(req, res, msg, log_action, logMsg, username) {
    // TODO operation log
    // opLog(ctx.request, LOG_MODULE, log_action, _msg(isCli, logMsg), true, username)
    // res.statusCode = 200;
    // res.body = msg;
    return res.status(200).json({ api_success: true, message: msg }).end();
  }

  function logoutSuccess(req, res, username) {
    // opLog(ctx.request, LOG_MODULE, LOG_LOGOUT, _msg(isCli, LOG_LOGOUT_SUCCESS), true, username)
    res.redirect(loginPage);
  }

  function loginSuccess(req, res) {
    const username = req.body.username;
    // TODO operation log
    // opLog(ctx.request, LOG_MODULE, LOG_LOGIN, _msg(isCli, LOG_LOGIN_SUCCESS), true, username)
    res.redirect(successPage);
  }

  function loginError(req, res, error, link_anchor, needLog = true) {
    if (needLog) {
      const username = req.body.username;
      const reason = error.message ? error.message : error;
      // TODO opLog
      // opLog(ctx.request, LOG_MODULE, LOG_LOGIN, _msg(isCli, LOG_LOGIN_FAIL + ' ' + reason), false, username)
    }
    res.redirect(loginPage);
  }
}
