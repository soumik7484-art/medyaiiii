import { useMutation } from "@tanstack/react-query";
import type {
  ImageAnalysis,
  MedicalAdvice,
  PrescriptionAnalysis,
} from "../backend.d";
import { useActor } from "./useActor";

export function useAnalyzePrescription() {
  const { actor } = useActor();
  return useMutation<PrescriptionAnalysis, Error, string>({
    mutationFn: async (prescriptionText: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.analyzePrescription(prescriptionText);
    },
  });
}

export function useAnalyzeSymptomImage() {
  const { actor } = useActor();
  return useMutation<ImageAnalysis, Error, string>({
    mutationFn: async (imageDescription: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.analyzeSymptomImage(imageDescription);
    },
  });
}

export function useGetMedicalAdvice() {
  const { actor } = useActor();
  return useMutation<MedicalAdvice, Error, string>({
    mutationFn: async (symptoms: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.getMedicalAdvice(symptoms);
    },
  });
}
