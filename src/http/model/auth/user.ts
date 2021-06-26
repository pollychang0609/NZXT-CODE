export interface LoginRequest {
  account: string;
  password: string;
}

/**
 * 新增使用者
 */
export interface UserCreateRequest {
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
   * 確認密碼
   */
  confirmPassword?: string;

  /**
   * 個人照片
   */
  image?: Buffer;

  /**
   * 啟用帳號與否
   */
  activated?: boolean;
}

/**
 * 更新使用者
 */
export interface UserUpdateRequest {
  /**
   * ID
   */
  _id: string;

  /**
   * 員工編號
   */
  person_id?: string;

  /**
   * 職稱
   */
  job_title?: string;

  /**
   * 登入帳號
   */
  account?: string;

  /**
   * 姓名
   */
  name?: string;

  /**
   * 聯絡電話
   */
  tel?: string;

  /**
   * 聯絡信箱
   */
  email?: string;

  /**
   * 密碼
   */
  password?: string;

  /**
   * 確認密碼
   */
  confirmPassword?: string;

  /**
   * 個人照片
   */
  image?: string;
}

/**
 * 刪除使用者
 */
export interface UserDeleteRequest {
  /**
   * ID
   */
  _id: string;
}

/**
 * AuthService專用
 */
export interface User {
  /**
   * ID
   */
  _id: string;

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
  account?: string;

  /**
   * 姓名
   */
  name?: string;

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
   * 確認密碼
   */
  confirmPassword: string;

  /**
   * 個人照片
   */
  image: string;
}
