import React from 'react';
import { Separator } from './components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Button } from './components/ui/button';
import { RiUserReceived2Line } from "react-icons/ri";

import { IoMdPersonAdd } from "react-icons/io";
import compareDate from './utils/compareDate';
import useAxiosPublic from './hooks/useAxiosPublic';
import useAuth from './providers/useAuth';
import { toast } from 'sonner';
import { FaUserCheck } from 'react-icons/fa';
import ToolTip from './ToolTip';

const UserList = ({ user, refetch, refetch2 }) => {
    const axiosPublic = useAxiosPublic();
    const { user: currentUser } = useAuth();
    const handleSendRequest = async (email) => {
        const requestInfo = { sender: currentUser.email, reciever: email, time: new Date() };
        toast.loading("Sending Friend Request");
        try {
            const { data } = await axiosPublic.post("/users/send-request", requestInfo);
            toast.success(data.message);
            refetch();
        } catch (err) {
            toast.error(err.message);
        }

    };


    const handleAcceptRequest = async (email, userId) => {

        const acceptInfo = { friends: [{ author: currentUser.email, friend: email, timestamp: new Date(), userId }, { author: email, friend: currentUser.email, timestamp: new Date(), userId: currentUser?._id }], senderEmail: email };
        toast.loading("Accepting Friend Request");
        try {
            const { data } = await axiosPublic.post('/users/accept-request', acceptInfo);
            refetch();
            refetch2();
            toast.success(data.message);
        } catch (err) {
            toast.error(err.message);
        }
    };
    return (
        <>
            <div className="text-sm flex gap-4 justify-between p-2 items-center">
                <Avatar className="cursor-pointer">
                    <AvatarImage src={user?.user_metadata?.picture} alt="@shadcn" />
                    <AvatarFallback>{user?.user_metadata?.full_name?.[0]?.toUpperCase() || 'A'}</AvatarFallback>
                </Avatar>
                <div>
                    <p>{user?.user_metadata?.full_name}</p>
                    <p className='text-xs'>Last Seen : {formatDistanceToNow(new Date(compareDate(user?.last_sign_in_at, user?.lastModified)), { addSuffix: true, includeSeconds: true })}</p>
                </div>
                <Button onClick={() => {
                    console.log(user?.hasReceived, user?.hasSent);
                    if (user?.hasReceived) {
                        handleAcceptRequest(user?.email, user?._id);
                    } else if (user?.hasSent) {

                    }
                    else {
                        handleSendRequest(user?.email);
                    }
                }} variant="secondary" size="icon">
                    {user?.hasSent ? <ToolTip title={'Request Sent'}><FaUserCheck size={20} /></ToolTip> : user?.hasReceived ? <ToolTip title='Accept Request'><RiUserReceived2Line size={20} /></ToolTip> : <ToolTip title='Send Request'><IoMdPersonAdd size={20} /></ToolTip>}


                </Button>
            </div>

            <Separator className="my-2" />
        </>
    );
};

export default UserList;