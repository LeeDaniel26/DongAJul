import React from 'react';
import { useState, useRef } from 'react'
import Chatbot from './chatbot';
import './Chat.css'

function Chat({messages, handleSendMessage}) {
  return (
    <div>
      <Chatbot></Chatbot>
    </div>
  );
};

export default Chat;