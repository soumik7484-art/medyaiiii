import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MedicalAdvice {
    generalAdvice: string;
    possibleReasons: string;
    homeCareTips: Array<string>;
    disclaimer: string;
}
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
export enum QueryType {
    symptom = "symptom",
    prescription = "prescription",
    advice = "advice"
}
export interface backendInterface {
    _initializeAccessControlWithSecret(userSecret: string): Promise<void>;
    analyzePrescription(prescriptionText: string): Promise<PrescriptionAnalysis>;
    analyzeSymptomImage(imageDescription: string): Promise<ImageAnalysis>;
    getAllQueries(): Promise<Array<QueryLog>>;
    getMedicalAdvice(symptoms: string): Promise<MedicalAdvice>;
    getQuery(id: bigint): Promise<QueryLog>;
    getRecentQueries(): Promise<Array<QueryLog>>;
}
