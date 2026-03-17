import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface FarmerProfile {
    about: string;
    name: string;
    contactEmail: string;
    location: string;
    contactPhone: string;
}
export interface FarmPhoto {
    id: string;
    order: bigint;
    caption: string;
    blobId: Uint8Array;
    farmId: string;
}
export interface Farm {
    id: string;
    created: bigint;
    productionCapacity: number;
    acreage: number;
    name: string;
    description: string;
    certifications: Array<string>;
    pondCount: bigint;
    species: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addFarmPhoto(photo: FarmPhoto): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    claimAdmin(): Promise<boolean>;
    createFarm(farm: Farm): Promise<void>;
    deleteFarm(farmId: string): Promise<void>;
    deleteFarmPhoto(photoId: string): Promise<void>;
    getAllFarms(): Promise<Array<Farm>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFarmById(farmId: string): Promise<Farm | null>;
    getFarmerProfile(): Promise<FarmerProfile | null>;
    getPhotosByFarmId(farmId: string): Promise<Array<FarmPhoto>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    safeIsCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateFarm(farm: Farm): Promise<void>;
    updateFarmPhoto(photo: FarmPhoto): Promise<void>;
    updateFarmerProfile(profile: FarmerProfile): Promise<void>;
}
