import { ReviewCard } from "./ReviewCard";

interface Review {
  id: string;
  rating: number;
  content: string;
  createdAt: string;
  userId: string;
  user: { name: string; image: string };
}

export function ReviewList({
  reviews,
  onUpdate
}: {
  reviews: Review[];
  onUpdate: () => void;
}) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-20 bg-white border border-gray-100 rounded-2xl">
        <div className="text-gray-300 text-5xl mb-4">💬</div>
        <p className="text-gray-500 font-medium">No reviews yet.</p>
        <p className="text-gray-400 text-sm mt-1">Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          onUpdate={onUpdate}
          onDelete={onUpdate}
        />
      ))}
    </div>
  );
}