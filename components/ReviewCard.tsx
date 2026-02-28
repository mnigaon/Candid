"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Link from "next/link";

interface Review {
    id: string;
    rating: number;
    content: string;
    createdAt: string;
    userId: string;
    user: { name: string; image: string };
    restaurant?: {
        id: string;
        googleId: string;
        name: string;
    };
}

export function ReviewCard({
    review,
    onUpdate,
    onDelete
}: {
    review: Review;
    onUpdate: () => void;
    onDelete: () => void;
}) {
    const { data: session } = useSession();
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(review.content);
    const [editRating, setEditRating] = useState(review.rating);
    const [isSaving, setIsSaving] = useState(false);

    const isAuthor = session?.user?.id === review.userId;

    const handleUpdate = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`/api/reviews/${review.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: editContent, rating: editRating }),
            });
            if (res.ok) {
                setIsEditing(false);
                toast.success("Review updated successfully!");
                onUpdate();
            } else {
                toast.error("Failed to update review.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Internal service error.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this review?")) return;
        try {
            const res = await fetch(`/api/reviews/${review.id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                toast.success("Review deleted.");
                onDelete();
            } else {
                toast.error("Could not delete review.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Internal server error.");
        }
    };

    return (
        <div className="bg-white border border-gray-100 rounded-[2rem] p-8 transition-all hover:shadow-xl hover:shadow-gray-200/40 relative group">
            <div className="flex items-center gap-4 mb-6">
                {review.user.image && (
                    <Image
                        src={review.user.image}
                        alt={review.user.name}
                        width={48}
                        height={48}
                        className="rounded-full ring-4 ring-gray-50 border border-gray-100 shadow-sm"
                    />
                )}
                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="font-black text-gray-900 leading-tight">{review.user.name}</p>
                        {review.restaurant && (
                            <Link
                                href={`/restaurant/${review.restaurant.googleId}`}
                                className="text-[10px] font-bold bg-amber-50 text-amber-600 px-2 py-0.5 rounded-md hover:bg-amber-600 hover:text-white transition-all border border-amber-100"
                            >
                                @ {review.restaurant.name}
                            </Link>
                        )}
                    </div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mt-1">
                        {new Date(review.createdAt).toLocaleDateString("en-CA", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </p>
                </div>
                {!isEditing && (
                    <div className="flex bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-sm ${i < review.rating ? "text-amber-400" : "text-gray-200"}`}>
                                ★
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {isEditing ? (
                <div className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black tracking-widest text-gray-400 uppercase mb-2">Edit Rating</label>
                        <div className="flex gap-1.5 p-2 bg-gray-50 rounded-2xl w-fit">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setEditRating(star)}
                                    className={`text-2xl transition-all hover:scale-110 ${star <= editRating ? "text-amber-400" : "text-gray-200"
                                        }`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black tracking-widest text-gray-400 uppercase mb-2">Edit Review Content</label>
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white resize-none transition-all"
                            rows={4}
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-3 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpdate}
                            disabled={isSaving}
                            className="px-8 py-3 bg-gray-900 text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-gray-800 disabled:opacity-50 transition-all shadow-lg shadow-gray-200"
                        >
                            {isSaving ? "Saving..." : "Update Post"}
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <p className="text-gray-600 leading-relaxed font-medium mb-6 px-1">{review.content}</p>
                    {isAuthor && (
                        <div className="flex justify-end gap-6 border-t border-gray-50 pt-6">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="text-[10px] font-black tracking-widest text-gray-400 hover:text-gray-900 uppercase transition-all flex items-center gap-1.5 group"
                            >
                                <span>Edit Post</span>
                                <span className="w-1.5 h-1.5 bg-gray-200 rounded-full transition-colors group-hover:bg-gray-900"></span>
                            </button>
                            <button
                                onClick={handleDelete}
                                className="text-[10px] font-black tracking-widest text-gray-400 hover:text-red-500 uppercase transition-all flex items-center gap-1.5 group"
                            >
                                <span>Delete</span>
                                <span className="w-1.5 h-1.5 bg-gray-200 rounded-full transition-colors group-hover:bg-red-500"></span>
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
