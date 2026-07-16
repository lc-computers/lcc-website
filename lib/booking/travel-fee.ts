import { site, type ResidentialService } from "@/lib/site";

/**
 * Travel fee rule: $0 inside Russell Springs (city name or 42642 zip),
 * flat $25 for surrounding-county addresses. Remote sessions: never a fee.
 * Determined from customer-entered city/zip; always shown before payment.
 */
export function travelFeeCents(
  service: Pick<ResidentialService, "kind">,
  city: string | null | undefined,
  zip: string | null | undefined
): number {
  if (service.kind === "remote") return 0;
  const normalizedCity = (city ?? "").trim().toLowerCase().replace(/\s+/g, " ");
  const normalizedZip = (zip ?? "").trim().slice(0, 5);
  const inTown = normalizedCity === "russell springs" || normalizedZip === site.address.zip;
  return inTown ? site.travelFee.inTown * 100 : site.travelFee.surrounding * 100;
}
