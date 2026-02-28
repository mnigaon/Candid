"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`flex flex-col md:flex-row gap-3 p-3 md:bg-white md:border md:border-gray-100 md:rounded-[2.5rem] md:shadow-2xl md:shadow-gray-300/40 transition-all duration-500 ${isFocused ? 'ring-[12px] ring-gray-900/5 md:border-gray-200' : ''}`}
    >
      <div className="flex-1 relative">
        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl opacity-40">🔍</span>
        <input
          type="text"
          value={query}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search restaurants in Calgary..."
          className="w-full pl-16 pr-6 py-5 bg-white border border-gray-100 rounded-2xl md:bg-transparent md:border-none md:rounded-none text-gray-900 font-bold placeholder:text-gray-300 outline-none transition-all placeholder:font-bold placeholder:uppercase placeholder:tracking-widest placeholder:text-[10px]"
        />
      </div>
      <button
        type="submit"
        className="bg-gray-900 text-white min-w-40 px-10 py-5 rounded-[2rem] hover:bg-gray-800 transition-all font-black uppercase tracking-widest text-sm shadow-lg shadow-gray-200 active:scale-95"
      >
        Search Now
      </button>
    </form>
  );
}