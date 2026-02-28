"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface ReviewFormProps {
  restaurantId: string;
  onReviewAdded: (name: string) => void;
}

export function ReviewForm({ restaurantId, onReviewAdded }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const placeRes = await fetch(
        `/api/restaurants/${restaurantId}`
      );
      const place = await placeRes.json();

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          content,
          restaurantId,
          restaurantData: {
            name: place?.displayName?.text || "Unknown",
            address: place?.formattedAddress || "",
            city: "Calgary",
            imageUrl: null,
            category: place?.primaryTypeDisplayName?.text || null,
          },
        }),
      });

      if (res.ok) {
        toast.success("Review submitted! Thank you for sharing.");
        setContent("");
        setRating(5);
        onReviewAdded(place?.displayName?.text || "Restaurant");
      } else {
        toast.error("Failed to submit review. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-100 rounded-3xl p-8 mb-8 shadow-sm transition-all hover:shadow-gray-200/50"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center text-lg">✍️</div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          Share Your Experience
        </h2>
      </div>

      <div className="mb-6">
        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
          Your Rating
        </label>
        <div className="flex gap-1.5 p-2 bg-gray-50 rounded-2xl w-fit border border-gray-100">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-3xl transition-all hover:scale-110 active:scale-90 ${star <= rating ? "text-amber-400" : "text-gray-200"
                }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
          Your Review
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What did you love? How was the service?"
          rows={4}
          required
          className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white resize-none transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !content.trim()}
        className="w-full bg-gray-900 text-white px-6 py-4 rounded-2xl hover:bg-gray-800 transition-all font-black uppercase tracking-widest text-sm shadow-lg shadow-gray-200 active:scale-[0.99] disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {loading ? "Sending..." : "Post My Review"}
      </button>
    </form>
  );
}