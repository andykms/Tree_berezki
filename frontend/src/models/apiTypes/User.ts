export interface IUser {
  id: string;
  name: string;
  sex: "male" | "female" | "not specified";
  email: string;
  phone: string;
  avatar: string;
}