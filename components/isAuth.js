import { useEffect } from "react";
import { useRouter } from "next/router";

const roleAccess = {
  superadmin: ["/", "/organization"],
  admin: ["/", "/reports", "/users", "/officers", "/notifications", "/technician", "/parking"],
  landlord_admin: ["/", "/Building", "/users","parkinglots"],
  landlord: ["/", "/reports"],
};

const publicPages = ["/privacyPolicy", "/termsAndConditions"];

const isAuth = (Component) => {
  return function IsAuth(props) {
    const router = useRouter();
    const { pathname } = router;

    let auth = false;

    if (typeof window !== "undefined") {
      const user = localStorage.getItem("userDetail");
      const token = localStorage.getItem("token");

      if (user && token) {
        const parsedUser = JSON.parse(user);
        const role = parsedUser?.role;

        if (publicPages.includes(pathname)) {
          auth = true;
        } else {
          auth = roleAccess[role]?.includes(pathname);
        }
      }
    }

    useEffect(() => {
      if (!auth && !publicPages.includes(pathname)) {
        // localStorage.clear();
        // router.replace("/login");
      }
    }, [auth, pathname]);

    return auth || publicPages.includes(pathname) ? (
      <Component {...props} />
    ) : null;
  };
};

export default isAuth;
