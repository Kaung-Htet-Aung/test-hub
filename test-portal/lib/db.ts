import Dexie, { Table } from "dexie";
import React from "react";

// Database interface
export interface ExamAnswer {
  id?: number;
  examId: string;
  questionId: string;
  answer: string[];
  timestamp: Date;
  synced: boolean;
}

export interface ExamData {
  id?: number;
  examId: string;
  data: any;
  timestamp: Date;
}

// Database class
class ExamDatabase extends Dexie {
  answers!: Table<ExamAnswer>;
  exams!: Table<ExamData>;

  constructor() {
    super("ExamDatabase");

    this.version(1).stores({
      answers: "++id, examId, questionId, timestamp, synced",
    });
  }
}

// Create database instance
export const db = new ExamDatabase();

// Database operations
export const examDB = {
  // Answer operations
  async saveAnswer(answer: any): Promise<number> {
    return await db.answers.put(answer);
  },

  async updateAnswer(id: number, answer: Partial<ExamAnswer>): Promise<number> {
    return await db.answers.update(id, answer);
  },

  async getAnswer(
    examId: string,
    questionId: string
  ): Promise<ExamAnswer | undefined> {
    return await db.answers
      .where("examId")
      .equals(examId)
      .and((answer) => answer.questionId === questionId)
      .first();
  },

  async getExamAnswers(examId: string): Promise<ExamAnswer[]> {
    return await db.answers.where("examId").equals(examId).toArray();
  },

  async getUnsyncedAnswers(examId?: string): Promise<ExamAnswer[]> {
    let query = db.answers.where("synced").equals("false");

    if (examId) {
      query = query.and((answer) => answer.examId === examId);
    }

    return await query.toArray();
  },

  async markAnswerAsSynced(id: number): Promise<number> {
    return await db.answers.update(id, { synced: true });
  },

  async deleteAnswer(id: number): Promise<void> {
    return await db.answers.delete(id);
  },

  async deleteExamAnswers(examId: string): Promise<number> {
    return await db.answers.where("examId").equals(examId).delete();
  },

  // Exam data operations
  async saveExamData(examData: Omit<ExamData, "id">): Promise<number> {
    return await db.exams.add(examData);
  },

  async getExamData(examId: string): Promise<ExamData | undefined> {
    return await db.exams.where("examId").equals(examId).first();
  },

  async deleteExamData(examId: string): Promise<number> {
    return await db.exams.where("examId").equals(examId).delete();
  },

  // Utility operations
  async clearAllData(): Promise<void> {
    return await db.transaction("rw", [db.answers, db.exams], async () => {
      await db.answers.clear();
      await db.exams.clear();
    });
  },

  async getDatabaseStats(): Promise<{
    totalAnswers: number;
    unsyncedAnswers: number;
    totalExams: number;
  }> {
    const [totalAnswers, unsyncedAnswers, totalExams] = await Promise.all([
      db.answers.count(),
      db.answers.where("synced").equals("false").count(),
      db.exams.count(),
    ]);

    return {
      totalAnswers,
      unsyncedAnswers,
      totalExams,
    };
  },
};

// Open database connection
export const initializeDB = async (): Promise<void> => {
  try {
    await db.open();
    console.log("Database opened successfully");
  } catch (error) {
    console.error("Failed to open database:", error);
    throw error;
  }
};

// Hook for using IndexedDB in components
export const useExamDB = () => {
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const initDB = async () => {
      try {
        await initializeDB();
        setIsInitialized(true);
      } catch (err) {
        setError(err as Error);
      }
    };

    initDB();
  }, []);

  return {
    isInitialized,
    error,
    db: examDB,
  };
};
