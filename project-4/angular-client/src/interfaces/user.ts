export interface IuserDetail {
  firstName: string;
  lastName: string;
  email: string;
  billingAddress: { city: string; street: string };
  role: 'admin' | 'user';
}
export interface IuserRegistrationDetail {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  billingAddress: { city: string; street: string };
}

export interface IuserWithAccessToken {
  user: IuserDetail;
  token: string;
}
