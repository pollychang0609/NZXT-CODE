import mongoose, { Model, Connection } from "mongoose";
import { DATA_COLLECTION } from "./common";
import { UserSchema, IUser } from "./UserSchema";

export class UserRepository {
  private readonly COLLECTION_NAME = DATA_COLLECTION.USERS;
  private readonly _userModel: Model<IUser>;
  private readonly _conn: Connection;

  constructor(conn: Connection) {
    this._conn = conn;
    this._userModel = mongoose.model<IUser>(
      this.COLLECTION_NAME,
      UserSchema,
      this.COLLECTION_NAME
    );
  }

  /**
   * 新增使用者(資料庫新增)
   * @param value
   * @returns
   */
  public async create(value: any) {
    return this._userModel.create(value);
  }

  /**
   * 查詢使用者(資料庫查詢)
   * @param value
   * @returns
   */
  public async findBy(filter: any): Promise<IUser[]> {
    return this._userModel.find(filter).exec();
  }

  /**
   * 刪除使用者(資料庫查詢)
   * @param value
   * @returns
   */
  public async delete(value: any) {
    return this._userModel.deleteOne(value);
  }

  /**
   * 更新使用者(資料庫查詢)
   * @param value
   * @returns
   */
  public async update(filter: any, value: any) {
    return this._userModel.updateOne(filter, value);
  }
}
