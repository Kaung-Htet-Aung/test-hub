import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface GeneratedQuestion {
  id: string;
  question: string;
  type: "multiple-choice" | "short-answer" | "coding";
  difficulty: "easy" | "medium" | "hard";
  options?: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
}

export interface QuestionGenerationForm {
  jobField: string;
  language: string;
  experienceLevel: string;
  numberOfQuestions: number;
}

interface QuestionGenerationState {
  // Form state
  formData: QuestionGenerationForm;
  generationMode: "ai" | "manual";

  // Question states
  generatedQuestions: GeneratedQuestion[];
  editingQuestions: GeneratedQuestion[];
  manualQuestions: GeneratedQuestion[];

  // UI states
  loading: boolean;
  showResults: boolean;
  isEditing: boolean;

  // Actions
  // Form actions
  updateFormData: (
    field: keyof QuestionGenerationForm,
    value: string | number
  ) => void;
  setFormData: (data: Partial<QuestionGenerationForm>) => void;
  resetFormData: () => void;
  setGenerationMode: (mode: "ai" | "manual") => void;

  // Question actions
  setGeneratedQuestions: (questions: GeneratedQuestion[]) => void;
  addGeneratedQuestion: (question: GeneratedQuestion) => void;
  updateGeneratedQuestion: (
    id: string,
    updates: Partial<GeneratedQuestion>
  ) => void;
  deleteGeneratedQuestion: (id: string) => void;

  setEditingQuestions: (questions: GeneratedQuestion[]) => void;
  updateEditingQuestion: (
    id: string,
    updates: Partial<GeneratedQuestion>
  ) => void;
  updateEditingOption: (
    questionId: string,
    optionIndex: number,
    value: string
  ) => void;
  addEditingOption: (questionId: string) => void;
  removeEditingOption: (questionId: string, optionIndex: number) => void;

  setManualQuestions: (questions: GeneratedQuestion[]) => void;
  addManualQuestion: () => void;
  removeManualQuestion: (index: number) => void;
  updateManualQuestion: (
    index: number,
    updates: Partial<GeneratedQuestion>
  ) => void;
  updateManualOption: (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => void;
  addManualOption: (questionIndex: number) => void;
  removeManualOption: (questionIndex: number, optionIndex: number) => void;

  // UI actions
  setLoading: (loading: boolean) => void;
  setShowResults: (show: boolean) => void;
  setIsEditing: (editing: boolean) => void;
  startEditing: () => void;
  cancelEditing: () => void;

  // Utility actions
  reset: () => void;
  clearQuestions: () => void;
}

const initialFormData: QuestionGenerationForm = {
  jobField: "",
  language: "",
  experienceLevel: "",
  numberOfQuestions: 5,
};

const initialManualQuestion: GeneratedQuestion = {
  id: `manual-${Date.now()}-0`,
  question: "",
  type: "multiple-choice",
  difficulty: "medium",
  options: ["", "", "", ""],
  correctAnswer: "",
  explanation: "",
  points: 1,
};

const initialState = {
  formData: initialFormData,
  generationMode: "ai" as const,
  generatedQuestions: [],
  editingQuestions: [],
  manualQuestions: [initialManualQuestion],
  loading: false,
  showResults: false,
  isEditing: false,
};

export const useQuestionGenerationStore = create<QuestionGenerationState>()(
  devtools(
    (set) => ({
      ...initialState,

      // Form actions
      updateFormData: (field, value) =>
        set((state) => ({
          formData: { ...state.formData, [field]: value },
        })),

      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      resetFormData: () => set({ formData: initialFormData }),

      setGenerationMode: (mode) => set({ generationMode: mode }),

      // Generated questions actions
      setGeneratedQuestions: (questions) =>
        set({ generatedQuestions: questions }),

      addGeneratedQuestion: (question) =>
        set((state) => ({
          generatedQuestions: [...state.generatedQuestions, question],
        })),

      updateGeneratedQuestion: (id, updates) =>
        set((state) => ({
          generatedQuestions: state.generatedQuestions.map((q) =>
            q.id === id ? { ...q, ...updates } : q
          ),
        })),

      deleteGeneratedQuestion: (id) =>
        set((state) => ({
          generatedQuestions: state.generatedQuestions.filter(
            (q) => q.id !== id
          ),
        })),

      // Editing questions actions
      setEditingQuestions: (questions) => set({ editingQuestions: questions }),

      updateEditingQuestion: (id, updates) =>
        set((state) => ({
          editingQuestions: state.editingQuestions.map((q) =>
            q.id === id ? { ...q, ...updates } : q
          ),
        })),

      updateEditingOption: (questionId, optionIndex, value) =>
        set((state) => ({
          editingQuestions: state.editingQuestions.map((q) => {
            if (q.id === questionId && q.options) {
              const newOptions = [...q.options];
              newOptions[optionIndex] = value;
              return { ...q, options: newOptions };
            }
            return q;
          }),
        })),

      addEditingOption: (questionId) =>
        set((state) => ({
          editingQuestions: state.editingQuestions.map((q) => {
            if (q.id === questionId && q.options && q.options.length < 8) {
              return { ...q, options: [...q.options, ""] };
            }
            return q;
          }),
        })),

      removeEditingOption: (questionId, optionIndex) =>
        set((state) => ({
          editingQuestions: state.editingQuestions.map((q) => {
            if (q.id === questionId && q.options && q.options.length > 2) {
              return {
                ...q,
                options: q.options.filter((_, i) => i !== optionIndex),
              };
            }
            return q;
          }),
        })),

      // Manual questions actions
      setManualQuestions: (questions) => set({ manualQuestions: questions }),

      addManualQuestion: () =>
        set((state) => {
          const newQuestion: GeneratedQuestion = {
            id: `manual-${Date.now()}-${state.manualQuestions.length}`,
            question: "",
            type: "multiple-choice",
            difficulty: "medium",
            options: ["", "", "", ""],
            correctAnswer: "",
            explanation: "",
            points: 1,
          };
          return { manualQuestions: [...state.manualQuestions, newQuestion] };
        }),

      removeManualQuestion: (index) =>
        set((state) => {
          if (state.manualQuestions.length > 1) {
            return {
              manualQuestions: state.manualQuestions.filter(
                (_, i) => i !== index
              ),
            };
          }
          return state;
        }),

      updateManualQuestion: (index, updates) =>
        set((state) => ({
          manualQuestions: state.manualQuestions.map((q, i) =>
            i === index ? { ...q, ...updates } : q
          ),
        })),

      updateManualOption: (questionIndex, optionIndex, value) =>
        set((state) => ({
          manualQuestions: state.manualQuestions.map((q, i) => {
            if (i === questionIndex && q.options) {
              const newOptions = [...q.options];
              newOptions[optionIndex] = value;
              return { ...q, options: newOptions };
            }
            return q;
          }),
        })),

      addManualOption: (questionIndex) =>
        set((state) => ({
          manualQuestions: state.manualQuestions.map((q, i) => {
            if (i === questionIndex && q.options && q.options.length < 8) {
              return { ...q, options: [...q.options, ""] };
            }
            return q;
          }),
        })),

      removeManualOption: (questionIndex, optionIndex) =>
        set((state) => ({
          manualQuestions: state.manualQuestions.map((q, i) => {
            if (i === questionIndex && q.options && q.options.length > 2) {
              return {
                ...q,
                options: q.options.filter(
                  (_, optIndex) => optIndex !== optionIndex
                ),
              };
            }
            return q;
          }),
        })),

      // UI actions
      setLoading: (loading) => set({ loading }),

      setShowResults: (show) => set({ showResults: show }),

      setIsEditing: (editing) => set({ isEditing: editing }),

      startEditing: () =>
        set((state) => ({
          isEditing: true,
          editingQuestions: state.generatedQuestions.map((q) => ({ ...q })),
        })),

      cancelEditing: () =>
        set({
          isEditing: false,
          editingQuestions: [],
        }),

      // Utility actions
      reset: () => set(initialState),

      clearQuestions: () =>
        set({
          generatedQuestions: [],
          editingQuestions: [],
          manualQuestions: [initialManualQuestion],
          showResults: false,
          isEditing: false,
        }),
    }),
    {
      name: "question-generation-store",
    }
  )
);
