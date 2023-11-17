import React from 'react';
import { Label } from './components/ui/label';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import useAuth from './providers/useAuth';

const FORM_FIELDS = ['email', 'password', 'name', 'phone'];

const SignUp = () => {
    const { signUp } = useAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {};
        FORM_FIELDS.forEach(item => {
            data[item] = e.target[item].value;
        });
        try {
            await signUp(data.email, data.password, data.name, data.phone);

        } catch (err) {
            console.dir(err);
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
                <Label htmlFor="name">Name</Label>
                <Input name="name" type="name" id="name" placeholder="Name" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input name="phone" type="phone" id="phone" placeholder="Phone" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="email">Password</Label>
                <Input name="password" type="password" id="password" placeholder="Password" />
            </div>
            <Button type="submit">Submit</Button>
        </form>
    );
};

export default SignUp;