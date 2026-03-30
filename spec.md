# MedyAI – Prescription Reader, Symptom Analyzer, Medical Advice Rebuild

## Current State
- DashboardPage has three tabs: Medical Report Reader, Vision Scanner, Medical Chatbot
- PrescriptionTab.tsx: accepts text input only, analyzes prescription keywords
- SymptomTab.tsx: accepts text description only, analyzes symptom keywords
- AdviceTab.tsx: text-based, returns possibleReasons + generalAdvice + homeCareTips
- VisionScannerTab.tsx: accepts image upload + text description, analyzes via keyword on description
- ReportReaderTab.tsx: multi-file-type reader (PDF/image/doc/text)
- VoiceButton.tsx: TTS for all sections
- AuthContext.tsx: login/register with Internet Identity
- Backend: analyzePrescription(text), analyzeSymptomImage(text), getMedicalAdvice(text)

## Requested Changes (Diff)

### Add
- Image upload UI to Prescription Reader tab (upload/drag-drop, preview thumbnail)
- Image upload UI to Symptom/Scar Analyzer tab (upload/drag-drop, preview thumbnail)
- Confidence badge to Prescription result (High/Medium/Low with colors)
- Structured output for Symptom tab: Observation / Possible Cause / What to Do sections
- Disclaimer on every result card
- Voice (TTS) button on every result section

### Modify
- DashboardPage: Replace tabs with "Prescription Reader" / "Symptom Analyzer" / "Medical Advice"
- Tab icons and descriptions to reflect new sections
- PrescriptionTab: Replace textarea with image upload zone; image preview; extract text from filename+description to simulate OCR; send to backend
- SymptomTab: Replace textarea with image upload zone + optional description input; send description to backend
- AdviceTab: Keep text input, improve result card layout with icons, make disclaimer more prominent
- Welcome hero subtitle updated to reflect new feature set

### Remove
- ReportReaderTab.tsx (no longer needed as a main tab)
- VisionScannerTab.tsx (replaced by SymptomTab with image upload)
- ChatbotTab.tsx reference from DashboardPage (replaced by AdviceTab)
- Old tab references in DashboardPage

## Implementation Plan
1. Update DashboardPage.tsx: new tab config (prescription/symptom/advice), updated descriptions
2. Rewrite PrescriptionTab.tsx: image upload zone, thumbnail preview, OCR simulation from filename+description, structured result card with confidence badge, disclaimer, voice button
3. Rewrite SymptomTab.tsx: image upload zone, optional description textarea, thumbnail preview, 3-section result (Observation/Possible Cause/What to Do), disclaimer, voice button
4. Update AdviceTab.tsx: improve layout, prominent disclaimer, voice button stays
5. Keep VoiceButton.tsx unchanged
6. Keep AuthContext, ProtectedRoute, LoginPage, ProfileSetupPage unchanged
7. Keep backend unchanged (already has all required endpoints)
