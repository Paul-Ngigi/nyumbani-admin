import { IUser } from "./user.interface";

export interface IApartment {
  _id: string;
  image?: string;
  name: string;
  phoneNumber: string;
  units: number;
  empty: number;
  rented: number;
  houseManagerId?: string;
  houseManager?: IUser;
  agentId?: string;
  agent?: IUser;
  physicalAddress?: string;
  postalCode?: string;
  postalAddress?: string;
  _timestamp: number;
  _utimestamp: number;
}
