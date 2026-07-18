import { site, type ResidentialService } from "@/lib/site";

/**
 * Travel fee rule: $0 for local addresses — Russell Springs (42642) and
 * Jamestown (42629), matched by city name or ZIP — flat $25 everywhere else
 * we serve. Remote sessions: never a fee. Determined from customer-entered
 * city/zip; always shown before payment.
 */

const NO_FEE_ZIPS = new Set(["42642", "42629"]);
const NO_FEE_CITIES = new Set(["russell springs", "jamestown"]);

export function travelFeeCents(
  service: Pick<ResidentialService, "kind">,
  city: string | null | undefined,
  zip: string | null | undefined
): number {
  if (service.kind === "remote") return 0;
  const normalizedCity = (city ?? "").trim().toLowerCase().replace(/\s+/g, " ");
  const normalizedZip = (zip ?? "").trim().slice(0, 5);
  const local = NO_FEE_CITIES.has(normalizedCity) || NO_FEE_ZIPS.has(normalizedZip);
  return local ? site.travelFee.inTown * 100 : site.travelFee.surrounding * 100;
}
