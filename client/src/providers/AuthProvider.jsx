import supabse from '@/configs/supabase.config';
import useAxiosPublic from '@/hooks/useAxiosPublic';
import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'sonner';

export const AuthContext = createContext({});
const socket = io(import.meta.env.VITE_API);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);
    const axiosPublic = useAxiosPublic();




    const signOut = async () => {
        setUserLoading(true);
        toast.loading("Signing Out");
        await supabse.auth.signOut({ scope: "global" });
        setUserLoading(false);
        localStorage.removeItem("userEmail");
        toast.success("Successfully signed out");

    };
    const signUp = async (email, password, username, phone, profile) => {

        setUserLoading(true);
        toast.loading("Signin Up");
        const data = await supabse.auth.signUp({ email, password, options: { data: { full_name: username, phone: phone, picture: profile } } });
        setUserLoading(false);
        if (data.error) {
            toast.error(data.error.message);
            return false;
        } else {
            toast.success("Successfully Signed Up");
        }
        return true;
    };

    const signIn = async (email, password) => {
        setUserLoading(true);
        toast.loading("Signing In");
        const data = await supabse.auth.signInWithPassword({ email, password });
        setUserLoading(false);
        if (data.error) {
            toast.error(data.error.message);
        } else {
            toast.success("Successfully Logged In");
        }
    };
    const socialLogin = async (provider) => {
        setUserLoading(true);
        const data = await supabse.auth.signInWithOAuth({ provider });
        setUserLoading(false);

    };



    useEffect(() => {

        const { data } = supabse.auth.onAuthStateChange(async (event, session) => {
            setUserLoading(true);
            const user = session?.user || null;

            if (user) {
                try {
                    const { data } = await axiosPublic.put('/auth/login', user);
                    setUser(data);
                    localStorage.setItem("userEmail", user.email);

                } catch (err) {
                    console.log(err);
                }
            } else {
                setUser(null);
            }
            setUserLoading(false);
        });
        return () => {
            data.subscription.unsubscribe();
        };
    }, []);

    const authInfo = {
        user,
        userLoading,
        signOut,
        signUp,
        signIn,
        socialLogin,
        socket
    };
    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;