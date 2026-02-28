import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

// 이 파일에는 Prisma를 절대 import 하지 마세요!
export default {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            checks: ["none"],
        }),
    ],
} satisfies NextAuthConfig;
