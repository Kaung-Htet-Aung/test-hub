"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, FileText, Upload, Share2, Plus } from "lucide-react";

const quickActions = [
  {
    title: "Create Test",
    icon: Plus,
    action: () => console.log("Create test"),
  },
  {
    title: "Add Participant",
    icon: UserPlus,
    action: () => console.log("Add participant"),
  },
  {
    title: "Generate Questions",
    icon: FileText,
    action: () => console.log("Generate questions"),
  },
  {
    title: "Bulk Import",
    icon: Upload,
    action: () => console.log("Bulk import"),
  },
  {
    title: "Share Results",
    icon: Share2,
    action: () => console.log("Share results"),
  },
];

export function QuickActions() {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-gray-100">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-gray-100"
              onClick={action.action}
            >
              <action.icon className="h-5 w-5" />
              <span className="text-xs text-center">{action.title}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
