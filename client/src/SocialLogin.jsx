import React from 'react';
import { Button } from './components/ui/button';
import { FaDiscord, FaFacebook, FaGithub, FaGoogle, FaLinkedin, FaMicrosoft, FaTwitter } from "react-icons/fa";
import useAuth from './providers/useAuth';

const PROVIDERS = [{ icon: <FaDiscord size={20} />, name: 'discord' }, { icon: <FaGoogle size={20} />, name: 'google' }, { icon: <FaGithub size={20} />, name: 'github' }, { icon: <FaTwitter size={20} />, name: 'twitter' }, { icon: <FaMicrosoft size={20} />, name: 'azure' }, { icon: <FaLinkedin size={20} />, name: 'linkedin_oidc' }];


const SocialLogin = () => {
    const { socialLogin } = useAuth();
    return (
        <div className='flex flex-col w-[200px] mx-auto gap-4'>
            {PROVIDERS.map(i => <Button onClick={() => socialLogin(i.name)} on key={i.name} className='w-full flex gap-2 items-center'>
                <p>{i.icon}</p>
                <p>Sign In With <span className='capitalize'>{i.name}</span></p>
            </Button>)}
        </div>
    );
};

export default SocialLogin;