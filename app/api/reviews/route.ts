import { NextRequest, NextResponse } from "next/server";
import { auth as getServerSession } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

// 리뷰 전체 조회
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const restaurantId = searchParams.get("restaurantId");
  const sort = searchParams.get("sort") || "latest";
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = parseInt(searchParams.get("skip") || "0");

  try {
    let orderBy: any = { createdAt: "desc" };

    if (sort === "highest") {
      orderBy = { rating: "desc" };
    } else if (sort === "lowest") {
      orderBy = { rating: "asc" };
    }

    const reviews = await prisma.review.findMany({
      where: restaurantId ? {
        restaurant: {
          googleId: restaurantId
        }
      } : {},
      include: {
        user: {
          select: { name: true, image: true },
        },
      },
      orderBy,
      take: limit,
      skip: skip,
    });

    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// 리뷰 작성
export async function POST(request: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { rating, content, restaurantId, restaurantData } =
      await request.json();

    let restaurant = await prisma.restaurant.findUnique({
      where: { googleId: restaurantId },
    });

    if (!restaurant) {
      restaurant = await prisma.restaurant.create({
        data: {
          googleId: restaurantId,
          name: restaurantData.name,
          address: restaurantData.address,
          city: restaurantData.city,
          imageUrl: restaurantData.imageUrl,
          category: restaurantData.category,
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const review = await prisma.review.create({
      data: {
        rating,
        content,
        userId: user.id,
        restaurantId: restaurant.id,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}