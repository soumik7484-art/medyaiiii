import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface QueryLog {
    id: bigint;
    queryType: QueryType;
    summary: string;
    timestamp: bigint;
}
export interface PrescriptionAnalysis {
    dosage: string;
    confidenceLevel: string;
    notes: string;
    frequency: string;
    medicineName: string;
}
export interface ImageAnalysis {
    whatToDo: string;
    possibleCause: string;
    observation: string;
    disclaimer: string;
}
export interface UserProfile {
    displayName: string;
}
export interface MedicalAdvice {
    generalAdvice: string;
    possibleReasons: string;
    homeCareTips: Array<string>;
    disclaimer: string;
}
export enum QueryType {
    symptom = "symptom",
    prescription = "prescription",
    advice = "advice"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    analyzePrescription(prescriptionText: string): Promise<PrescriptionAnalysis>;
    analyzeSymptomImage(imageDescription: string): Promise<ImageAnalysis>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllQueries(): Promise<Array<QueryLog>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMedicalAdvice(symptoms: string): Promise<MedicalAdvice>;
    getQuery(id: bigint): Promise<QueryLog>;
    getRecentQueries(): Promise<Array<QueryLog>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    greet(name: string): Promise<string>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
