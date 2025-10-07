import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Play, CheckCircle, Edit, Clock, AlertCircle } from "lucide-react";
import React from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Status-related utilities
export function getStatusColor(status: string): string {
  switch (status) {
    case "ACTIVE":
      return "border-green-600 text-green-400";
    case "published":
      return "border-blue-600 text-blue-400";
    case "draft":
      return "border-gray-600 text-gray-400";
    case "completed":
      return "border-green-600 text-green-400";
    case "archived":
      return "border-yellow-600 text-yellow-400";
    case "inactive":
      return "border-gray-600 text-gray-400";
    case "PENDING":
      return "border-yellow-600 text-yellow-400";
    case "generating":
      return "border-yellow-600 text-yellow-400";
    case "failed":
      return "border-red-600 text-red-400";
    default:
      return "border-gray-600 text-gray-400";
  }
}

export function getStatusIcon(status: string): React.ReactElement {
  switch (status) {
    case "active":
      return React.createElement(Play, { className: "h-3 w-3 text-green-400" });
    case "published":
      return React.createElement(CheckCircle, {
        className: "h-3 w-3 text-blue-400",
      });
    case "draft":
      return React.createElement(Edit, { className: "h-3 w-3 text-gray-400" });
    case "completed":
      return React.createElement(CheckCircle, {
        className: "h-3 w-3 text-green-400",
      });
    case "archived":
      return React.createElement(Clock, {
        className: "h-3 w-3 text-yellow-400",
      });
    case "inactive":
      return React.createElement(Clock, { className: "h-3 w-3 text-gray-400" });
    case "pending":
      return React.createElement(AlertCircle, {
        className: "h-3 w-3 text-yellow-400",
      });
    case "generating":
      return React.createElement(Clock, {
        className: "h-3 w-3 text-yellow-400",
      });
    case "failed":
      return React.createElement(AlertCircle, {
        className: "h-3 w-3 text-red-400",
      });
    default:
      return React.createElement(CheckCircle, {
        className: "h-3 w-3 text-gray-400",
      });
  }
}

// Difficulty-related utilities
export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case "easy":
      return "border-green-600 text-green-400";
    case "medium":
      return "border-yellow-600 text-yellow-400";
    case "hard":
      return "border-red-600 text-red-400";
    default:
      return "border-gray-600 text-gray-400";
  }
}

// Score-related utilities
export function getScoreColor(score: number): string {
  if (score >= 90) return "text-green-400";
  if (score >= 80) return "text-blue-400";
  if (score >= 70) return "text-yellow-400";
  return "text-red-400";
}
