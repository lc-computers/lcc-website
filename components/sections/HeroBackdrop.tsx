import Image from "next/image";

/**
 * Decorative photographic backdrop for dark hero sections. The image sits
 * under a heavy navy wash so text keeps AA contrast at every width; images
 * are pre-compressed webp served as-is (unoptimized skips double compression).
 * Parent section needs `relative isolate overflow-hidden`.
 */
export function HeroBackdrop({
  src,
  priority = false,
  variant = "deep",
}: {
  src: string;
  priority?: boolean;
  /** "deep" buries the image in navy; "light" lets it read (approved home look). */
  variant?: "deep" | "light";
}) {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      <Image
        src={src}
        alt=""
        fill
        sizes="100vw"
        priority={priority}
        unoptimized
        className="object-cover"
      />
      {variant === "deep" ? (
        <>
          <div className="absolute inset-0 bg-navy-950/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/60 to-transparent" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-navy-950/55" />
          {/* Text zone (left) stays near-solid so headings keep AA contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/55 to-navy-950/15" />
        </>
      )}
    </div>
  );
}
