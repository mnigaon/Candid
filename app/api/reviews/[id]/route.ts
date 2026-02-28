import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { rating, content } = await request.json();

    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (review.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: { rating: Number(rating), content },
    });

    return NextResponse.json(updatedReview);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (review.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.review.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Review deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}