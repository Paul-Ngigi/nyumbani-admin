import { IUser } from "./user.interface";

export interface IOrganisation {
  _id: string;
  name: string;
  adminId: string;
  board_no: string;
  organisationId: string;
  isActive: boolean;
  founderId: string;
  founder: IUser;
  _date: Date;
  _timestamp: number;
}

export interface Date {
  $date: Date2;
}

export interface Date2 {
  $numberLong: string;
}

export interface Timestamp {
  $numberLong: string;
}
