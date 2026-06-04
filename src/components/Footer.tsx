export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-300 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-serif-fancy text-xl font-bold tracking-wider text-brand-600 dark:text-brand-400">
            NATURA
          </span>
          <span className="text-xs text-slate-400">
            © 2026 NATURA DIARY. All rights reserved.
          </span>
        </div>
        <div className="flex gap-6 text-xs text-slate-400">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="hover:text-brand-500 transition"
          >
            메인 정원
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="hover:text-brand-500 transition"
          >
            이용약관
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="hover:text-brand-500 transition"
          >
            자연보호수칙
          </a>
        </div>
      </div>
    </footer>
  );
}
