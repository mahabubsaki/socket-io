import App from "@/App";
import Home from "@/Home";
import Login from "@/Login";
import PrivateRoute from "@/PrivateRoute";
import SignUp from "@/SignUp";
import { createBrowserRouter } from "react-router-dom";


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <PrivateRoute><Home /></PrivateRoute>
            },
            {
                path: "/:id",
                element: <PrivateRoute><Home /></PrivateRoute>
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "signup",
                element: <SignUp />
            }
        ]
    }
]);

export default router;