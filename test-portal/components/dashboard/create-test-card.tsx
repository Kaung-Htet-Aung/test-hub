"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function CreateTestCard() {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-gray-100">
          Create Test
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
          <Plus className="h-6 w-6 text-gray-400" />
        </div>
        <p className="text-sm text-gray-500 text-center">
          Create a new test
        </p>
        <Button 
          className="w-full bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700 hover:text-gray-100"
        >
          Create Test
        </Button>
      </CardContent>
    </Card>
  )
}