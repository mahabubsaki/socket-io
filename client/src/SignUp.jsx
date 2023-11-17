import React, { useEffect } from 'react';
import { Label } from './components/ui/label';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import useAuth from './providers/useAuth';
import { useNavigate } from 'react-router-dom';
import SocialLogin from './SocialLogin';

const FORM_FIELDS = ['email', 'password', 'name', 'phone', 'profile'];

const SignUp = () => {
    const { signUp, user } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {};
        FORM_FIELDS.forEach(item => {
            data[item] = e.target[item].value;
        });
        await signUp(data.email, data.password, data.name, data.phone, data.profile);

    };
    useEffect(() => {
        let timeId;
        if (user) {
            timeId = setTimeout(() => {
                navigate('/');
            }, 500);
            return () => {
                clearTimeout(timeId);
            };
        }
    }, [user]);
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input name="email" type="email" id="email" placeholder="Email" />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input name="name" type="name" id="name" placeholder="Name" />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="phone">Phone</Label>
                    <Input name="phone" type="phone" id="phone" placeholder="Phone" />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="profile">Photo</Label>
                    <Input name="profile" type="profile" id="profile" placeholder="Photo URL" />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="email">Password</Label>
                    <Input name="password" type="password" id="password" placeholder="Password" />
                </div>
                <Button type="submit">Submit</Button>
            </form>
            <SocialLogin />
        </>
    );
};

export default SignUp;