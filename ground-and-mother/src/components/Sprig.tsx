/** The Ground & Mother sprig — a single botanical mark used for the cursor, placeholders and ornaments. */
export function Sprig({ className, strokeWidth = 1.2 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg className={className} viewBox="0 0 40 80" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M20 78 C20.5 60 21 40 20 5" />
      <path className="leaf l" d="M20 64 C11 61 6.5 53 8 46 C16 47.5 20 55 20 64 Z" fill="currentColor" fillOpacity=".12" />
      <path className="leaf r" d="M20 51 C29 47.5 33.5 40 32 33 C24 35 20 42 20 51 Z" fill="currentColor" fillOpacity=".12" />
      <path className="leaf l" d="M20 37 C12 34 8.5 27 10 21 C17 22.5 20 29 20 37 Z" fill="currentColor" fillOpacity=".12" />
      <path className="leaf r" d="M20 25 C27 21.5 29.5 15.5 28 10 C22 11.5 20 17 20 25 Z" fill="currentColor" fillOpacity=".12" />
    </svg>
  );
}
