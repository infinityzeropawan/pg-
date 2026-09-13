export interface ManagerStudentUser {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
}
export interface ManagerStudentProfile {
  id: string;
  userId: string;
  propertyId: string;
  roomId?: string;
  bedId?: string;
  duesAmount: number;
  pgScore: number;
}
export interface ManagerStudentData {
  user?: ManagerStudentUser;
  profile: ManagerStudentProfile;
}