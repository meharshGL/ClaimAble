import Link from "next/link";

export default function Nav() {
  return (
    <header className="border-b border-paper-line bg-paper/95 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-xl italic text-ink">ClaimAble</span>
          <span className="hidden sm:inline text-xs text-ink-soft tracking-wide">
            claims portal
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/" className="text-ink-soft hover:text-ink transition-colors">
            Queue
          </Link>
          <Link
            href="/upload"
            className="rounded-sm bg-ink text-paper px-3.5 py-1.5 hover:bg-ink-soft transition-colors"
          >
            New claim
          </Link>
        </nav>
      </div>
    </header>
  );
}
