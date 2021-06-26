import { UserRepository } from "../lib/repository/UserRepository";
import mongoose from "mongoose";

export class UserService {
  private static instance: UserService;
  private static userRepository: UserRepository;
  /* eslint-disable @typescript-eslint/no-empty-function */
  private constructor() {}
  /**
   * The static method that controls the access to the singleton instance
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around
   */
  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
      console.info("instance init");
    }
    if (!UserService.userRepository) {
      this.userRepository = new UserRepository(mongoose.connection);
      console.info("userRepository init");
    }
    return UserService.instance;
  }

  /**
   * 查詢使用者 via account
   * @param account
   * @returns
   */
  public async getUserByAccount(account: string) {
    return UserService.userRepository.findBy({ account });
  }

  /**
   * 查詢使用者 via _id
   * @param _id
   * @returns
   */
  public async getUserById(_id: string) {
    return UserService.userRepository.findBy({ _id });
  }

  /**
   * 查詢使用者 via name
   * @param name
   * @returns
   */
  public async getUserByName(name: string) {
    return UserService.userRepository.findBy({ name });
  }
}
