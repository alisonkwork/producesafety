import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

// Types for chat integration
interface Conversation {
  id: number;
  title: string;
  createdAt: string;
}

interface Message {
  id: number;
  conversationId: number;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export function useChat() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get conversations
  const conversationsQuery = useQuery({
    queryKey: ["/api/conversations"],
    queryFn: async () => {
      const res = await fetch("/api/conversations");
      if (!res.ok) throw new Error("Failed to fetch conversations");
      return await res.json() as Conversation[];
    },
  });

  // Create conversation
  const createConversation = useMutation({
    mutationFn: async (title: string) => {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error("Failed to create conversation");
      return await res.json() as Conversation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
    },
  });

  return {
    conversations: conversationsQuery.data || [],
    isLoading: conversationsQuery.isLoading,
    createConversation: createConversation.mutateAsync,
  };
}

export function useConversation(conversationId: number | null) {
  const queryClient = useQueryClient();
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState("");

  const messagesQuery = useQuery({
    queryKey: ["/api/conversations", conversationId],
    queryFn: async () => {
      if (!conversationId) return { messages: [] };
      const res = await fetch(`/api/conversations/${conversationId}`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      return await res.json() as Conversation & { messages: Message[] };
    },
    enabled: !!conversationId,
  });

  const sendMessage = useCallback(async (content: string) => {
    if (!conversationId) return;

    // Optimistic update for user message
    const tempId = Date.now();
    queryClient.setQueryData(["/api/conversations", conversationId], (old: any) => ({
      ...old,
      messages: [
        ...(old?.messages || []),
        { id: tempId, conversationId, role: "user", content, createdAt: new Date().toISOString() }
      ]
    }));

    setIsStreaming(true);
    setStreamedContent("");

    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) throw new Error("Failed to send message");
      
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content) {
                  setStreamedContent(prev => prev + data.content);
                }
              } catch (e) {
                // Ignore parse errors for incomplete chunks
              }
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsStreaming(false);
      setStreamedContent("");
      // Refresh to get final persisted messages
      queryClient.invalidateQueries({ queryKey: ["/api/conversations", conversationId] });
    }
  }, [conversationId, queryClient]);

  return {
    conversation: messagesQuery.data,
    messages: messagesQuery.data?.messages || [],
    isLoading: messagesQuery.isLoading,
    sendMessage,
    isStreaming,
    streamedContent,
  };
}
