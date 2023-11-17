import React from 'react';
import { Label } from './components/ui/label';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import useAuth from './providers/useAuth';
import { toast } from 'sonner';

const FORM_FIELDS = ['email', 'password'];
const Login = () => {
    const { signIn } = useAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {};
        FORM_FIELDS.forEach(item => {
            data[item] = e.target[item].value;
        });
        toast.loading("Signing In");
        const response = await signIn(data.email, data.password);
        if (response.error) {
            toast.error(response.error.message);
        }


        // alert("signed up");
    };
    return (
        <form onSubmit={handleSubmit}>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input name="email" type="email" id="email" placeholder="Email" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="email">Password</Label>
                <Input name="password" type="password" id="password" placeholder="Password" />
            </div>
            <Button type="submit">Submit</Button>
        </form>
    );
};

export default Login;