import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

export async function GET(request: NextRequest) {
    const session = await auth();
    const searchParams = request.nextUrl.searchParams;
    const sort = searchParams.get("sort") || "latest";
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = parseInt(searchParams.get("skip") || "0");

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        let orderBy: any = { createdAt: "desc" };

        if (sort === "highest") {
            orderBy = { rating: "desc" };
        } else if (sort === "lowest") {
            orderBy = { rating: "asc" };
        }

        const reviews = await prisma.review.findMany({
            where: { userId: session.user.id },
            include: {
                restaurant: true,
                user: {
                    select: { name: true, image: true }
                }
            },
            orderBy,
            take: limit,
            skip: skip,
        });

        return NextResponse.json(reviews);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to fetch your reviews" },
            { status: 500 }
        );
    }
}
