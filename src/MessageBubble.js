import { useState, useEffect } from 'react'
import './Chat.css'

const MessageBubble = ({ message }) => {
    const [isTyping, setIsTyping] = useState(true);
    const [visibleMessage, setVisibleMessage] = useState("");

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            if (index < message.length) {
                setVisibleMessage((prevMessage) => prevMessage + message[index]);
                index++;
            } else {
                setIsTyping(false);
                clearInterval(interval);
            }
        }, 0.001);

        return () => {
            clearInterval(interval);
        };
    }, [message]);

    return (
        <div className='message-bubble-container'>
            <div className="message-bubble">
                <p className="prompt-bubble-content">{visibleMessage}</p>
                {isTyping && <span className="typing-indicator">|</span>}
            </div>
        </div>
    );
};

export default MessageBubble;