import React from 'react';
import { Button } from './components/ui/button';
import useAuth from './providers/useAuth';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const { signOut, user } = useAuth();
    const handleSignOut = async () => {
        await signOut();
        alert("singed out");
    };
    return (
        <nav className='py-4 flex justify-between items-center bg-zinc-300'>
            <p>Socket</p>
            <div className='flex gap-4'>
                {!user ? <>
                    <Link to={'/login'}>Login</Link>
                    <Link to={'/signup'}>SignUp</Link>
                </> : <Button onClick={handleSignOut}>Logout</Button>}


            </div>
        </nav>

    );
};

export default Navbar;