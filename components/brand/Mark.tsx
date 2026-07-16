/**
 * The Lake Cumberland Computers mark: an abstract shield holding two lines of
 * water. Single stroke weight, single color — set via `currentColor` so it
 * inherits from the parent (navy in the header, cream in the footer).
 */
export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M16 3.5 26.5 7.2v8.6c0 6-4.1 10.1-10.5 12.7C9.6 25.9 5.5 21.8 5.5 15.8V7.2L16 3.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 14.2c1.05-1.3 2.6-1.3 3.65 0s2.6 1.3 3.65 0 2.6-1.3 3.65 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12.9 19.2c0.9-1.1 2.2-1.1 3.1 0s2.2 1.1 3.1 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
