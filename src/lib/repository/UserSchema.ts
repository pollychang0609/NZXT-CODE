// ====================
// mongoose Schema 資料結構 = 資料庫結構
// ====================

import mongoose, { Document, Model, Schema } from "mongoose";
import { DATA_COLLECTION } from "./common";

/**
 * 使用者
 */
export interface IUser extends Document {
  /**
   * 員工編號
   */
  person_id: string;

  /**
   * 職稱
   */
  job_title: string;

  /**
   * 登入帳號
   */
  account: string;

  /**
   * 姓名
   */
  name: string;

  /**
   * 聯絡電話
   */
  tel: string;

  /**
   * 聯絡信箱
   */
  email: string;

  /**
   * 密碼
   */
  password: string;

  /**
   * 個人照片
   */
  image?: Buffer;

  /**
   * 啟用帳號與否
   */
  activated: boolean;

  /**
   * 背景專用使用者
   */
  hidden?: boolean;
}

export const UserSchema = new mongoose.Schema(
  {
    person_id: { type: String, required: true, unique: true },
    job_title: { type: String, required: true },
    account: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    tel: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: false },
    image: { type: Buffer, required: false },
    activated: { type: Boolean, required: false, default: true },
    hidden: { type: Boolean, required: false, default: false },
  },
  {
    timestamps: true,
    collection: DATA_COLLECTION.USERS,
  }
);
