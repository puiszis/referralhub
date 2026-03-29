import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

let _devFallbackHash: string | null = null;

function getAdminHash(): string {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (hash) return hash;
  if (!_devFallbackHash) {
    _devFallbackHash = bcrypt.hashSync("admin123", 10);
  }
  return _devFallbackHash;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const expectedEmail = (process.env.ADMIN_EMAIL || "admin@referralhub.com").toLowerCase();
        const expectedHash = getAdminHash();

        if (!expectedHash) return null;

        const emailMatch = credentials.email.toLowerCase() === expectedEmail;
        const passwordMatch = bcrypt.compareSync(credentials.password, expectedHash);

        if (!emailMatch || !passwordMatch) return null;
        return { id: "1", email: expectedEmail, name: "Admin" };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
  },
  pages: { signIn: "/admin/login" },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret-not-for-production",
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as Record<string, unknown>).role = token.role;
      }
      return session;
    },
  },
};
