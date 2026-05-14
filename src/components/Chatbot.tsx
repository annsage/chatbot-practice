import React, { useState, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import type { Message } from 'ai';
import { useVocabularyChat } from '../api/chat';

const TOPICS = [
  '일상 회화',
  '비즈니스 영어',
  '공항/여행 영어',
  '토익/수능 필수 단어',
];

const DIFFICULTIES = ['초급', '중급', '고급'];

export const Chatbot: React.FC = () => {
  const { messages, append, isLoading, error } = useVocabularyChat();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
  };

  const handleDifficultySelect = (difficulty: string) => {
    if (!selectedTopic) return;
    
    const content = `주제: ${selectedTopic}\n난이도: ${difficulty}\n\n위 조건에 맞는 영어 단어 퀴즈를 시작해줘.`;
    append({
      role: 'user',
      content,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    
    append({
      role: 'user',
      content: inputValue,
    });
    setInputValue('');
  };

  return (
    <div className="chatbot-container">
      <header className="chatbot-header">
        <h2>📚 영어 단어 퀴즈 챗봇</h2>
        <p>원하는 주제와 난이도를 선택하거나 직접 입력해보세요.</p>
      </header>

      <div className="chat-window">
        {messages.map((m: Message) => (
          <div key={m.id} className={`message ${m.role}`}>
            <div className="message-bubble">
              {m.content.split('\n').map((line: string, i: number) => (
                <React.Fragment key={i}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant">
            <div className="message-bubble typing-indicator">
              <span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length === 0 && (
        <div className="selection-area">
          {!selectedTopic ? (
            <div className="options-container">
              <h3>주제를 선택해주세요</h3>
              <div className="button-grid">
                {TOPICS.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => handleTopicSelect(topic)}
                    className="option-btn"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="options-container">
              <h3>난이도를 선택해주세요 ({selectedTopic})</h3>
              <div className="button-grid">
                {DIFFICULTIES.map((diff) => (
                  <button
                    key={diff}
                    onClick={() => handleDifficultySelect(diff)}
                    className="option-btn"
                  >
                    {diff}
                  </button>
                ))}
              </div>
              <button 
                className="reset-btn"
                onClick={() => setSelectedTopic(null)}
              >
                주제 다시 선택
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="error-message">
          오류가 발생했습니다: {error.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="주제나 난이도를 직접 입력하거나 '퀴즈 시작'을 입력하세요..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !inputValue.trim()}>
          전송
        </button>
      </form>
    </div>
  );
};
