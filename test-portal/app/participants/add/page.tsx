"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useDropzone, type FileRejection } from "react-dropzone";
import api from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Save,
  User,
  Calendar,
  Users,
  BookOpen,
  X,
  Upload,
  Download,
  FileText,
  CheckCircle,
  AlertCircle,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { getGroups } from "@/lib/getGroups";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface ParticipantFormData {
  name: string;
  email: string;
  phone: string;
  note?: string;
  batchId: string;
}

interface ParsedParticipant {
  data: ParticipantFormData;
  errors: string[];
  isValid: boolean;
}

interface BatchData {
  id: string;
  name: string;
}
const participantSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  phone: z
    .string()
    .trim()
    .nonempty("Phone number is required")
    .regex(/^[\d\s\-+()]+$/, "Please enter a valid phone number"),
  note: z.string().optional(),
  batchId: z.string().trim().nonempty(),
});
export default function AddParticipantPage() {
  const router = useRouter();
  const form = useForm<ParticipantFormData>({
    resolver: zodResolver(participantSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      note: "",
      batchId: "",
    },
  });
  type State = {
    success: boolean;
    message: string;
    errors?: {
      name: string[];
      email: string[];
      phone: string[];
    };
  };
  const initialState: State = {
    success: true,
    message: "",
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedParticipant[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState("waiting");

  const parseCSV = (text: string): ParsedParticipant[] => {
    const lines = text.split("\n").filter((line) => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0]
      .split(",")
      .map((h) => h.trim().replace(/^"|"$/g, ""));
    const participants: ParsedParticipant[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i]
        .split(",")
        .map((v) => v.trim().replace(/^"|"$/g, ""));
      const participant: ParticipantFormData = {
        name: values[headers.indexOf("name")] || "",
        email: values[headers.indexOf("email")] || "",
        phone: values[headers.indexOf("phone")] || "",
        note: values[headers.indexOf("note")] || "",
        batchId: values[headers.indexOf("batchId")] || "",
      };

      const errors: string[] = [];

      // Validation
      if (!participant.name.trim()) errors.push("Name is required");
      if (!participant.email.trim()) errors.push("Email is required");
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(participant.email))
        errors.push("Invalid email format");
      if (!participant.phone.trim()) errors.push("Phone is required");
      else if (!/^[\d\s\-+()]+$/.test(participant.phone.replace(/\s/g, "")))
        errors.push("Invalid phone format");

      participants.push({
        data: participant,
        errors,
        isValid: errors.length === 0,
      });
    }

    return participants;
  };

  const handleFileUpload = useCallback((file: File) => {
    setCsvFile(file);
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;

        const parsed = parseCSV(text);

        setParsedData(parsed);
        setShowPreview(true);
      } catch (e: any) {
        console.log(e);
        toast.error("Failed to parse CSV file");
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsText(file);
  }, []);
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach((rejectedFile) => {
          if (
            rejectedFile.errors.some(
              (error) => error.code === "file-invalid-type"
            )
          ) {
            toast.error("Please upload only CSV files");
          }
        });
        return;
      }

      // Handle accepted files
      if (acceptedFiles.length > 0) {
        handleFileUpload(acceptedFiles[0]);
      }
    },
    [handleFileUpload]
  );
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    maxFiles: 1,
    disabled: isUploading || isAdding,
  });
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
    staleTime: 1000 * 60 * 60,
  });
  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  // CSV Upload Functions
  const downloadTemplate = () => {
    const template = [
      ["name", "email", "phone", "status", "groups", "notes"],
      [
        "John Doe",
        "john.doe@example.com",
        "+1 (555) 123-4567",
        "pending",
        "Mathematics;Programming",
        "Sample note",
      ],
      [
        "Jane Smith",
        "jane.smith@example.com",
        "+1 (555) 234-5678",
        "active",
        "English;Science",
        "Another note",
      ],
    ];

    const csvContent = template
      .map((row) =>
        row
          .map((field) =>
            typeof field === "string" &&
            (field.includes(",") || field.includes('"'))
              ? `"${field.replace(/"/g, '""')}"`
              : field
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "participants_template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleBulkImport = async () => {
    if (!csvFile) return;
    setShowPreview(false);
    setIsAdding(true);

    const formData = new FormData();
    formData.append("file", csvFile);
    formData.append("batchId", "cmgqph1kl0000nlv03tn923ds");

    try {
      const response = await api.post("/admin/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const data = response.data;
      setJobId(data.jobId);
      const evtSource = new EventSource(
        `http://localhost:8080/api/v1/admin/upload-status/${data.jobId}/stream`
      );

      evtSource.onmessage = (event) => {
        const msg = JSON.parse(event.data);

        if (msg.done) {
          setIsAdding(false);
          evtSource.close();
          toast.success("Upload finished! Your data has been added.");
        }
      };

      evtSource.onerror = () => {
        evtSource.close();
        setIsAdding(false);
        toast.error("Connection lost. Please retry your upload.");
      };

      // SSE
    } catch (e: any) {
      console.log(e);
      toast.error(e.response.data.error);
    }
  };

  const resetCSVUpload = () => {
    setCsvFile(null);
    setParsedData([]);
    setShowPreview(false);
  };

  async function onSubmit(formdata: z.infer<typeof participantSchema>) {
    try {
      console.log("form", formdata);
      const response = await api.post("/admin/participants/", formdata);
      toast.success(response.data.message);
    } catch (e: any) {
      console.log(e);
    }
  }
  return (
    <PageLayout
      title="Add Participant"
      description="Add a new participant to the testing platform"
      actions={
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      }
    >
      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="individual" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md bg-gray-900 border-gray-800">
            <TabsTrigger
              value="individual"
              className="flex items-center data-[state=active]:text-black text-white gap-2"
            >
              <User className="h-4 w-4" />
              Individual
            </TabsTrigger>
            <TabsTrigger
              value="bulk"
              className="flex items-center data-[state=active]:text-black text-white gap-2"
            >
              <Upload className="h-4 w-4" />
              Bulk Upload
            </TabsTrigger>
          </TabsList>

          {/* Individual Add Form */}
          <TabsContent value="individual" className="space-y-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Personal Information */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-100">
                      <User className="h-5 w-5 text-gray-400" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">
                              Full Name *
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter full name"
                                className="bg-gray-800 border-gray-700 text-gray-100"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">
                              Email Address *
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder="Enter email address"
                                className="bg-gray-800 border-gray-700 text-gray-100"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">
                              Phone Number *
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="tel"
                                placeholder="Enter phone number"
                                className="bg-gray-800 border-gray-700 text-gray-100"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Group Assignment */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-100">
                      <Users className="h-5 w-5 text-gray-400" />
                      Group Assignment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="batchId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">
                              Add to Groups
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100">
                                  <SelectValue placeholder="Select a group to add" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-gray-900 border-gray-800">
                                {data.map((batch: BatchData) => (
                                  <SelectItem key={batch.id} value={batch.id}>
                                    {batch.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Notes */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-100">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      Additional Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="note"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Add any additional notes about this participant..."
                              className="bg-gray-800 border-gray-700 text-gray-100 min-h-[100px] resize-none"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Add Participant
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          {/* Bulk Upload */}
          <TabsContent value="bulk" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Select>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100">
                      <SelectValue placeholder="Select a group to add" />
                    </SelectTrigger>

                    <SelectContent className="bg-gray-900 border-gray-800">
                      {data.map((batch: BatchData) => (
                        <SelectItem key={batch.id} value={batch.id}>
                          {batch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {!showPreview ? (
              <>
                {/* Upload Area */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-gray-100">
                        <Upload className="h-5 w-5 text-gray-400" />
                        Upload CSV File
                      </CardTitle>
                      <Button
                        variant="outline"
                        onClick={downloadTemplate}
                        className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Template
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                        isUploading || isAdding
                          ? "opacity-50 cursor-not-allowed"
                          : isDragActive
                          ? isDragAccept
                            ? "border-green-500 bg-green-500/10"
                            : isDragReject
                            ? "border-red-500 bg-red-500/10"
                            : "border-blue-500 bg-blue-500/10"
                          : "border-gray-600 hover:border-gray-500"
                      }`}
                    >
                      <input {...getInputProps()} />
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <div className="space-y-2">
                        <p className="text-lg font-medium text-gray-100">
                          {isUploading
                            ? "Uploading in progress..."
                            : isAdding
                            ? "Adding participants in progress.."
                            : isDragActive
                            ? isDragAccept
                              ? "Drop the CSV file here..."
                              : isDragReject
                              ? "Please drop only CSV files"
                              : "Drop the file here..."
                            : "Drop your CSV file here or click to browse"}
                        </p>
                      </div>
                      {isUploading || isAdding ? (
                        <>
                          <div className="flex text-white justify-end text-sm">
                            <span>Please wait...</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="text-sm text-gray-400">
                            Supports CSV files with the required columns: name,
                            email, phone
                          </p>
                          <Button
                            variant="outline"
                            type="button"
                            className="mt-4 bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
                            disabled={isUploading}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Select File
                          </Button>
                        </>
                      )}
                    </div>

                    {csvFile && (
                      <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-100">
                              {csvFile.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {(csvFile.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={resetCSVUpload}
                          className="text-gray-400 hover:text-red-400"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-100">
                        Required CSV Format:
                      </h4>
                      <div className="bg-gray-800 rounded-lg p-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">name:</span>
                            <span className="text-gray-100 ml-2">
                              Full Name
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">email:</span>
                            <span className="text-gray-100 ml-2">
                              Email Address
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">phone:</span>
                            <span className="text-gray-100 ml-2">
                              Phone Number
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">status:</span>
                            <span className="text-gray-100 ml-2">
                              pending/active/inactive
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">groups:</span>
                            <span className="text-gray-100 ml-2">
                              Math;Programming
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">notes:</span>
                            <span className="text-gray-100 ml-2">
                              Optional notes
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-gray-100">
                        <Eye className="h-5 w-5 text-gray-400" />
                        Import Preview
                      </CardTitle>
                      <Button
                        variant="outline"
                        onClick={resetCSVUpload}
                        className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Start Over
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">
                          {parsedData.filter((p) => p.isValid).length}
                        </div>
                        <div className="text-sm text-gray-400">Valid</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-400">
                          {parsedData.filter((p) => !p.isValid).length}
                        </div>
                        <div className="text-sm text-gray-400">Invalid</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-100">
                          {parsedData.length}
                        </div>
                        <div className="text-sm text-gray-400">Total</div>
                      </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto space-y-2">
                      {parsedData.map((participant, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border ${
                            participant.isValid
                              ? "border-green-500/30 bg-green-500/10"
                              : "border-red-500/30 bg-red-500/10"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-gray-100">
                                  {participant.data.name}
                                </span>
                                {participant.isValid ? (
                                  <CheckCircle className="h-4 w-4 text-green-400" />
                                ) : (
                                  <AlertCircle className="h-4 w-4 text-red-400" />
                                )}
                              </div>
                              <div className="text-xs text-gray-400 space-y-1">
                                <div>Email: {participant.data.email}</div>
                                <div>Phone: {participant.data.phone}</div>
                                <div>groupId: {participant.data.batchId}</div>
                                {/* {participant.data.groups && (
                                  <div>Groups: {participant.data.groups}</div>
                                )} */}
                              </div>
                            </div>

                            {!participant.isValid &&
                              participant.errors.length > 0 && (
                                <div className="flex-shrink-0">
                                  <div className="text-xs text-red-400">
                                    {participant.errors.join(", ")}
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-gray-800">
                      <Button
                        variant="outline"
                        onClick={resetCSVUpload}
                        className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleBulkImport}
                        disabled={
                          isUploading ||
                          parsedData.filter((p) => p.isValid).length === 0
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {isUploading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Importing...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Import {
                              parsedData.filter((p) => p.isValid).length
                            }{" "}
                            Participants
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
