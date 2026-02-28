"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/Header";
import { ReviewForm } from "@/components/ReviewForm";
import { ReviewList } from "@/components/ReviewList";

interface Review {
    id: string;
    rating: number;
    content: string;
    createdAt: string;
    userId: string;
    user: { name: string; image: string };
}

export function RestaurantDetail({ id, initialName }: { id: string; initialName: string }) {
    const { data: session } = useSession();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [restaurantName, setRestaurantName] = useState(initialName || "");
    const [sort, setSort] = useState("latest");
    const [hasMore, setHasMore] = useState(true);

    const fetchReviews = async (isLoadMore = false) => {
        if (isLoadMore) setLoadingMore(true);
        else setLoading(true);

        try {
            const skip = isLoadMore ? reviews.length : 0;
            const res = await fetch(`/api/reviews?restaurantId=${id}&sort=${sort}&skip=${skip}&limit=10`);
            const data = await res.json();

            if (isLoadMore) {
                setReviews(prev => [...prev, ...data]);
            } else {
                setReviews(data);
            }

            setHasMore(data.length === 10);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [id, sort]);

    const averageRating =
        reviews.length > 0
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : null;

    return (
        <main className="min-h-screen bg-transparent">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white border border-gray-200 rounded-3xl p-8 mb-8 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
                                {restaurantName || "Restaurant"}
                            </h1>
                            <p className="text-gray-500 font-medium">Public Reviews & Ratings</p>
                        </div>
                        {averageRating && (
                            <div className="flex items-center gap-2 bg-yellow-400 text-yellow-900 px-5 py-2.5 rounded-2xl shadow-sm">
                                <span className="text-xl font-bold">★ {averageRating}</span>
                            </div>
                        )}
                    </div>
                </div>

                {session ? (
                    <ReviewForm
                        restaurantId={id as string}
                        onReviewAdded={() => fetchReviews(false)}
                    />
                ) : (
                    <div className="bg-white border border-gray-100 rounded-2xl p-8 mb-8 text-center text-gray-500 shadow-sm">
                        <p className="font-medium mb-1">Sign in to write a review</p>
                        <p className="text-sm text-gray-400">Share your experience with the community</p>
                    </div>
                )}

                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Reviews</h3>
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
                    <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-100 rounded-2xl animate-pulse">
                        <div className="w-12 h-12 bg-gray-100 rounded-full mb-4"></div>
                        <div className="w-48 h-4 bg-gray-100 rounded-full"></div>
                    </div>
                ) : (
                    <>
                        <ReviewList reviews={reviews} onUpdate={() => fetchReviews(false)} />
                        {hasMore && (
                            <div className="mt-8 text-center">
                                <button
                                    onClick={() => fetchReviews(true)}
                                    disabled={loadingMore}
                                    className="px-8 py-3 bg-white border border-gray-200 text-gray-900 font-bold rounded-2xl hover:bg-gray-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                                >
                                    {loadingMore ? "Loading more..." : "Load More Reviews"}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}
