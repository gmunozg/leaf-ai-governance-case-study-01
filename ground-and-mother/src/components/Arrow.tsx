export function Arrow({ className = "arrow" }: { className?: string }) {
  return (
    <svg className={className} width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true" focusable="false">
      <path d="M0 5h14.5M10.5 1l4 4-4 4" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
