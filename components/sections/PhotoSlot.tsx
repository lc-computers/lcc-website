import { Mark } from "@/components/brand/Mark";

/*
 * TODO(Louis): real photography drops in here.
 * Each PhotoSlot marks a spot for a real photo — Louis, the technicians, the
 * storefront on Lakeway Dr, trucks, workbench. No stock photos, no generated
 * people. Until then it renders as an intentional brand block, not a gray box.
 * Swap by replacing <PhotoSlot .../> with <Image src="/photos/..." .../>.
 */
export function PhotoSlot({
  label,
  aspect = "aspect-[4/3]",
  className = "",
}: {
  /** What real photo belongs here, e.g. "Louis and the team at the shop". */
  label: string;
  aspect?: string;
  className?: string;
}) {
  return (
    <figure
      className={`relative flex ${aspect} w-full flex-col items-center justify-center overflow-hidden rounded-lg border border-cream-200 bg-gradient-to-br from-navy-50 to-cream-100 ${className}`}
    >
      <Mark className="h-14 w-14 text-navy-200" />
      <figcaption className="mt-3 px-6 text-center text-xs font-medium uppercase tracking-widest text-navy-300">
        {/* TODO(Louis): replace with a real photo — {label} */}
        {label}
      </figcaption>
    </figure>
  );
}
