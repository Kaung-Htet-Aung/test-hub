"use client";

import { useState } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getGroups } from "@/lib/getGroups";
import Link from "next/link";
import api from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Search,
  Plus,
  Filter,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  Download,
  Mail as MailIcon,
  UserPlus,
} from "lucide-react";
import { getStatusColor, getStatusIcon, getScoreColor } from "@/lib/utils";
import { useQueries } from "@tanstack/react-query";

interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  note: string;
  role: "PARTICIPANT" | "ADMIN";
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  joinDate: string;
  batchMembers: {
    joinedAt: string;
    batch: {
      id: string;
      name: string;
    };
  }[];
}
interface GroupData {
  id: string;
  name: string;
}
export default function ParticipantsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [groupFilter, setGroupFilter] = useState("all");

  const fetchUsers = async () => {
    try {
      const response = await api.get("/admin/participants");
      return response.data;
    } catch (e) {
      throw new Error("Failed to fetch users");
    }
  };

  const results = useQueries({
    queries: [
      {
        queryKey: ["participants"],
        queryFn: fetchUsers,
      },
      {
        queryKey: ["groups"],
        queryFn: getGroups,
      },
    ],
  });
  const isPending = results.some((query) => query.isPending);
  const error = results.some((query) => query.error);

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (error) {
    return <span>{error}</span>;
  }

  const participants: Participant[] = results[0].data;

  const groups: GroupData[] = results[1].data;
  // Mock data for participants

  const filteredParticipants = participants.filter((participant, index) => {
    const matchesSearch =
      participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || participant.status === statusFilter;
    const matchesGroup =
      groupFilter === "all" ||
      participant.batchMembers[index].batch.name.includes(groupFilter);

    return matchesSearch && matchesStatus && matchesGroup;
  });

  /*   const allGroups = Array.from(new Set(participants.flatMap((p) => p.groups)));
   */
  const actions = (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search participants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-64 bg-gray-900 border-gray-800 text-gray-100 pl-10"
        />
      </div>
      <Button className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700">
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
      <Link href="/admin/participants/add">
        <Button className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Participant
        </Button>
      </Link>
    </div>
  );

  return (
    <PageLayout
      title="Participants"
      description="Manage and monitor participant activity"
      actions={actions}
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Participants
            </CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light text-gray-100">
              {participants.length}
            </div>
            <p className="text-xs text-gray-500">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Active
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light text-gray-100">
              {participants.filter((p) => p.status === "ACTIVE").length}
            </div>
            <p className="text-xs text-gray-500">Currently active</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Avg Score
            </CardTitle>
            <Award className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light text-gray-100">
              {/* {Math.round(
                participants.reduce((acc, p) => acc + p.averageScore, 0) /
                  participants.filter((p) => p.testsCompleted > 0).length
              )}
              % */}
              79
            </div>
            <p className="text-xs text-gray-500">Overall average</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Completion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light text-gray-100">
              {/* {Math.round(
                (participants.reduce(
                  (acc, p) => acc + p.testsCompleted / p.totalTests,
                  0
                ) /
                  participants.filter((p) => p.totalTests > 0).length) *
                  100
              )} */}
              70 %
            </div>
            <p className="text-xs text-gray-500">Average completion</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-400">Filters:</span>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-32 bg-gray-800 border-gray-700 text-gray-100">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="text-white bg-gray-900 border-gray-800">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={groupFilter} onValueChange={setGroupFilter}>
              <SelectTrigger className="w-full sm:w-32 bg-gray-800 border-gray-700 text-gray-100">
                <SelectValue placeholder="Group" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-800 text-white">
                <SelectItem value="all">All Groups</SelectItem>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.name}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Participants List */}
      <div className="grid gap-4">
        {filteredParticipants.map((participant, index) => (
          <Card key={participant.id} className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gray-700 text-gray-300">
                      {participant.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-100 truncate">
                      {participant.name}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-400 truncate">
                          {participant.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-400">
                          {participant.phone}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {getStatusIcon(participant.status)}
                      <Badge
                        variant="outline"
                        className={`text-xs ${getStatusColor(
                          participant.status
                        )}`}
                      >
                        {participant.status.toUpperCase()}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        {/* <span className="text-xs text-gray-400">
                          Joined {participant.batchMembers[0].joinedAt}
                        </span> */}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
                  <div className="text-right">
                    <div
                      className={`text-lg font-medium ${getScoreColor(
                        /* participant.averageScore */ 10
                      )}`}
                    >
                      {/*  {participant.averageScore > 0
                        ? `${participant.averageScore}%`
                        : "N/A"} */}
                      40
                    </div>
                    <div className="text-xs text-gray-400">Avg Score</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-medium text-gray-100">
                      {
                        /* {participant.testsCompleted}/{participant.totalTests}
                         */ 100
                      }
                    </div>
                    <div className="text-xs text-gray-400">Tests Completed</div>
                  </div>
                  <div className="w-full lg:w-32">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">Progress</span>
                      <span className="text-xs text-gray-300">
                        {
                          /*                         {participant.totalTests > 0
                          ? Math.round(
                              (participant.testsCompleted /
                                participant.totalTests) *
                                100
                            )
                          : 0}
                        % */ 80
                        }
                      </span>
                    </div>
                    <Progress
                      value={
                        /* participant.totalTests > 0
                          ? (participant.testsCompleted /
                              participant.totalTests) *
                            100
                          : 0 */
                        80
                      }
                      className="h-2"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-gray-200"
                    >
                      <MailIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-gray-200"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Groups */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-4 pt-4 border-t border-gray-800">
                <span className="text-sm text-gray-400">Groups:</span>
                <div className="flex flex-wrap gap-2">
                  -
                  <Badge
                    key={participant.batchMembers[0].batch.id}
                    variant="outline"
                    className="border-gray-600 text-gray-300 text-xs"
                  >
                    {participant.batchMembers[0].batch.name}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
}
