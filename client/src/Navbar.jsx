import React from 'react';
import { Button } from './components/ui/button';
import useAuth from './providers/useAuth';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './components/ui/tooltip';

const Navbar = () => {
    const { signOut, user } = useAuth();
    const handleSignOut = async () => {
        await signOut();

    };
    return (
        <nav className='py-4 flex justify-between items-center bg-zinc-300'>
            <p>Socket</p>
            <div className='flex gap-4'>
                {!user ? <>
                    <Link to={'/login'}>Login</Link>
                    <Link to={'/signup'}>SignUp</Link>
                </> : <>
                    <TooltipProvider>
                        <Tooltip delayDuration={0} >
                            <TooltipTrigger asChild >
                                <Avatar className="cursor-pointer">
                                    <AvatarImage src={user?.user_metadata?.picture} alt="@shadcn" />
                                    <AvatarFallback>{user?.user_metadata.full_name?.[0]?.toUpperCase() || 'A'}</AvatarFallback>
                                </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{user?.user_metadata?.full_name || "Anonymous"}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <Button onClick={handleSignOut}>Logout</Button></>}


            </div>
        </nav>

    );
};

export default Navbar;