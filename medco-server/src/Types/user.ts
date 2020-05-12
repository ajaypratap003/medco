interface IUser {
  username: string;
  firstname: string;
  lastname?: string;
  email: string;
  number: string;
  password: string;
}
interface IUserResponseVO {
  username: string;
  firstname: string;
  lastname?: string;
  email: string;
  number: string;
}
export { IUser, IUserResponseVO };
