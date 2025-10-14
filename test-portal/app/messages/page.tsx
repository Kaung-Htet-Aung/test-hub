"use client";

import { useState } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageSquare,
  Send,
  Search,
  Plus,
  Star,
  Clock,
  CheckCircle,
  Paperclip,
  Smile,
  MoreHorizontal,
  Archive,
} from "lucide-react";

interface Message {
  id: string;
  sender: string;
  avatar: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
  starred: boolean;
  category: "inbox" | "sent" | "drafts" | "archived";
}

interface Conversation {
  id: string;
  participant: string;
  avatar: string;
  messages: Array<{
    id: string;
    sender: "me" | "them";
    content: string;
    time: string;
    read: boolean;
  }>;
}

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState("inbox");
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for messages
  const messages: Message[] = [
    {
      id: "1",
      sender: "John Doe",
      avatar: "",
      subject: "Test Results Available",
      preview:
        "Your recent test results have been published. You scored 85% overall...",
      time: "2 hours ago",
      unread: true,
      starred: false,
      category: "inbox",
    },
    {
      id: "2",
      sender: "Jane Smith",
      avatar: "",
      subject: "Meeting Reminder",
      preview:
        "Don't forget about our scheduled meeting tomorrow at 2 PM to discuss...",
      time: "5 hours ago",
      unread: false,
      starred: true,
      category: "inbox",
    },
    {
      id: "3",
      sender: "System Admin",
      avatar: "",
      subject: "System Maintenance",
      preview:
        "Scheduled maintenance will occur this weekend. The system will be...",
      time: "1 day ago",
      unread: false,
      starred: false,
      category: "inbox",
    },
    {
      id: "4",
      sender: "Michael Brown",
      avatar: "",
      subject: "Question about Test Format",
      preview:
        "I had a question regarding the format of the upcoming assessment...",
      time: "2 days ago",
      unread: false,
      starred: false,
      category: "inbox",
    },
  ];

  // Mock data for conversations
  const conversations: Conversation[] = [
    {
      id: "1",
      participant: "John Doe",
      avatar: "",
      messages: [
        {
          id: "1",
          sender: "them",
          content: "Hi! I wanted to discuss my recent test results.",
          time: "10:30 AM",
          read: true,
        },
        {
          id: "2",
          sender: "me",
          content:
            "Sure, I'd be happy to help. Which test are you referring to?",
          time: "10:32 AM",
          read: true,
        },
        {
          id: "3",
          sender: "them",
          content:
            "The Math Assessment from yesterday. I scored 78% and wanted to understand where I can improve.",
          time: "10:35 AM",
          read: true,
        },
      ],
    },
    {
      id: "2",
      participant: "Jane Smith",
      avatar: "",
      messages: [
        {
          id: "1",
          sender: "them",
          content: "Can you send me the report for last week's tests?",
          time: "Yesterday",
          read: true,
        },
        {
          id: "2",
          sender: "me",
          content: "I'll compile the report and send it over by end of day.",
          time: "Yesterday",
          read: true,
        },
      ],
    },
  ];

  const filteredMessages = messages.filter(
    (message) =>
      message.category === activeTab &&
      (message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.preview.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedConversation = conversations.find(
    (c) => c.id === selectedMessage
  );

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      // In a real app, this would send the message
      setNewMessage("");
    }
  };

  const toggleStar = (messageId: string) => {
    // In a real app, this would update the message
  };

  const actions = (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-64 bg-gray-900 border-gray-800 text-gray-100 pl-10"
        />
      </div>
      <Button className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700">
        <Plus className="h-4 w-4 mr-2" />
        New Message
      </Button>
    </div>
  );

  return (
    <PageLayout
      title="Messages"
      description="Communicate with participants and team members"
      actions={actions}
    >
      <Tabs defaultValue="inbox" className="space-y-4">
        <TabsList className="bg-gray-900 border-gray-800">
          <TabsTrigger
            value="inbox"
            className="text-gray-300 data-[state=active]:bg-gray-800"
          >
            Inbox
            <Badge
              variant="secondary"
              className="ml-2 bg-gray-800 text-gray-300"
            >
              {
                messages.filter((m) => m.category === "inbox" && m.unread)
                  .length
              }
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="sent"
            className="text-gray-300 data-[state=active]:bg-gray-800"
          >
            Sent
          </TabsTrigger>
          <TabsTrigger
            value="drafts"
            className="text-gray-300 data-[state=active]:bg-gray-800"
          >
            Drafts
          </TabsTrigger>
          <TabsTrigger
            value="archived"
            className="text-gray-300 data-[state=active]:bg-gray-800"
          >
            Archived
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Message List */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-900 border-gray-800 h-[600px]">
                <CardHeader>
                  <CardTitle className="text-lg font-light text-gray-100">
                    Messages
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px]">
                    {filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 border-b border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors ${
                          selectedMessage === message.id ? "bg-gray-800" : ""
                        }`}
                        onClick={() => setSelectedMessage(message.id)}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gray-700 text-gray-300">
                              {message.sender.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-medium text-gray-100 truncate">
                                {message.sender}
                              </h3>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400">
                                  {message.time}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-gray-400 hover:text-gray-200"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleStar(message.id);
                                  }}
                                >
                                  <Star
                                    className={`h-3 w-3 ${
                                      message.starred
                                        ? "fill-yellow-400 text-yellow-400"
                                        : ""
                                    }`}
                                  />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-100 truncate mt-1">
                              {message.subject}
                            </p>
                            <p className="text-xs text-gray-400 truncate mt-1">
                              {message.preview}
                            </p>
                            {message.unread && (
                              <div className="flex items-center gap-2 mt-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                <span className="text-xs text-blue-400">
                                  Unread
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Message Detail / Conversation */}
            <div className="lg:col-span-2">
              {selectedConversation ? (
                <Card className="bg-gray-900 border-gray-800 h-[600px] flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gray-700 text-gray-300">
                            {selectedConversation.participant.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-medium text-gray-100">
                            {selectedConversation.participant}
                          </h3>
                          <p className="text-sm text-gray-400">Online</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-gray-200"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 p-0">
                    <ScrollArea className="h-[400px] px-4">
                      <div className="space-y-4 pb-4">
                        {selectedConversation.messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.sender === "me"
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                message.sender === "me"
                                  ? "bg-gray-800 text-gray-100"
                                  : "bg-gray-800 text-gray-100"
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {message.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>

                  <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-gray-200"
                      >
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-gray-200"
                      >
                        <Smile className="h-4 w-4" />
                      </Button>
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 bg-gray-800 border-gray-700 text-gray-100"
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                      />
                      <Button
                        onClick={handleSendMessage}
                        className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="bg-gray-900 border-gray-800 h-[600px] flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-400 mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-sm text-gray-500">
                      Choose a message from your inbox to start chatting
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sent">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">
                  Sent Messages
                </h3>
                <p className="text-sm text-gray-500">
                  Your sent messages will appear here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drafts">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="text-center">
                <Clock className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">
                  Draft Messages
                </h3>
                <p className="text-sm text-gray-500">
                  Your draft messages will appear here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="archived">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="text-center">
                <Archive className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">
                  Archived Messages
                </h3>
                <p className="text-sm text-gray-500">
                  Your archived messages will appear here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}

// Archive icon component
function Archive({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
      />
    </svg>
  );
}
