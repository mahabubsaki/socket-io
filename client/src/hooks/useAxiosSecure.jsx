import useAuth from "@/providers/useAuth";
import axios from "axios";
import { useNavigate } from "react-router-dom";



const axiosPrivate = axios.create({
    baseURL: import.meta.env.VITE_API
});
const useAxiosSecure = () => {
    const navigate = useNavigate();
    const { signOut } = useAuth();
    axiosPrivate.interceptors.request.use(function (config) {
        const token = localStorage.getItem('access-token');
        config.headers.authorization = `Bearer ${token}`;
        return config;
    }, function (error) {
        return Promise.reject(error);
    });


    axiosPrivate.interceptors.response.use(function (response) {
        return response;
    }, async (error) => {
        const status = error.response.status;
        if (status === 401 || status === 403) {
            await signOut();
            navigate('/login');
        }
        return Promise.reject(error);
    });
    return axiosPrivate;
};
export default useAxiosSecure;