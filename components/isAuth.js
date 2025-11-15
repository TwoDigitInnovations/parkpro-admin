
import { useEffect } from "react";
import { useRouter } from "next/router";

const isAuth = (Component) => {
    return function IsAuth(props) {
        const router = useRouter();
        let auth = false;
        let user;
        if (typeof window !== "undefined") {
            user = localStorage.getItem("userDetail");
        }
        if (user) {
            const u = JSON.parse(user)
            const token = localStorage.getItem("token");
            if (router?.pathname === '/' || router?.pathname === '/reports' || router?.pathname === '/users' || router?.pathname === '/officers' || router?.pathname === '/notifications' || router?.pathname === '/technician' || router?.pathname === '/parking') {
                auth = token && (u?.role === 'admin' || u?.role === 'org') ? true : false
            }
           
        }
        useEffect(() => {
            if (!auth) {
                localStorage.clear();
                router.replace('/login')
            }
        }, []);


        return <Component {...props} />;
    };
}

export default isAuth