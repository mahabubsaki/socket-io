import useAuth from "@/providers/useAuth";
import axios from "axios";
import { useEffect } from "react";



const axiosPublic = axios.create({
    baseURL: import.meta.env.VITE_API
});
const useAxiosPublic = () => {




    axiosPublic.interceptors.request.use(function (config) {

        config.headers.email = localStorage.getItem("userEmail");
        return config;
    }, function (error) {
        return Promise.reject(error);
    });



    return axiosPublic;
};
export default useAxiosPublic;