import { useConversation } from "@/hooks/use-chat";
import { LayoutShell } from "@/components/layout-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, RefreshCw } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const { messages, sendMessage, isStreaming, streamedContent } = useConversation(1); // Hardcoded conversation ID 1 for MVP
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamedContent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <LayoutShell>
      <div className="h-[calc(100vh-140px)] flex flex-col max-w-4xl mx-auto">
        <div className="mb-4">
          <h1 className="text-3xl font-serif font-bold text-foreground flex items-center gap-3">
            <Bot className="h-8 w-8 text-primary" />
            ProduceSafe Assistant
          </h1>
          <p className="text-muted-foreground">Ask questions about FSMA rules, compliance, or record keeping.</p>
        </div>

        <Card className="flex-1 flex flex-col overflow-hidden shadow-xl border-border/60">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
                <Bot className="h-12 w-12 opacity-20" />
                <p>No messages yet. Ask me anything about produce safety!</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-md text-sm">
                  <Button variant="outline" onClick={() => sendMessage("Am I exempt from FSMA?")} className="h-auto py-3 text-left justify-start">
                    "Am I exempt from FSMA?"
                  </Button>
                  <Button variant="outline" onClick={() => sendMessage("How often do I need to test water?")} className="h-auto py-3 text-left justify-start">
                    "Water testing frequency?"
                  </Button>
                </div>
              </div>
            )}
            
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3 max-w-[85%]",
                  msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                  msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                )}>
                  {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={cn(
                  "rounded-2xl px-4 py-2 text-sm shadow-sm",
                  msg.role === "user" 
                    ? "bg-primary text-primary-foreground rounded-tr-sm" 
                    : "bg-white border border-border rounded-tl-sm"
                )}>
                  {msg.content}
                </div>
              </div>
            ))}

            {isStreaming && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="h-8 w-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shrink-0 animate-pulse">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl rounded-tl-sm px-4 py-2 text-sm shadow-sm bg-white border border-border">
                  {streamedContent || <span className="animate-pulse">Thinking...</span>}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-background border-t">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                className="flex-1"
                disabled={isStreaming}
              />
              <Button type="submit" size="icon" disabled={!input.trim() || isStreaming}>
                {isStreaming ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </LayoutShell>
  );
}
