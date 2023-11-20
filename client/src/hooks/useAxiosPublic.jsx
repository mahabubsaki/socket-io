import useAuth from "@/providers/useAuth";
import axios from "axios";
import { useEffect } from "react";



const axiosPublic = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? import.meta.env.VITE_API_PROD : import.meta.env.VITE_API_DEV
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