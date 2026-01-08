import { useEffect } from "react";
import { useRouter } from "next/router";

const isAuth = (Component) => {
  return function IsAuth(props) {
    const router = useRouter();

    let auth = false;
    let user;

    const publicPages = [
      "/privacyPolicy",
      "/termsAndConditions",
    ];

    const isPublic = publicPages.includes(router.pathname);

    if (typeof window !== "undefined") {
      user = localStorage.getItem("userDetail");
    }

    if (user) {
      const u = JSON.parse(user);
      const token = localStorage.getItem("token");

      if (
        router.pathname === "/" 
      ) {
        auth =
          token && (u?.role === "superadmin"||u?.role === "admin" )
            ? true
            : false;
      } else if (
        router.pathname === "/organization" 
      ) {
        auth =
          token && (u?.role === "superadmin" )
            ? true
            : false;
      } else if (
        router.pathname === "/reports" ||
        router.pathname === "/users" ||
        router.pathname === "/officers" ||
        router.pathname === "/notifications" ||
        router.pathname === "/technician" ||
        router.pathname === "/parking"
      ) {
        auth =
          token && (u?.role === "admin")
            ? true
            : false;
      } else {
        auth = true; // Other authenticated pages allowed
      }
    }

    useEffect(() => {
      if (!auth && !isPublic) {
        localStorage.clear();
        router.replace("/login");
      } 
    }, [auth, isPublic]);

    return <Component {...props} />;
  };
};

export default isAuth;
