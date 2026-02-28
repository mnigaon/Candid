"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { RestaurantCard, RestaurantCardSkeleton } from "@/components/RestaurantCard";

interface Restaurant {
  id: string;
  displayName: { text: string };
  formattedAddress: string;
  rating?: number;
  primaryTypeDisplayName?: { text: string };
}

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/restaurants/search?query=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setRestaurants(data.places || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [query]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-10">
        <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
          Results for "{query}"
        </h2>
        <p className="text-gray-400 font-medium">
          {loading ? "Searching for restaurants..." : `${restaurants.length} restaurants found`}
        </p>
      </div>

      {loading ? (
        <div className="grid gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <RestaurantCardSkeleton key={i} />
          ))}
        </div>
      ) : restaurants.length === 0 ? (
        <div className="text-center py-24 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm">
          <div className="text-gray-200 text-6xl mb-6">🔍</div>
          <p className="text-gray-500 font-bold mb-2">No restaurants found.</p>
          <p className="text-gray-400 text-sm">Try a different search or check for typos.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <Suspense fallback={<div className="p-8 text-center text-gray-400">Loading Search...</div>}>
        <SearchResults />
      </Suspense>
    </main>
  );
}