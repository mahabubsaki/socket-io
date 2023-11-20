import React, { useContext, useEffect, useRef, useState } from 'react';
import { Textarea } from './components/ui/textarea';
import { Button } from './components/ui/button';
import { ScrollArea } from './components/ui/scroll-area';
import useAuth from './providers/useAuth';
import CryptoJS from 'crypto-js';
import { toast } from 'sonner';
import { useGetRoomMessages } from './api/users';
import { Navigate } from 'react-router-dom';
import { format } from 'date-fns';
import ScrollToBottom, { useScrollToBottom } from 'react-scroll-to-bottom';
import ToolTip from './ToolTip';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';

const MessageArea = ({ id }) => {
    const { socket, user } = useAuth();
    const [isConnected, setIsConnected] = useState(socket.connected);


    const formRef = useRef();
    const [roomId, setRoomId] = useState(null);
    const { data: loadedMessage = [], isLoading, error, refetch } = useGetRoomMessages(roomId);

    const loading = isLoading && roomId;
    const refs = useRef();
    const [messages, setMessages] = useState([]);
    console.log(messages);
    useEffect(() => {
        if (loadedMessage.length > 0 && roomId) {
            setMessages(loadedMessage);
        }
    }, [loadedMessage, roomId]);
    const scrollIntoView = () => {
        refs.current.scrollIntoView({ behavior: "smooth", block: "end" });

    };
    function onConnect() {
        setIsConnected(true);
    }

    function onDisconnect() {
        setIsConnected(false);
    }
    useEffect(() => {

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);


        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, []);
    useEffect(() => {
        if (!id) return;
        const ids = [id, user?._id].sort();
        const roomAddress = CryptoJS.SHA256(ids.join('')).toString();
        setRoomId(roomAddress);
        socket.emit("join_room", roomAddress);
    }, [id]);

    useEffect(() => {

        if (socket) {
            const receiveMessage = (data) => {
                console.log(data);
                setMessages(prev => [...prev, data]);
            };

            socket.on("recieve_message", receiveMessage);

            return () => {
                socket.off("recieve_message", receiveMessage);
            };
        }
    }, [socket]);
    const sendMessage = async (message) => {
        if (!message) {

            return toast.error("Message Can't be Empty");
        }

        const messageData = {
            time: new Date(),
            user: id,
            author: user?._id,
            room: roomId,
            message: message
        };
        await socket.emit("send_message", messageData);
        setMessages(pre => [...pre, messageData]);
        scrollIntoView();
        refetch();

    };
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const message = e.target.message.value;
        sendMessage(message);
        e.target.reset();


    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage(e.target.value);
            formRef.current.value = '';
        }

    };

    useEffect(() => {
        if (messages.length == 0) return;
        const timeID = setTimeout(() => {
            scrollIntoView();
        }, 200);
        return () => {
            clearTimeout(timeID);
        };
    }, [messages]);
    if (error) {
        return <Navigate to='/' />;
    }
    if (loading) {
        return <div>Loading</div>;
    }

    return (
        <>
            <p>{isConnected ? 'connected' : 'not connected'}</p>
            <ScrollArea className="h-[calc(100vh-180px)] pb-1" >


                <div className='p-4 flex flex-col gap-4 '>

                    {messages.map(i => (

                        <div key={i?._id} className={` max-w-[50%]  ${user?._id === i.author ? 'ml-auto text-white text-right' : 'mr-auto text-black '}`}>
                            <div >
                                <div className='flex gap-4 items-center'>
                                    {user?._id === i.author ? null : <ToolTip title={i?.userDetails?.user_metadata?.full_name}>
                                        <Avatar className="cursor-pointer">
                                            <AvatarImage src={i?.userDetails?.user_metadata?.picture} alt="@shadcn" />
                                            <AvatarFallback>{i?.userDetails?.user_metadata?.full_name?.[0]?.toUpperCase() || 'A'}</AvatarFallback>
                                        </Avatar>
                                    </ToolTip>}
                                    <div className={` p-4 rounded-2xl w-fit   ${user?._id === i.author ? 'bg-blue-500 ml-auto' : ' bg-gray-300 mr-auto'}`}>
                                        <p>{i.message}</p>

                                    </div>
                                </div>
                                <p className={` ${user?._id === i.author ? 'text-right' : 'text-left'} text-[10px] mt-1`}>at {format(new Date(i.time), 'PPpp')}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={refs}></div>
                </div>


            </ScrollArea>

            <form className="flex w-full gap-2 items-center" onSubmit={handleFormSubmit}>
                <Textarea ref={formRef} onKeyPress={handleKeyPress} name="message" placeholder="Type your message here." className="resize-none" />
                <Button type="submit">Send message</Button>
            </form>

        </>
    );
};

export default MessageArea;