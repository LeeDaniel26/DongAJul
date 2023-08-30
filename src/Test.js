import React, { useState } from 'react';
import axios from 'axios';
import './Chat.css'
import MessageBubble from './MessageBubble';
import PDFUpload from './PDFUpload'

const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions'; // API endpoint for the GPT-3.5 model
const API_KEY = process.env.REACT_APP_API_KEY;

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  const handleSendMessage = async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      if (userInput.trim() === '') return;

      // Include the user message in the messages state
      const newMessage = { role: 'user', content: userInput };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setUserInput('');

      try {
        const response = await axios.post(
          API_ENDPOINT,
          {
            model: 'gpt-3.5-turbo',
            messages: [...messages, newMessage].map((message) => ({ role: message.role, content: message.content })),
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${API_KEY}`,
            },
          }
        );

        const assistantMessage = response.data.choices[0].message.content;
        // Include the assistant message in the messages state
        setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: assistantMessage }]);
      } catch (error) {
        console.error('Error occurred while fetching the response:', error);
      }
    }
  };

  const handleTextAreaHeight = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  }

  return (
    <div>
      <PDFUpload />
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            {message.role === 'user' ? (
              <div>
                <div className='prompt-bubble-container'>
                  <div className='prompt-bubble'>
                    <div className='prompt-bubble-content'>
                      {message.content}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <MessageBubble message={message.content} />
              </div>
            )}
          </div>
        ))}
      </div>
      <div>
        <footer></footer>
      </div>
      <div className='prompt-container'>
        <div className='prompt-textarea-container'>
          <textarea value={userInput} rows="1" className='prompt-textarea-box' onChange={(e) => setUserInput(e.target.value)} onKeyDown={handleSendMessage} placeholder="Thype Prompt Here..." onInput={handleTextAreaHeight}></textarea>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;