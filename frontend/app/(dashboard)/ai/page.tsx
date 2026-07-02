"use client";

import * as React from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import {
  ChatMessage,
  CopilotHistoryItem,
  mockHistoryItems,
  mockPredictionCards,
  mockSimilarCases,
  mockCopilotResponses,
  mockCopilotWelcome,
} from "@/constants/mockCopilotData";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Form";
import { Badge, Spinner } from "@/components/ui/Feedback";
import { PageHeading, SectionHeading, CardTitle as TypoCardTitle, Paragraph, Caption } from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import {
  Sparkles,
  Send,
  Search,
  MessageSquare,
  Compass,
  AlertTriangle,
  Zap,
  TrendingUp,
  MapPin,
  Clock,
  Layers,
  HelpCircle,
  FileText,
  UserCheck,
  Link as LinkIcon,
  BookOpen,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { toast, Toaster } from "sonner";

export default function AiCopilotPage() {
  const { user } = useAuthStore();

  // 1. Core States
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [inputText, setInputText] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const [historySearch, setHistorySearch] = React.useState("");
  
  // Active Alert selected
  const [alertCenterItems, setAlertCenterItems] = React.useState([
    { id: "AL-1", type: "Crime Spike", severity: "High", confidence: 92, location: "Koramangala, Bengaluru", explanation: "45% surge in cyber phishing complaints targeting seniors.", action: "Deploy public cyber awareness warning." },
    { id: "AL-2", type: "Emerging Pattern", severity: "High", confidence: 88, location: "Kalaburagi Route Corridor", explanation: "GPS coordinates overlap 3 recent impounds linked to drug shipping.", action: "Set border checkpoints at highway gates." },
    { id: "AL-3", type: "Investigation Delay", severity: "Medium", confidence: 85, location: "Lashkar, Mysuru City", explanation: "8 narcotics files exceeding 45 days in inactive status.", action: "Assign supervisor audit files." },
  ]);

  const chatEndRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll chat log
  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Filtered History list
  const filteredHistory = React.useMemo(() => {
    return mockHistoryItems.filter(
      (item) =>
        item.title.toLowerCase().includes(historySearch.toLowerCase()) ||
        item.preview.toLowerCase().includes(historySearch.toLowerCase())
    );
  }, [historySearch]);

  // Action dispatcher
  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // 1. Append User Message
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // 2. Simulate AI Typing delay (800ms)
    setTimeout(() => {
      // Find matching mock response, fallback to default response
      const queryKey = Object.keys(mockCopilotResponses).find(
        (key) => textToSend.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(textToSend.toLowerCase())
      );

      const aiResponseData = queryKey
        ? mockCopilotResponses[queryKey]
        : {
            text: `Analyzing operational database for "${textToSend}". I have identified relevant query details.`,
            confidence: 85,
            reasoning: "Queried active state FIR files matching keywords in natural language query.",
            metrics: "Matched records: 12 cases. Overlapping suspect links: 2.",
            explanation: "I detected active case logs associated with your search. Details are indexed under primary district folders.",
            recommendation: "Review the matched FIR files or expand the criminal network relation links.",
          };

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        text: aiResponseData.text,
        explainable: {
          confidence: aiResponseData.confidence,
          reasoning: aiResponseData.reasoning,
          metrics: aiResponseData.metrics,
          explanation: aiResponseData.explanation,
          recommendation: aiResponseData.recommendation,
        },
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 850);
  };

  const handlePromptClick = (question: string) => {
    handleSendMessage(question);
  };

  const handleActionClick = (actionName: string) => {
    toast.success(`Dispatched Directive`, {
      description: `AI recommended directive initiated: "${actionName}".`,
    });
  };

  return (
    <div className="space-y-6 select-none">
      <Toaster theme="dark" closeButton />

      {/* 1. Page Header */}
      <div>
        <h2 className="text-page-title">Sentinel AI Copilot Workspace</h2>
        <Paragraph className="text-text-secondary">
          Interact with a cognitive strategic assistant to query incident records, analyze risk forecasts, and generate intelligence briefs.
        </Paragraph>
      </div>

      {/* Section 1: Conversation History (Full Width, Horizontal Layout) */}
      <Card className="w-full">
        <CardContent className="p-3 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          {/* Search */}
          <div className="relative w-full md:w-64 flex-shrink-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
              <Search className="h-3.5 w-3.5 text-text-secondary" />
            </span>
            <Input
              type="search"
              placeholder="Search history..."
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              className="pl-8 text-xs h-8"
            />
          </div>

          {/* Recent Conversations grouped */}
          <div className="flex-1 flex items-center gap-4 overflow-x-auto py-1 px-2 no-scrollbar">
            {["Today", "Yesterday", "Last Week"].map((group) => {
              const items = filteredHistory.filter((i) => i.dateGroup === group);
              if (items.length === 0) return null;
              return (
                <div key={group} className="flex items-center space-x-2 flex-shrink-0">
                  <span className="text-[9px] text-accent-primary font-bold uppercase tracking-wider select-none">{group}:</span>
                  {items.slice(0, 2).map((hist) => (
                    <button
                      key={hist.id}
                      onClick={() => handlePromptClick(hist.title)}
                      className="px-2.5 py-1 text-[10px] bg-background-secondary/40 border border-border-subtle rounded text-text-secondary hover:text-text-primary hover:border-border-default hover:bg-background-secondary transition-all truncate max-w-[130px]"
                      title={hist.preview}
                    >
                      {hist.title}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>

          {/* New Conversation Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setMessages([]);
              toast.info("Conversation reset");
            }}
            className="text-[10px] h-8 px-3 flex-shrink-0"
            leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
          >
            New Conversation
          </Button>
        </CardContent>
      </Card>

      {/* Section 2: Main AI Chat Workspace (Full Width) */}
      <div className="flex flex-col h-[520px] bg-background-card border border-border-subtle rounded-lg overflow-hidden relative shadow-lg w-full">
        {/* Chat Header */}
        <div className="p-3 border-b border-border-subtle bg-background-secondary/40 flex justify-between items-center select-none">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded bg-ai/10 border border-ai flex items-center justify-center text-ai relative">
              <Sparkles className="h-4.5 w-4.5 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-text-primary text-xs tracking-wider block">{mockCopilotWelcome.name}</span>
              <span className="text-[9px] text-success font-semibold tracking-wider uppercase block">Active Intelligence Tap</span>
            </div>
          </div>
          <Badge variant="ai">SENTINEL MODE ACTIVE</Badge>
        </div>

        {/* Chat Viewport */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.length === 0 ? (
            // AI Welcome Landing Screen
            <div className="h-full flex flex-col justify-center items-center text-center space-y-6 px-4 select-none">
              <div className="h-16 w-16 rounded-full bg-ai/10 border border-ai flex items-center justify-center text-ai relative shadow-md">
                <Sparkles className="h-8 w-8 animate-spin duration-10000" />
              </div>
              <div className="space-y-2 max-w-sm">
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest leading-none">
                  Command Shell Ready
                </h3>
                <Paragraph className="text-text-secondary text-xs leading-relaxed">
                  {mockCopilotWelcome.description}
                </Paragraph>
              </div>

              {/* Suggested Prompts Grid */}
              <div className="w-full space-y-2.5">
                <span className="text-[10px] text-text-secondary uppercase font-bold tracking-wider block">Suggested Intelligence Directives</span>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  {mockCopilotWelcome.suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => handlePromptClick(q)}
                      className="py-2.5 px-3 bg-background-secondary/30 border border-border-subtle rounded text-left text-text-secondary hover:text-text-primary hover:border-border-default transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Chat conversation list
            <div className="space-y-4 pr-1">
              {messages.map((msg) => {
                const isUser = msg.sender === "user";
                return (
                  <div key={msg.id} className={`flex flex-col ${isUser ? "items-end" : "items-start"} space-y-1`}>
                    <div className="flex items-center space-x-1.5 text-[8px] text-text-secondary">
                      <span>{isUser ? "Operational Officer" : mockCopilotWelcome.name}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    
                    <div
                      className={`p-3 rounded-lg max-w-[85%] leading-relaxed ${
                        isUser
                          ? "bg-accent-primary text-text-primary rounded-tr-none text-[11px] font-medium"
                          : "bg-background-secondary border border-border-subtle text-text-secondary rounded-tl-none text-[11px]"
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Explainable AI Panel (Attached directly under AI response) */}
                    {!isUser && msg.explainable && (
                      <div className="w-[90%] mt-2 bg-background-card border border-ai/20 rounded p-3.5 space-y-3.5 shadow-sm text-[10px] leading-normal select-none">
                        <div className="flex justify-between items-center border-b border-border-subtle pb-1.5">
                          <span className="font-bold text-ai flex items-center">
                            <Sparkles className="h-3.5 w-3.5 mr-1 animate-pulse" /> Cognitive Explanation Panel
                          </span>
                          <Badge variant="ai">Conf: {msg.explainable.confidence}%</Badge>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <span className="font-semibold text-text-primary block">Supporting Indicators:</span>
                            <span className="text-text-secondary leading-snug">{msg.explainable.metrics}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-text-primary block">Algorithmic Reasoning:</span>
                            <span className="text-text-secondary leading-snug">{msg.explainable.reasoning}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-text-primary block">Causal Explanation:</span>
                            <span className="text-text-secondary leading-snug">{msg.explainable.explanation}</span>
                          </div>
                        </div>

                        {/* Suggested Action directives */}
                        <div className="pt-2 border-t border-border-subtle/50 text-[9px] space-y-1.5">
                          <span className="font-bold text-text-primary block">AI Suggested Directive:</span>
                          <div className="flex justify-between items-center p-2 bg-ai/5 border border-ai/20 text-ai rounded">
                            <span className="flex-1 leading-snug mr-2">{msg.explainable.recommendation}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleActionClick(msg.explainable!.recommendation)}
                              className="h-6 px-2 text-[8px] justify-center bg-ai/10 text-ai flex-shrink-0"
                            >
                              Dispatch Order
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Simulated typing indicator */}
              {isTyping && (
                <div className="flex flex-col items-start space-y-1">
                  <span className="text-[8px] text-text-secondary">Sentinel AI is auditing...</span>
                  <div className="p-3 bg-background-secondary border border-border-subtle rounded-lg rounded-tl-none">
                    <div className="flex space-x-1.5 items-center h-4 px-2">
                      <span className="h-1.5 w-1.5 bg-ai rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-1.5 w-1.5 bg-ai rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-1.5 w-1.5 bg-ai rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Chat input bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="p-3 border-t border-border-subtle bg-background-secondary/30 flex space-x-2 select-none"
        >
          <Input
            type="text"
            placeholder="Query Case #, Suspects, or ask command suggestions..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isTyping}
            className="text-xs"
          />
          <Button
            type="submit"
            size="sm"
            disabled={isTyping || !inputText.trim()}
            className="px-3"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </form>
      </div>

      {/* Section 3: Supporting AI Intelligence Modules (Horizontal Responsive Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        
        {/* Panel 1: Command Center */}
        <Card className="h-72 flex flex-col justify-between">
          <CardHeader className="pb-2 border-none">
            <CardTitle className="text-xs uppercase tracking-wider text-text-primary flex items-center">
              <Compass className="h-4.5 w-4.5 mr-1.5 text-accent-primary" />
              Command Center
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto pt-0 text-[10px] space-y-2 flex flex-col justify-center">
            {[
              { name: "Executive Dashboard", link: "/dashboard", color: "text-accent-primary bg-accent-primary/10" },
              { name: "Intelligence Analytics", link: "/analytics", color: "text-analytics bg-analytics/10" },
              { name: "Interactive Crime Map", link: "/map", color: "text-warning bg-warning/10" },
              { name: "Criminal Network Graph", link: "/network", color: "text-ai bg-ai/10" },
              { name: "Operational Command Center", link: "/investigation", color: "text-success bg-success/10" },
            ].map((mod) => (
              <Link key={mod.name} href={mod.link} className="block w-full">
                <Button variant="secondary" className="w-full justify-between h-8 px-2.5 text-[10px]">
                  <span className="flex items-center">
                    <span className={`h-1.5 w-1.5 rounded-full inline-block mr-2 ${mod.color.split(" ")[0]}`} />
                    {mod.name}
                  </span>
                  <ArrowRight className="h-3 w-3 text-text-secondary" />
                </Button>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Panel 2: AI Cognitive Alert Center */}
        <Card className="h-72 flex flex-col border border-danger/20 bg-background-card/40">
          <CardHeader className="pb-2 border-none">
            <CardTitle className="text-xs uppercase tracking-wider text-danger flex items-center">
              <AlertTriangle className="h-4.5 w-4.5 mr-1.5 text-danger animate-pulse" />
              AI Cognitive Alert Center
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto pt-0 space-y-2.5 text-[9px]">
            {alertCenterItems.map((alert) => (
              <div key={alert.id} className="p-2.5 bg-background-secondary/20 border border-border-subtle rounded-md space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-text-primary flex items-center">
                    <AlertTriangle className="h-3 w-3 text-danger mr-1" />
                    {alert.type}
                  </span>
                  <Badge variant={alert.severity === "High" ? "danger" : "warning"} className="text-[8px] py-0 px-1">
                    Conf: {alert.confidence}%
                  </Badge>
                </div>
                <p className="text-[9px] text-text-secondary leading-normal">{alert.explanation}</p>
                <div className="text-[8px] text-accent-primary leading-normal pt-1 border-t border-border-subtle/50">
                  <span className="font-bold">Directive:</span> {alert.action}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Panel 3: AI Prediction Forecasts */}
        <Card className="h-72 flex flex-col">
          <CardHeader className="pb-2 border-none">
            <CardTitle className="text-xs uppercase tracking-wider text-text-primary flex items-center">
              <TrendingUp className="h-4.5 w-4.5 mr-1.5 text-accent-primary" />
              AI Prediction Forecasts
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto pt-0 space-y-2 text-[9px]">
            {mockPredictionCards.slice(0, 3).map((pred) => (
              <div key={pred.id} className="p-2.5 bg-background-secondary/20 border border-border-subtle rounded-md space-y-1">
                <div className="flex justify-between items-center font-bold text-text-primary">
                  <span>{pred.title}</span>
                  <Badge variant="primary" className="text-[8px] py-0 px-1">{pred.id}</Badge>
                </div>
                <span className="block font-semibold text-warning text-[9px]">{pred.value}</span>
                <p className="text-[9px] text-text-secondary leading-normal">{pred.trend}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Panel 4: Similar Case Finder */}
        <Card className="h-72 flex flex-col">
          <CardHeader className="pb-2 border-none">
            <CardTitle className="text-xs uppercase tracking-wider text-text-primary flex items-center">
              <Layers className="h-4.5 w-4.5 mr-1.5 text-analytics" />
              Similar Case Finder
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto pt-0 space-y-2 text-[9px]">
            {mockSimilarCases.map((c) => (
              <div key={c.firNumber} className="p-2 bg-background-secondary/20 border border-border-subtle rounded-md flex justify-between items-center">
                <div>
                  <span className="font-bold text-text-primary block leading-none">{c.firNumber}</span>
                  <span className="text-[8px] text-text-secondary block mt-0.5">Category: {c.category}</span>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <Badge variant="ai" className="text-[8px] py-0 px-1">Match: {c.similarity}%</Badge>
                  <Link href={c.link} className="font-semibold text-accent-primary hover:underline text-[8px]">
                    Analyze Link
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>

    </div>
  );
}
