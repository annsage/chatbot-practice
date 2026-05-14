// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
// 이전 단계의 패키지 오류를 방지하기 위해 훅 내부의 라이브러리 경로를 확인해야 합니다.
// 만약 useVocabularyChat 내부에서 에러가 난다면 해당 파일의 import를 @ai-sdk/react로 바꿔주세요.
import { useVocabularyChat } from '../api/chat';

const TOPICS = [
  '일상 회화',
  '비즈니스 영어',
  '공항/여행 영어',
  '토익/수능 필수 단어',
];

const DIFFICULTIES = ['초급', '중급', '고급'];

export const Chatbot: React.FC = () => {
  // useVocabularyChat이 내부적으로 @ai-sdk/react의 useChat을 사용한다고 가정합니다.
  const { messages, append, isLoading, error } = useVocabularyChat();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 메시지가 추가될 때마다 자동으로 스크롤을 아래로 내립니다.
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
        {messages.map((m) => (
          <div key={m.id} className={`message ${m.role}`}>
            <div className="message-bubble">
              {/* 줄바꿈을 처리하여 텍스트를 렌더링합니다. */}
              {m.content.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}

        {/* 스트리밍 중일 때 마지막 메시지가 생성 중임을 알리는 표시 (필요 시 유지) */}
        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="message assistant">
            <div className="message-bubble typing-indicator">
              <span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 첫 대화 시작 전후의 UI 분기 처리 */}
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
          오류가 발생했습니다. 잠시 후 다시 시도해주세요.
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
