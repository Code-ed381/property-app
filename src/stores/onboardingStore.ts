import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface OnboardingData {
  // Step 1: Personal Info
  full_name: string;
  date_of_birth: string;
  current_address: string;
  
  // Step 2: Rental History
  previous_landlord: string;
  previous_landlord_phone: string;
  previous_rent_amount: string; // Stored as string in form, parsed to number on submit
  reason_for_leaving: string;
  
  // Step 3: Employment
  employer_name: string;
  employer_address: string;
  employer_phone: string;
  monthly_income_range: string;
  employment_length: string;
  additional_income_source: string;
  additional_income_amount: string;
  
  // Step 4: References
  reference_name: string;
  reference_relationship: string;
  reference_phone: string;
  emergency_name: string;
  emergency_relationship: string;
  emergency_phone: string;
  
  // Step 5: Additional Info
  has_eviction_history: boolean;
  eviction_explanation: string;
  has_pets: boolean;
  pet_details: string;
  is_smoker: boolean;
  number_of_occupants: number;
  vehicle_info: string;
  
  // Step 6: Consent
  consent_background_check: boolean;
  declaration_accurate: boolean;
  signature_url: string; // Data URL from canvas
}

const defaultData: OnboardingData = {
  full_name: "",
  date_of_birth: "",
  current_address: "",
  
  previous_landlord: "",
  previous_landlord_phone: "",
  previous_rent_amount: "",
  reason_for_leaving: "",
  
  employer_name: "",
  employer_address: "",
  employer_phone: "",
  monthly_income_range: "",
  employment_length: "",
  additional_income_source: "",
  additional_income_amount: "",
  
  reference_name: "",
  reference_relationship: "",
  reference_phone: "",
  emergency_name: "",
  emergency_relationship: "",
  emergency_phone: "",
  
  has_eviction_history: false,
  eviction_explanation: "",
  has_pets: false,
  pet_details: "",
  is_smoker: false,
  number_of_occupants: 1,
  vehicle_info: "",
  
  consent_background_check: false,
  declaration_accurate: false,
  signature_url: "",
};

interface OnboardingStore {
  currentStep: number;
  data: OnboardingData;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateData: (partialData: Partial<OnboardingData>) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      currentStep: 1,
      data: defaultData,
      setStep: (step) => set({ currentStep: step }),
      nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 7) })),
      prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
      updateData: (partialData) => set((state) => ({ 
        data: { ...state.data, ...partialData } 
      })),
      reset: () => set({ currentStep: 1, data: defaultData }),
    }),
    {
      name: 'pilas-onboarding-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
