"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/Header";
import { ReviewCard } from "@/components/ReviewCard";
import Link from "next/link";

interface Review {
    id: string;
    rating: number;
    content: string;
    createdAt: string;
    userId: string;
    user: { name: string; image: string };
    restaurant: {
        id: string;
        googleId: string;
        name: string;
    };
}

export default function MyReviewsPage() {
    const { data: session, status } = useSession();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState("latest");

    const fetchMyReviews = async () => {
        try {
            const res = await fetch(`/api/reviews/my?sort=${sort}`);
            const data = await res.json();
            setReviews(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === "authenticated") {
            fetchMyReviews();
        } else if (status === "unauthenticated") {
            setLoading(false);
        }
    }, [status, sort]);

    if (status === "loading") {
        return (
            <main className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse text-center text-gray-400">
                    Loading your profile...
                </div>
            </main>
        );
    }

    if (status === "unauthenticated") {
        return (
            <main className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">You need to be signed in</h1>
                    <p className="text-gray-500">Sign in with Google to view your reviews.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8 shadow-sm">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
                        My Reviews
                    </h1>
                    <p className="text-gray-500 font-medium">Manage all your restaurant reviews in one place</p>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                        Your Reviews <span className="text-gray-400 font-medium ml-1">({reviews.length})</span>
                    </h3>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-gray-900 transition-all cursor-pointer shadow-sm"
                    >
                        <option value="latest">Latest</option>
                        <option value="highest">Highest Rated</option>
                        <option value="lowest">Lowest Rated</option>
                    </select>
                </div>

                {loading ? (
                    <div className="grid gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-40 bg-white border border-gray-100 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-20 bg-white border border-gray-100 rounded-2xl">
                        <div className="text-gray-300 text-5xl mb-4">✍️</div>
                        <p className="text-gray-500 font-medium font-medium mb-1">No reviews yet.</p>
                        <p className="text-gray-400 text-sm mb-6">Go share your first culinary adventure!</p>
                        <Link
                            href="/"
                            className="inline-block bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all"
                        >
                            Start Searching
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {reviews.map((review) => (
                            <ReviewCard
                                key={review.id}
                                review={review}
                                onUpdate={fetchMyReviews}
                                onDelete={fetchMyReviews}
                            />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
