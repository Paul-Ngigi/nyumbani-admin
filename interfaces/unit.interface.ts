import { IUser } from "./user.interface";

export interface IUnit {
  _id: string;
  number: string;
  occupant: IUser;
  accupantId: string;
  totalOccupants: number;
  occupants: IUser[];
  apartmentId: string;
  _timestamp: number;
  _utimestamp: number;
}
