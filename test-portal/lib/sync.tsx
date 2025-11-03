"use client";
import { examDB } from "./db";
import { db } from "./db";
import React from "react";
import {
  CheckCircle,
  Loader2,
  WifiOff,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

// Sync status types
export type SyncStatus = "synced" | "syncing" | "offline" | "error";

// State management using React context and hooks
const SyncContext = React.createContext<{
  syncStatus: SyncStatus;
  isOnline: boolean;
  saveAnswer: (
    examId: string,
    questionId: string,
    answer: string | string[]
  ) => Promise<void>;
  loadExamAnswers: (examId: string) => Promise<
    Array<{
      questionId: string;
      answer: string[];
      timestamp: Date;
    }>
  >;
  syncAllPendingAnswers: () => Promise<void>;
  getSyncStats: () => Promise<{
    totalAnswers: number;
    unsyncedAnswers: number;
    isOnline: boolean;
    syncStatus: SyncStatus;
  }>;
  clearExamData: (examId: string) => Promise<void>;
} | null>(null);

// Global state using React useRef
const syncState = {
  syncStatus: "synced" as SyncStatus,
  isOnline: navigator.onLine,
  listeners: new Set<(status: SyncStatus) => void>(),
};

// Update sync status and notify listeners
const updateStatus = (status: SyncStatus): void => {
  syncState.syncStatus = status;
  syncState.listeners.forEach((listener) => listener(status));
};

// Setup online/offline listeners
const setupConnectivityListeners = (): void => {
  const handleOnline = async () => {
    syncState.isOnline = true;
    updateStatus("syncing");
    await syncAllPendingAnswers();
  };

  const handleOffline = () => {
    syncState.isOnline = false;
    updateStatus("offline");
  };

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  // Check initial status
  syncState.isOnline = navigator.onLine;
};

// Setup service worker listeners
const setupServiceWorkerListeners = (): void => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data.type === "SYNC_STATUS") {
        updateStatus(event.data.status);
      }
    });
  }
};

// Add status listener
const addStatusListener = (
  listener: (status: SyncStatus) => void
): (() => void) => {
  syncState.listeners.add(listener);
  return () => syncState.listeners.delete(listener);
};

// Get current sync status
const getStatus = (): SyncStatus => syncState.syncStatus;

// Get online status
const isUserOnline = (): boolean => syncState.isOnline;

// Sync single answer with server
const syncAnswer = async (
  examId: string,
  questionId: string,
  answer: string | string[]
): Promise<void> => {
  try {
    const response = await fetch(`/api/exams/${examId}/answers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        examId,
        questionId,
        answer,
        timestamp: new Date(),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to sync answer");
    }

    // Mark as synced in IndexedDB
    const savedAnswer = await examDB.getAnswer(examId, questionId);
    if (savedAnswer && savedAnswer.id) {
      await examDB.markAnswerAsSynced(savedAnswer.id);
    }
  } catch (error) {
    throw error;
  }
};

// Register background sync
const registerBackgroundSync = async (): Promise<void> => {
  if ("serviceWorker" in navigator && "SyncManager" in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await (registration as any).sync.register("sync-answers");
    } catch (error) {
      console.error("Failed to register background sync:", error);
    }
  }
};

// Save answer with offline support
const saveAnswer = async (
  examId: string,
  questionId: string,
  answer: string | string[]
): Promise<void> => {
  updateStatus("syncing");

  const existing = await examDB.getAnswer(examId, questionId);

  if (existing) {
    console.log("exit");
    // Update existing record
    await db.answers.update(existing.id, {
      ...existing,
      answer: [...answer],
      timestamp: new Date(),
      synced: false,
    });
  } else {
    console.log(" not exit");
    // Insert new record
    await examDB.saveAnswer({
      examId,
      questionId,
      answer,
      timestamp: new Date(),
      synced: false,
    });
  }
};

// Sync all pending answers
const syncAllPendingAnswers = async (): Promise<void> => {
  try {
    const unsyncedAnswers = await examDB.getUnsyncedAnswers();

    if (unsyncedAnswers.length === 0) {
      updateStatus("synced");
      return;
    }

    updateStatus("syncing");

    let successCount = 0;
    let errorCount = 0;

    for (const answer of unsyncedAnswers) {
      try {
        await syncAnswer(answer.examId, answer.questionId, answer.answer);
        successCount++;
      } catch (error) {
        console.error("Failed to sync answer:", answer.id, error);
        errorCount++;
      }
    }

    if (errorCount === 0) {
      updateStatus("synced");
    } else if (successCount > 0) {
      updateStatus("syncing"); // Partial success
    } else {
      updateStatus("error");
    }
  } catch (error) {
    console.error("Failed to sync pending answers:", error);
    updateStatus("error");
  }
};

// Load saved answers for exam
const loadExamAnswers = async (
  examId: string
): Promise<
  Array<{
    questionId: string;
    answer: string[];
    timestamp: Date;
  }>
> => {
  try {
    const answers = await examDB.getExamAnswers(examId);
    return answers.map((answer) => ({
      questionId: answer.questionId,
      answer: answer.answer,
      timestamp: answer.timestamp,
    }));
  } catch (error) {
    console.error("Failed to load exam answers:", error);
    return [];
  }
};

// Get sync statistics
const getSyncStats = async (): Promise<{
  totalAnswers: number;
  unsyncedAnswers: number;
  isOnline: boolean;
  syncStatus: SyncStatus;
}> => {
  const stats = await examDB.getDatabaseStats();

  return {
    totalAnswers: stats.totalAnswers,
    unsyncedAnswers: stats.unsyncedAnswers,
    isOnline: syncState.isOnline,
    syncStatus: syncState.syncStatus,
  };
};

// Clear all data for an exam
const clearExamData = async (examId: string): Promise<void> => {
  try {
    await examDB.deleteExamAnswers(examId);
    await examDB.deleteExamData(examId);
  } catch (error) {
    console.error("Failed to clear exam data:", error);
    throw error;
  }
};

// Initialize sync functionality
const initializeSync = (): void => {
  setupConnectivityListeners();
  setupServiceWorkerListeners();
};

// Provider component for sync context
export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [syncStatus, setSyncStatus] = React.useState<SyncStatus>(
    syncState.syncStatus
  );
  const [isOnline, setIsOnline] = React.useState(syncState.isOnline);

  React.useEffect(() => {
    // Initialize sync functionality
    initializeSync();

    // Setup status listener
    const removeListener = addStatusListener((status) => {
      /*  setSyncStatus(status);*/
      setIsOnline(isUserOnline());
    });

    return () => {
      removeListener();
    };
  }, []);

  const value = React.useMemo(
    () => ({
      syncStatus,
      isOnline,
      saveAnswer,
      loadExamAnswers,
      syncAllPendingAnswers,
      getSyncStats,
      clearExamData,
    }),
    [syncStatus, isOnline]
  );

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
};

// Hook for using sync functionality in components
export const useSyncManager = () => {
  const context = React.useContext(SyncContext);
  if (!context) {
    throw new Error("useSyncManager must be used within a SyncProvider");
  }
  return context;
};

// Utility functions
export const formatSyncStatus = (status: SyncStatus): string => {
  switch (status) {
    case "synced":
      return "All Changes Saved";
    case "syncing":
      return "Saving...";
    case "offline":
      return "Offline - Saved Locally";
    case "error":
      return "Sync Error";
    default:
      return "Unknown";
  }
};

export const getSyncStatusColor = (status: SyncStatus): string => {
  switch (status) {
    case "synced":
      return "text-green-400";
    case "syncing":
      return "text-blue-400";
    case "offline":
      return "text-yellow-400";
    case "error":
      return "text-red-400";
    default:
      return "text-gray-400";
  }
};

export const getSyncStatusIcon = (status: SyncStatus) => {
  switch (status) {
    case "synced":
      return CheckCircle;
    case "syncing":
      return Loader2;
    case "offline":
      return WifiOff;
    case "error":
      return AlertCircle;
    default:
      return HelpCircle;
  }
};
