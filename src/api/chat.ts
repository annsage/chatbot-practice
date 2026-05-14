// @ts-nocheck
import { useChat } from '@ai-sdk/react';

export const useVocabularyChat = () => {
  // useChat automatically handles streaming state from the /api/chat endpoint
  // @ts-ignore
  const chat = useChat({
    api: '/api/chat',
  }) as any;

  return {
    messages: chat.messages,
    append: chat.append,
    isLoading: chat.isLoading,
    error: chat.error,
  };
};
