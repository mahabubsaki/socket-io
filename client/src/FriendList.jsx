import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Separator } from './components/ui/separator';
import { formatDistanceToNow } from 'date-fns';
import compareDate from './utils/compareDate';
import { Link } from 'react-router-dom';

const FriendList = ({ user, id }) => {

    return (
        <>
            <Link to={`/${user?.userDetails?._id}`}>
                <div className={`text-sm flex gap-4 hover:bg-gray-400 ${id === user?.userDetails?._id ? 'bg-gray-400' : ''} duration-300 cursor-pointer rounded-lg p-2`}>
                    <Avatar className="cursor-pointer">
                        <AvatarImage src={user?.userDetails?.user_metadata?.picture} alt="@shadcn" />
                        <AvatarFallback>{user?.userDetails?.user_metadata?.full_name?.[0]?.toUpperCase() || 'A'}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p>{user?.userDetails?.user_metadata?.full_name}</p>
                        <p className='text-xs'>Last Seen : {formatDistanceToNow(new Date(compareDate(user?.userDetails?.last_sign_in_at, user?.userDetails?.lastModified)), { addSuffix: true, includeSeconds: true })}</p>
                    </div>

                </div>

                <Separator className="mb-2" />
            </Link>
        </>
    );
};

export default FriendList;