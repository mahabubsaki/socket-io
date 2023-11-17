
import useAxiosPublic from "@/hooks/useAxiosPublic";
import useAuth from "@/providers/useAuth";
import { useQuery } from "@tanstack/react-query";


const useGetAllUsers = () => {
    const { user } = useAuth();
    const axiosPublic = useAxiosPublic();

    return useQuery({
        queryKey: ['all-users'],
        queryFn: async () => {
            const { data } = await axiosPublic.get('/users/all');
            return data;
        }
    });
};




export {
    useGetAllUsers
};