import React, { useEffect, useState } from 'react';

const Chat = ({ socket, roomInfo }) => {

    const [messages, setMessages] = useState([]);
    const handleSendMessage = async (e) => {
        e.preventDefault();
        const messageData = {
            time: new Date(),
            user: roomInfo.user,
            room: roomInfo.room,
            message: e.target.message.value
        };
        await socket.emit("send_message", messageData);
        setMessages(pre => [...pre, messageData]);
        r = 0;
    };
    useEffect(() => {

        if (socket) {
            const receiveMessage = (data) => {
                setMessages(prev => [...prev, data]);
            };

            socket.on("recieve_message", receiveMessage);

            return () => {
                socket.off("recieve_message", receiveMessage);
            };
        }
    }, [socket]);
    return (
        <div>
            <div>
                <p> Live Chat</p>
                {messages.length}
                <form onSubmit={handleSendMessage}>
                    <input type="text" required name='message' />
                    <button type="submit">send</button>
                </form>
            </div>
            <div>
                {messages.map(i => <p>{i.message}</p>)}
            </div>
        </div>
    );
};

export default Chat;