import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    console.log("Middleware running for:", req.nextUrl.pathname);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // If user has a token, they're authenticated
        if (token) {
          // Authenticated users should not access login page
          if (pathname === "/login") {
            return false; // This will redirect them away from login
          }
          return true;
        }

        // Unauthenticated users can only access login page
        if (pathname === "/login") {
          return true;
        }

        // All other routes require authentication
        return false;
      },
    },
    pages: {
      signIn: "/login", // Redirect unauthenticated users here
    },
  }
);

export const config = {
  matcher: [
    "/", // Protect home page
    "/login", // Handle login page access
    "/newuser", // Protect newuser page
  ],
};
