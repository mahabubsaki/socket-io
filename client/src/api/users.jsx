
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";


const useGetAllUsers = () => {
    const axiosPublic = useAxiosPublic();

    return useQuery({
        queryKey: ['all-users'],
        queryFn: async () => {
            const { data } = await axiosPublic.get('/users/all');
            return data;
        }
    });
};


const useGetAllFriends = () => {

    const axiosPublic = useAxiosPublic();

    return useQuery({
        queryKey: ['all-friends'],
        queryFn: async () => {
            const { data } = await axiosPublic.get('/users/friends');
            return data;
        }
    });
};


const useCheckFriendShip = (id) => {
    const axiosPublic = useAxiosPublic();

    return useQuery({
        queryKey: ['check-friendShip', id],
        queryFn: async () => {
            const { data } = await axiosPublic.get(`/users/check-friendship/${id}`);
            return data;
        },
        enabled: !!id
    });
};



const useGetRoomMessages = (roomId) => {
    const axiosPublic = useAxiosPublic();
    return useQuery({
        queryKey: ['room-messages', roomId],
        queryFn: async () => {
            const { data } = await axiosPublic.get(`/chats/room-messages/${roomId}`);
            return data;
        },
        enabled: !!roomId
    });
};


export {
    useGetAllUsers, useGetAllFriends, useCheckFriendShip, useGetRoomMessages
};