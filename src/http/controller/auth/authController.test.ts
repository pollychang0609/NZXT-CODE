import mongoose from "mongoose";
import app from "../../app";
import request from "supertest";

describe("# Controller", function () {
  const envv: any = jest.createMockFromModule("../../../test/mock/env_local");
  const PROFILE_KEY = envv.PROFILE_KEY;
  const api_url = {
    login: `/api/v1/auth/login`,
    logout: `/api/v1/auth/logout`,
  };

  function connect(done) {
    mongoose.connection
      .on("error", console.log)
      // .on("disconnected", connect)
      .once("open", done);
    return mongoose.connect(
      envv[PROFILE_KEY].MONGODB_URL!,
      envv[PROFILE_KEY].MONGODB_OPTIONS
    );
  }

  beforeAll(async (done) => {
    connect(done);
  });

  afterAll((done) => {
    mongoose.disconnect();
    done();
  });

  it(
    "should login sccessfully",
    async function (done) {
      await request(app)
        .post(api_url.login)
        .send({
          username: envv[PROFILE_KEY].TESTER,
          password: envv[PROFILE_KEY].TESTER_PASSWORD,
        })
        .set("Accept", "application/json")
        .then((result) => {
          expect(result.status).toEqual(200);
          const body = result.body;
          // console.info(`${JSON.stringify(body)}`);
          expect(body.api_success).toBeTruthy();
          expect(body.message).toBe("OK_LOGIN");
          done();
        })
        .catch((err) => {
          console.error(err);
          done();
        });
    },
    15 * 1000
  ); //done

  it(
    "should logout sccessfully",
    async function (done) {
      await request(app)
        .post(api_url.logout)
        .send({
          username: envv[PROFILE_KEY].TESTER,
        })
        .set("Accept", "application/json")
        .then((result) => {
          expect(result.status).toEqual(200);
          const body = result.body;
          // console.info(`${JSON.stringify(body)}`);
          expect(body.api_success).toBeTruthy();
          expect(body.message).toBe("OK_LOGOUT");
          done();
        })
        .catch((err) => {
          console.error(err);
          done();
        });
    },
    15 * 1000
  ); //done

});
