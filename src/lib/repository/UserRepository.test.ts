import mongoose, { Connection } from "mongoose";
import { UserRepository } from "./UserRepository";
import {
  UserCreateRequest,
  UserUpdateRequest,
} from "../../http/model/auth/user";

describe("# UserRepository", function () {
  const envv: any = jest.createMockFromModule("../../test/mock/env_local");
  const PROFILE_KEY = envv.PROFILE_KEY;

  let _userRepo: UserRepository;
  let _conn: Connection;
  // let image_url;

  const person_id = "00000",
    uuid = Math.random().toString(36).substring(7);

  beforeAll(async () => {
    const url = envv[PROFILE_KEY].MONGODB_URL;
    _conn = await (
      await mongoose.connect(url, { useNewUrlParser: true })
    ).connection;
    _userRepo = new UserRepository(_conn);
  });

  afterAll(function (done) {
    try {
      if (_conn.readyState == 1) {
        _conn.close();
      }
    } catch (err) {
      console.error(err);
    } finally {
      done();
    }
  });

  it("should create user with random person id correctly", async function (done) {
    // const uuid = Math.random().toString(36).substring(7);
    const new_one: UserCreateRequest = {
      person_id: uuid,
      job_title: "tester",
      account: uuid,
      name: uuid,
      tel: "0919999999",
      email: "iamname@test.com",
      password: "cb26cc3d8d44f9ca340e5f6b2231088d",
      activated: true,
    };

    const r = await _userRepo.create(new_one);
    expect(r.person_id).toBe(new_one.person_id);
    expect(r.job_title).toBe(new_one.job_title);
    expect(r.account).toBe(new_one.account);
    expect(r.name).toBe(new_one.name);
    expect(r.tel).toBe(new_one.tel);
    expect(r.password).toBe(new_one.password);
    expect(r.activated).toBe(new_one.activated);
    done();
  });

  it("should create user successfully", async function (done) {
    const new_one: UserCreateRequest = {
      person_id: person_id,
      job_title: "tester",
      account: "iamtester",
      name: "iamtestername",
      tel: "0919999999",
      email: "iamname@test.com",
      password: "cb26cc3d8d44f9ca340e5f6b2231088d",
      confirmPassword: "cb26cc3d8d44f9ca340e5f6b2231088d",
      activated: true,
    };
    const r = await _userRepo.create(new_one);
    expect(r.person_id).toBe(new_one.person_id);
    expect(r.job_title).toBe(new_one.job_title);
    expect(r.account).toBe(new_one.account);
    expect(r.name).toBe(new_one.name);
    expect(r.tel).toBe(new_one.tel);
    expect(r.password).toBe(new_one.password);
    expect(r.activated).toBe(new_one.activated);
    done();
  });

  it("should find user successfully", async function (done) {
    const query = { person_id };
    const r = await _userRepo.findBy(query);
    expect(r).not.toBeNull();
    expect(r.length).toBeGreaterThan(0);
    expect(r[0].person_id).toBe(query.person_id);
    done();
  });

  it("should create user unsuccessfully because of duplicate person_id", async function (done) {
    const new_one: UserCreateRequest = {
      person_id: person_id,
      job_title: "tester",
      account: "iamtester",
      name: "iamtestername",
      tel: "0919999999",
      email: "iamname@test.com",
      password: "cb26cc3d8d44f9ca340e5f6b2231088d",
      confirmPassword: "cb26cc3d8d44f9ca340e5f6b2231088d",
      activated: true,
    };
    try {
      const r = await _userRepo.create(new_one);
      console.info(`${JSON.stringify(r)}`);
    } catch (e) {
      // console.info(`${e}`)
      expect(e.message).toContain("duplicate key error");
    }
    done();
  });

  it("should create user unsuccessfully because of duplicate account", async function (done) {
    const new_one: UserCreateRequest = {
      person_id: "00000-new",
      job_title: "tester",
      account: "iamtester",
      name: "iamtestername",
      tel: "0919999999",
      email: "iamname@test.com",
      password: "cb26cc3d8d44f9ca340e5f6b2231088d",
      confirmPassword: "cb26cc3d8d44f9ca340e5f6b2231088d",
      activated: true,
    };
    try {
      const r = await _userRepo.create(new_one);
      console.info(`${JSON.stringify(r)}`);
    } catch (e) {
      // console.info(`${e}`)
      expect(e.message).toContain("duplicate key error");
    }
    done();
  });

  it("should update user successfully", async function (done) {
    const filter = { person_id };
    // console.info(`${JSON.stringify(exist_one)}`)
    const update_one: any = {
      person_id: person_id,
      job_title: "coder_update_new",
      account: "iamtester",
      name: "iamname",
      tel: "0919000000",
      email: "iamname@test.com.tw",
      image: "",
    };
    const r = await _userRepo.update(filter, update_one);
    // console.info(`${JSON.stringify(r)}`)
    expect(r.ok).toBe(1);
    expect(r.nModified).toBe(1);
    done();
  });

  it("should delete user successfully", async function (done) {
    const r1 = await _userRepo.delete({ person_id });
    expect(r1.ok).toBe(1);
    expect(r1.deletedCount).toBe(1);
    const r2 = await _userRepo.delete({ person_id: uuid });
    expect(r2.ok).toBe(1);
    expect(r2.deletedCount).toBe(1);
    done();
  });
});
