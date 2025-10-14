import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { User, Test, Question, Subject, StudentGroup } from "../types";

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // UI state
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  theme: "light" | "dark";

  // Data cache
  tests: Test[];
  questions: Question[];
  subjects: Subject[];
  groups: StudentGroup[];

  // Actions
  setUser: (user: User | null) => void;
  setIsAuthenticated: (authenticated: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setTheme: (theme: "light" | "dark") => void;

  // Data actions
  setTests: (tests: Test[]) => void;
  addTest: (test: Test) => void;
  updateTest: (testId: string, updates: Partial<Test>) => void;
  deleteTest: (testId: string) => void;

  setQuestions: (questions: Question[]) => void;
  addQuestion: (question: Question) => void;
  updateQuestion: (questionId: string, updates: Partial<Question>) => void;
  deleteQuestion: (questionId: string) => void;

  setSubjects: (subjects: Subject[]) => void;
  addSubject: (subject: Subject) => void;
  updateSubject: (subjectId: string, updates: Partial<Subject>) => void;
  deleteSubject: (subjectId: string) => void;

  setGroups: (groups: StudentGroup[]) => void;
  addGroup: (group: StudentGroup) => void;
  updateGroup: (groupId: string, updates: Partial<StudentGroup>) => void;
  deleteGroup: (groupId: string) => void;

  // Utility actions
  reset: () => void;
  clearCache: () => void;
}

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  theme: "light",
  tests: [],
  questions: [],
  subjects: [],
  groups: [],
};

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        // User actions
        setUser: (user) => set({ user }),
        setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
        setIsLoading: (isLoading) => set({ isLoading }),

        // UI actions
        setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
        setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
        setTheme: (theme) => set({ theme }),

        // Test actions
        setTests: (tests) => set({ tests }),
        addTest: (test) => set((state) => ({ tests: [...state.tests, test] })),
        updateTest: (testId, updates) =>
          set((state) => ({
            tests: state.tests.map((test) =>
              test.id === testId ? { ...test, ...updates } : test
            ),
          })),
        deleteTest: (testId) =>
          set((state) => ({
            tests: state.tests.filter((test) => test.id !== testId),
          })),

        // Question actions
        setQuestions: (questions) => set({ questions }),
        addQuestion: (question) =>
          set((state) => ({ questions: [...state.questions, question] })),
        updateQuestion: (questionId, updates) =>
          set((state) => ({
            questions: state.questions.map((question) =>
              question.id === questionId
                ? { ...question, ...updates }
                : question
            ),
          })),
        deleteQuestion: (questionId) =>
          set((state) => ({
            questions: state.questions.filter(
              (question) => question.id !== questionId
            ),
          })),

        // Subject actions
        setSubjects: (subjects) => set({ subjects }),
        addSubject: (subject) =>
          set((state) => ({ subjects: [...state.subjects, subject] })),
        updateSubject: (subjectId, updates) =>
          set((state) => ({
            subjects: state.subjects.map((subject) =>
              subject.id === subjectId ? { ...subject, ...updates } : subject
            ),
          })),
        deleteSubject: (subjectId) =>
          set((state) => ({
            subjects: state.subjects.filter(
              (subject) => subject.id !== subjectId
            ),
          })),

        // Group actions
        setGroups: (groups) => set({ groups }),
        addGroup: (group) =>
          set((state) => ({ groups: [...state.groups, group] })),
        updateGroup: (groupId, updates) =>
          set((state) => ({
            groups: state.groups.map((group) =>
              group.id === groupId ? { ...group, ...updates } : group
            ),
          })),
        deleteGroup: (groupId) =>
          set((state) => ({
            groups: state.groups.filter((group) => group.id !== groupId),
          })),

        // Utility actions
        reset: () => set(initialState),
        clearCache: () =>
          set({
            tests: [],
            questions: [],
            subjects: [],
            groups: [],
          }),
      }),
      {
        name: "testhub-storage",
        partialize: (state) => ({
          sidebarCollapsed: state.sidebarCollapsed,
          theme: state.theme,
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: "testhub-store",
    }
  )
);
)