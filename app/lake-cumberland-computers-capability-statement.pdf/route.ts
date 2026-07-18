import { getServiceMenu } from "@/lib/booking/services";
import { generateCapabilityStatementPdf } from "@/lib/pdf/capability-statement";

/**
 * The capability statement is generated per request so the residential menu
 * section always matches /admin/services. Same URL the old static file used,
 * so existing links keep working.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const bytes = await generateCapabilityStatementPdf(await getServiceMenu());
  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="lake-cumberland-computers-capability-statement.pdf"',
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
