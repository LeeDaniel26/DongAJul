import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { pdfjs } from 'react-pdf'
import './Chat.css'
import MessageBubble from './MessageBubble';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions'; // API endpoint for the GPT-3.5 model
const API_KEY = process.env.REACT_APP_API_KEY;

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [allText, setAllText] = useState('');
  const textareaRef = useRef(null);

  function PDFUpload() {
    const [file, setFile] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const fileInputRef = useRef(null);

    function onFileChange(e) {
      setFile(e.target.files[0]);
    }

    function onDocumentLoadSuccess({ numPages }) {
      setNumPages(numPages);
    }

    function handleUploadClick() {
      fileInputRef.current.click();
    }

    return (
      <div>
        <button onClick={handleUploadClick}>PDF Upload</button>
        <input
          type="file"
          accept=".pdf"
          onChange={onFileChange}
          style={{ display: 'none' }}
          ref={fileInputRef}
        />
        {file && (
          <PDFExtract file={file} />
        )}
      </div>
    );
  }

  function PDFExtract({ file }) {

    useEffect(() => {
      async function extractTextFromFile() {
        const pdf = await pdfjs.getDocument({ url: URL.createObjectURL(file) }).promise;
        const numPages = pdf.numPages;
        let newText = '';

        for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
          const page = await pdf.getPage(pageNumber);
          const content = await page.getTextContent();
          const strings = content.items.map((item) => item.str);
          newText += strings.join(' ') + ' ';
        }

        setAllText(newText);
      }

      if (file) {
        extractTextFromFile();
      }
    }, [file]);

    return (
      <div>
        {/* <p>Extract PDF Text</p>
        <pre>{allText}</pre> */}
      </div>
    );
  }

  const handleSendMessage = async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      if (userInput.trim() === '') return;

      // Include the user message in the messages state
      const newMessage = { role: 'user', content: userInput };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setUserInput('');
      setAllText('');

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
          <textarea ref={textareaRef} value={userInput + allText} rows="1" className='prompt-textarea-box' onChange={(e) => setUserInput(e.target.value)} onKeyDown={handleSendMessage} placeholder="Thype Prompt Here..." onInput={handleTextAreaHeight}></textarea>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;


/* 궁금한 점
 - Chat 컴포넌트는 prompt를 입력할때마다 message 배열을 update하는데, 전에 render 했던 message element를
   어떻게 re-render 하지 않고 새로운 element만 render를 하게 되지?

*/