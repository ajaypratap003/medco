import { IUser, IErrorCodeMessage, IError } from "../Types";
import {
  UserSignUp_ErrorCode,
  StatusCode,
  UserSignUp_ErrorMessage,
} from "../error";

const validateUserForm = (user: IUser) => {
  let errors: IErrorCodeMessage[] = [];
  if (user) {
    const { username, email, firstname, number, password } = user;
    if (!username || username === "") {
      let err: IErrorCodeMessage = {
        errorCode: UserSignUp_ErrorCode.ERR_CODE_NO_USERNAME,
        errorMessage: UserSignUp_ErrorMessage.ERR_CODE_NO_USERNAME,
      };
      errors = [...errors, err];
    }
    if (!email || email === "") {
      let err: IErrorCodeMessage = {
        errorCode: UserSignUp_ErrorCode.ERR_CODE_NO_EMAIL,
        errorMessage: UserSignUp_ErrorMessage.ERR_CODE_NO_EMAIL,
      };
      errors = [...errors, err];
    }
    if (!firstname || firstname === "") {
      let err: IErrorCodeMessage = {
        errorCode: UserSignUp_ErrorCode.ERR_CODE_NO_FIRSTNAME,
        errorMessage: UserSignUp_ErrorMessage.ERR_CODE_NO_FIRSTNAME,
      };
      errors = [...errors, err];
    }
    if (!password || password === "") {
      let err: IErrorCodeMessage = {
        errorCode: UserSignUp_ErrorCode.ERR_CODE_NO_PASSWORD,
        errorMessage: UserSignUp_ErrorMessage.ERR_CODE_NO_PASSWORD,
      };
      errors = [...errors, err];
    }
    if (!number || number === "") {
      let err: IErrorCodeMessage = {
        errorCode: UserSignUp_ErrorCode.ERR_CODE_NO_CONTACT_NUMBER,
        errorMessage: UserSignUp_ErrorMessage.ERR_CODE_NO_CONTACT_NUMBER,
      };
      errors = [...errors, err];
    }
  }
  if (errors && errors.length > 0) {
    const error: IError = {
      statusCode: StatusCode.INVLAID,

      errorMessage: "Signup Form Validation Error",
      errors: errors,
    };
    return error;
  } else {
    return undefined;
  }
};

const validateUserDetail = (user: IUser) => {
  let errors: IErrorCodeMessage[] = [];
  if (user) {
    const { username, password } = user;
    if (!username || username === "") {
      let err: IErrorCodeMessage = {
        errorCode: UserSignUp_ErrorCode.ERR_CODE_NO_USERNAME,
        errorMessage: UserSignUp_ErrorMessage.ERR_CODE_NO_USERNAME,
      };
      errors = [...errors, err];
    }
    if (!password || password === "") {
      let err: IErrorCodeMessage = {
        errorCode: UserSignUp_ErrorCode.ERR_CODE_NO_PASSWORD,
        errorMessage: UserSignUp_ErrorMessage.ERR_CODE_NO_PASSWORD,
      };
      errors = [...errors, err];
    }
  }
  if (errors && errors.length > 0) {
    const error: IError = {
      statusCode: StatusCode.INVLAID,

      errorMessage: "Signup Form Validation Error",
      errors: errors,
    };
    return error;
  } else {
    return undefined;
  }
};

export { validateUserForm, validateUserDetail };
