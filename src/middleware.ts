import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/dashboard/:path*", "/modules/:path*", "/units/:path*", "/project/:path*", "/profile/:path*", "/admin/:path*"],
};
