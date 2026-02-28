import { Metadata } from "next";
import { Header } from "@/components/Header";
import { RestaurantDetail } from "./RestaurantDetail";

async function getRestaurant(id: string) {
  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY!,
        "X-Goog-FieldMask": "id,displayName",
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const { id } = await params;
  const restaurant = await getRestaurant(id);
  const name = restaurant?.displayName?.text || "Restaurant";

  return {
    title: `${name} Reviews — Candid`,
    description: `Read and write honest reviews for ${name} on Candid.`,
    openGraph: {
      title: `${name} Reviews — Candid`,
      description: `Read and write honest reviews for ${name} on Candid.`,
    },
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const restaurant = await getRestaurant(id);
  const initialName = restaurant?.displayName?.text || "";

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <RestaurantDetail id={id} initialName={initialName} />
    </main>
  );
}