export interface IUser  {
  email: string
  _id: string
  firstName?: string
  postalAddress?: string
  telephone1?: string
  telephone2?: string
  username?: string
  lastName?: string
  organisationID: string
  uid: string
  roles: IRole[]
  location?: Location
  active: boolean
  approved: boolean
  _date?: Date
  _timestamp: number
  _utimestamp?: number
  token?: string
  iat?: number
  exp?: number
  jti?: string
}


export interface IRole {
  admin?: boolean
  superadmin?: boolean
  client?: boolean
  agent?: boolean
}

export interface Location {
  _id: any
  name: string
  locationName: any
  imageUrl: any
}

export interface Date {
  $date: string
}
