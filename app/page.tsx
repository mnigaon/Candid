import { SearchBar } from "@/components/SearchBar";
import { Header } from "@/components/Header";
import Link from "next/link";

export default function Home() {
  const trendingTags = ['Pizza', 'Sushi', 'Burgers', 'Coffee', 'Brunch'];

  return (
    <main className="min-h-screen bg-[#fafafa] selection:bg-gray-100">
      <Header />

      <div className="relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-amber-50/50 to-transparent -z-10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 py-24 md:py-40">
          <div className="text-center mb-16 relative">
            <div className="inline-block px-4 py-1.5 bg-gray-900/5 backdrop-blur-sm border border-gray-900/5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-8 animate-fade-in">
              Calgary's Culinary Community
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-8 tracking-[-0.04em] leading-[0.9] text-balance">
              Honest Reviews,<br />
              <span className="text-amber-500 drop-shadow-sm italic serif">Real</span> Opinions.
            </h1>
          </div>

          <div className="relative z-10 max-w-2xl mx-auto hover:scale-[1.01] transition-transform duration-500">
            <SearchBar />

            <div className="mt-10 flex flex-col items-center gap-4 px-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Trending Near You</span>
              <div className="flex flex-wrap justify-center gap-2">
                {trendingTags.map(tag => (
                  <Link
                    key={tag}
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className="group"
                  >
                    <div className="px-5 py-2 bg-white border border-gray-100 rounded-2xl text-[11px] font-black text-gray-400 hover:text-gray-900 hover:border-gray-900 hover:shadow-lg hover:shadow-gray-200/50 transition-all uppercase tracking-wider active:scale-95"
                    >
                      {tag}
                      <span className="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer-like element */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/50 backdrop-blur-xl border border-white/50 px-6 py-3 rounded-2xl shadow-2xl shadow-gray-200/50 -z-1 pointer-events-none md:pointer-events-auto opacity-0 md:opacity-100">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Join <span className="text-gray-900">1,240+</span> foodies contributing today</p>
      </div>
    </main>
  );
}