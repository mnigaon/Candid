"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white/90 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <span className="bg-gray-900 text-white w-9 h-9 flex items-center justify-center rounded-xl text-xl font-black shadow-lg shadow-gray-200 group-active:scale-95 transition-all">C</span>
          <span className="text-xl font-black text-gray-900 tracking-tighter hidden xs:block">Candid</span>
        </Link>

        {/* Navigation Section */}
        <div className="flex items-center gap-2 sm:gap-6">
          {session ? (
            <>
              <Link
                href="/my-reviews"
                className="flex items-center gap-2 p-2 sm:px-0 text-gray-500 hover:text-gray-900 transition-colors group shrink-0"
                title="My Reviews"
              >
                <span className="text-xl sm:text-base">✍️</span>
                <span className="text-sm font-bold hidden sm:inline">My Reviews</span>
              </Link>

              <div className="flex items-center gap-2 sm:gap-4 pl-2 sm:pl-4 border-l border-gray-100">
                {session.user?.image && (
                  <div className="relative group">
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full ring-2 ring-gray-50 object-cover shadow-sm"
                    />
                  </div>
                )}

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-1.5 p-2 sm:py-1.5 sm:px-3 text-gray-400 hover:text-red-500 hover:bg-red-50 sm:border sm:border-transparent sm:hover:border-red-100 rounded-xl transition-all group shrink-0"
                  title="Sign Out"
                >
                  <span className="text-xs font-black uppercase tracking-widest hidden sm:inline">Sign Out</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="bg-gray-900 text-white px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 active:scale-0.95"
            >
              <span className="hidden xs:inline">Sign in with Google</span>
              <span className="xs:hidden">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}