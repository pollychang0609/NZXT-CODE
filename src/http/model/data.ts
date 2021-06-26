import HttpStatusCode from "./HttpStatusCode";

/**
 * @typedef Result
 */
export interface Result {
  api_success: boolean;
  message?: string;
  isWarning?: boolean;
  data?: any;
  extra?: any;
  action?: string; // "redirect"
  url?: string;
}

/**
 * @typedef APIMsgResponse
 * @description API reponse
 * @property {boolean} api_success
 * @property {string} message
 */
export interface APIMsgResponse {
  /**
   * status
   */
  api_success: boolean;
  /**
   * message
   */
  message: string;
}

/**
 * @typedef APIDataResponse
 * @description API reponse
 * @property {boolean} api_success
 * @property {*} data
 */
export interface APIDataResponse {
  /**
   * status
   */
  api_success: boolean;
  /**
   * data
   */
  data: unknown;
}

/**
 * @typedef AxiosDataResponse
 * @description Convert the Axios response
 * @property {import ('./HttpStatusCode')} status
 * @property {*} headers
 * @property {*} data
 */
export interface AxiosDataResponse {
  /**
   * HTTP status code
   */
  status: HttpStatusCode;

  /**
   * HTTP Headers
   */
  headers: unknown;

  /**
   * Response data
   */
  data: unknown;
}
