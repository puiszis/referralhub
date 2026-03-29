import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

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
        const adminEmail = process.env.ADMIN_EMAIL || "admin@referralhub.com";
        const adminPasswordHash =
          process.env.ADMIN_PASSWORD_HASH ||
          bcrypt.hashSync("admin123", 10);

        if (credentials.email !== adminEmail) return null;
        const valid = bcrypt.compareSync(credentials.password, adminPasswordHash);
        if (!valid) return null;
        return { id: "1", email: adminEmail, name: "Admin" };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret-change-in-production",
};
