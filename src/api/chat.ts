import { useChat } from '@ai-sdk/react';

export const useVocabularyChat = () => {
  // useChat automatically handles streaming state from the /api/chat endpoint
  const { messages, append, isLoading, error } = useChat({
    api: '/api/chat',
  });

  return {
    messages,
    append,
    isLoading,
    error,
  };
};
