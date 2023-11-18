import React from 'react';
import useAuth from './providers/useAuth';
import { useCheckFriendShip, useGetAllFriends, useGetAllUsers } from './api/users';
import { ScrollArea } from './components/ui/scroll-area';
import UserList from './UserList';
import FriendList from './FriendList';
import MessageArea from './MessageArea';
import { Navigate, useParams } from 'react-router-dom';
import ScrollToBottom from 'react-scroll-to-bottom';

const Home = () => {
    const { userLoading } = useAuth();
    const { id } = useParams();
    const { data: allUsers = [], isLoading, isRefetching, isFetching, refetch } = useGetAllUsers();
    const { data: allFriends = [], isLoading: isLoading2, isRefetching: isRefetching2, isFetching: isFetching2, refetch: refetch2 } = useGetAllFriends();
    const { data: isFriend = { isFriend: false }, error, isLoading: isLoading3 } = useCheckFriendShip(id);


    if (isLoading || userLoading || isRefetching || isFetching || isLoading2 || isRefetching2 || isFetching2 || (id && isLoading3)) {
        return <div>Loading</div>;
    }
    if ((id && !isFriend.isFriend) || error) {
        return <Navigate to={'/'} />;
    }

    return (
        <div className='flex'>
            <div className="grid grid-cols-1 sm:grid-cols-4 w-full min-h-screen ">

                <div className="bg-gray-300 p-4 col-span-1">
                    <ScrollArea className="h-screen w-full rounded-md border pb-20">
                        <div className="p-0">
                            <h4 className="mb-4 text-sm font-medium leading-none text-center mt-4">Your Friends</h4>
                            {allFriends.map((user) => (

                                <FriendList id={id} key={user?.userDetails?._id} user={user} />

                            ))}
                        </div>
                    </ScrollArea>
                </div>


                <div className="bg-gray-400 p-4 col-span-2 h-full rounded-sm">
                    {!id ? <div className='h-full items-center  flex justify-center'>
                        <p className='text-4xl'>Choose Friend To Chat</p>
                    </div> : <MessageArea id={id} />}

                </div>



                <div className="bg-gray-300 p-4 col-span-1">
                    <ScrollArea className="h-screen w-full rounded-md border pb-20">
                        <div className="p-0">
                            <h4 className="mb-4 text-sm font-medium leading-none text-center mt-4">You May Know</h4>
                            {allUsers.map((user) => (

                                <UserList key={user?._id} user={user} refetch={refetch} refetch2={refetch2} />

                            ))}
                        </div>
                    </ScrollArea>


                </div>
            </div>

        </div>
    );
};

export default Home;