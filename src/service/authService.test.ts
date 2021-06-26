import app from "../http/app";
import request from "supertest";

describe("# AuthService", function () {
  const envv: any = jest.createMockFromModule("../test/mock/env_local");
  const PROFILE_KEY = envv.PROFILE_KEY;

  it("should enterprise with device count correctly", async function (done) {
    // TODO:
    done();
  });
});
