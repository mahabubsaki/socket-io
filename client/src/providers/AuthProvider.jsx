import supabse from '@/configs/supabase.config';
import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);




    const signOut = () => {
        setUserLoading(true);
        supabse.auth.signOut({ scope: "global" }).then((value) => {
            console.log(value);
            setUserLoading(false);
        }).catch((err) => {
            throw new Error({ error: true, message: err });
        });
    };
    const signUp = (email, password, username, phone) => {
        console.log(email, password, username, phone);
        setUserLoading(true);
        supabse.auth.signUp({ email, password, phone, options: { data: { username: username }, } }).then((value) => {
            setUserLoading(false);
            return value;
        });
    };

    const signIn = async (email, password) => {
        setUserLoading(true);
        const data = await supabse.auth.signInWithPassword({ email, password });
        setUserLoading(false);
        return data;
    };
    const socialLogin = (provider) => {
        setUserLoading(true);
        supabse.auth.signInWithOAuth({ provider, options: { scopes: "global" } }).then((value) => {
            setUserLoading(false);
            return value;
        }).catch((err) => {
            throw new Error({ error: true, message: err });
        });
    };
    useEffect(() => {
        console.log(user);
    }, [user]);


    useEffect(() => {

        const { data } = supabse.auth.onAuthStateChange((event, session) => {
            if (event === 'INITIAL_SESSION') {
                setUserLoading(true);
            } else if (event === 'SIGNED_IN') {
                setUser(session.user);
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
            } else {
                setUser(session.user);
            }
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
        socialLogin
    };
    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;