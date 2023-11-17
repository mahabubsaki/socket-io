import React from 'react';
import useAuth from './providers/useAuth';
import { useGetAllUsers } from './api/users';
import { ScrollArea } from './components/ui/scroll-area';
import UserList from './UserList';

const Home = () => {
    const { userLoading } = useAuth();
    const { data: allUsers = [], isLoading, error, isRefetching, isFetching, refetch } = useGetAllUsers(userLoading);


    if (isLoading || userLoading || isRefetching || isFetching) {
        return <div>Loading</div>;
    }

    console.log(allUsers);
    return (
        <div className='flex'>
            <div className="grid grid-cols-1 sm:grid-cols-4 w-full">

                <div className="bg-gray-300 p-4 col-span-1">

                </div>


                <div className="bg-gray-400 p-4 col-span-2">

                </div>


                <div className="bg-gray-300 p-4 col-span-1">
                    <ScrollArea className="h-72 w-full rounded-md border">
                        <div className="p-4">
                            <h4 className="mb-4 text-sm font-medium leading-none">You May Know</h4>
                            {allUsers.map((user) => (
                                <>
                                    <UserList user={user} refetch={refetch} />
                                </>
                            ))}
                        </div>
                    </ScrollArea>


                </div>
            </div>

        </div>
    );
};

export default Home;