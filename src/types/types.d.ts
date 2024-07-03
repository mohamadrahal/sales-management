import { Target as PrismaTarget, Team, User } from "@prisma/client";

export interface Team {
  id: number;
  name: string;
  location: string;
  salesmenCount: number;
}

export interface Contract {
  id: number;
  salesmanId: number;
  type: ContractType;
  companyName: string;
  businessType: BusinessType;
  ownerName: string;
  ownerMobileNumber: string;
  companyMobileNumber: string;
  contactPersonName: string;
  contactPersonMobileNumber: string;
  bcdAccountNumber?: string; // Optional
  documentPath: string;
  status: Status; // "Pending", "Approved", "Declined"
  createdAt: Date;
  updatedAt: Date;
  salesman: User;
  branches: Branch[];
  contractReports: ContractReport[];
}

export enum ContractType {
  Subagent = "Subagent",
  Merchant = "Merchant",
  Both = "Both",
}

export enum BusinessType {
  Retail = "Retail",
  Wholesale = "Wholesale",
  FoodService = "FoodService",
  Manufacturing = "Manufacturing",
  Technology = "Technology",
  Healthcare = "Healthcare",
  FinancialServices = "FinancialServices",
  RealEstate = "RealEstate",
  Education = "Education",
  Transportation = "Transportation",
  Entertainment = "Entertainment",
  NonProfit = "NonProfit",
}

export enum Status {
  Pending = "Pending",
  Approved = "Approved",
  Declined = "Declined",
}

export interface Branch {
  id: number;
  contractId: number;
  name: string;
  phone: string;
  city: City;
  locationX: number;
  locationY: number;
}

export interface BranchFormData {
  name: string;
  phone: string;
  city: City;
  locationX: number;
  locationY: number;
}

export interface ContractReport {
  contractId: number;
  reportId: number;
}

export interface User {
  id: number;
  role: UserRole;
  username: string;
  password: string;
  teamId?: number;
  name: string;
  mobileNumber: string;
  bcdAccount?: string;
  evoAppId: string;
  nationalId: string;
}

export interface Branch {
  name: string;
  phone: string;
  city: City;
  locationX: number;
  locationY: number;
}

export enum UserRole {
  Admin = "Admin",
  SalesManager = "SalesManager",
  Salesman = "Salesman",
}

export enum City {
  Tripoli = "Tripoli",
  Benghazi = "Benghazi",
  Misrata = "Misrata",
  Bayda = "Bayda",
  Zawiya = "Zawiya",
  Khoms = "Khoms",
  Tobruk = "Tobruk",
  Ajdabiya = "Ajdabiya",
  Sebha = "Sebha",
  Sirte = "Sirte",
  Derna = "Derna",
  Zliten = "Zliten",
  Sabratha = "Sabratha",
  Ghat = "Ghat",
  Jalu = "Jalu",
}

export interface Target extends PrismaTarget {
  team?: Team;
  individual?: User;
}

export type ContractWithBranches = Contract & {
  branches: Branch[];
  salesman: User;
  contractReports: ContractReport[];
};

// types/types.ts

export enum ReportType {
  Contract = "Contract",
  Compensation = "Compensation",
}

export interface Report {
  id: number;
  type: ReportType;
  createdAt: Date;
  updatedAt: Date;
}
