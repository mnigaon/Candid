"use client";

import { useRouter } from "next/navigation";

interface Restaurant {
  id: string;
  displayName: { text: string };
  formattedAddress: string;
  rating?: number;
  primaryTypeDisplayName?: { text: string };
}

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/restaurant/${restaurant.id}`)}
      className="bg-white border border-gray-100 rounded-3xl p-6 cursor-pointer hover:shadow-xl hover:shadow-gray-200/50 transition-all active:scale-[0.98] group relative overflow-hidden"
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="text-xl font-black text-gray-900 group-hover:text-amber-600 transition-colors mb-2">
            {restaurant.displayName.text}
          </h3>
          <p className="text-gray-400 text-sm font-medium line-clamp-1 mb-4">
            {restaurant.formattedAddress}
          </p>
          <div className="flex flex-wrap gap-2">
            {restaurant.primaryTypeDisplayName && (
              <span className="inline-block text-[10px] font-black uppercase tracking-wider bg-gray-50 text-gray-400 px-3 py-1 rounded-full border border-gray-100">
                {restaurant.primaryTypeDisplayName.text}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {restaurant.rating ? (
            <div className="flex flex-col items-center justify-center bg-gray-900 text-white min-w-14 min-h-14 rounded-2xl shadow-lg shadow-gray-200">
              <span className="text-xs font-black text-gray-400 leading-none mb-1 uppercase tracking-tighter">Rating</span>
              <div className="flex items-center gap-0.5 font-black text-lg">
                <span className="text-amber-400">★</span>
                <span>{restaurant.rating}</span>
              </div>
            </div>
          ) : (
            <div className="w-14 h-14 bg-gray-50 border border-dashed border-gray-200 rounded-2xl flex items-center justify-center text-gray-300 text-[10px] font-bold text-center leading-tight p-2">
              No Rating
            </div>
          )}

          <div className="flex gap-0.5 mt-2 transition-opacity duration-300">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-sm ${i < Math.round(restaurant.rating || 0) ? "text-amber-400" : "text-gray-200"}`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-amber-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
    </div>
  );
}

export function RestaurantCardSkeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 animate-pulse">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 space-y-3">
          <div className="w-2/3 h-6 bg-gray-100 rounded-lg" />
          <div className="w-1/2 h-4 bg-gray-50 rounded-lg" />
          <div className="w-20 h-5 bg-gray-50 rounded-full" />
        </div>
        <div className="w-14 h-14 bg-gray-100 rounded-2xl" />
      </div>
    </div>
  );
}