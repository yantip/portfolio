import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      // Allow access to login page without auth
      if (req.nextUrl.pathname === '/admin/login') {
        return true
      }
      // Require auth for all other admin routes
      return !!token
    },
  },
})

export const config = {
  matcher: ['/admin/:path*'],
}

