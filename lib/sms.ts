import twilio from "twilio";

/**
 * SMS via Twilio with graceful degradation: if Twilio env vars are absent
 * (A2P 10DLC registration may still be pending), messages are logged and the
 * flow continues. Never throws.
 */

function twilioConfigured(): boolean {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_FROM_NUMBER
  );
}

let _client: ReturnType<typeof twilio> | null = null;

export async function sendSms(to: string, body: string): Promise<{ ok: boolean }> {
  if (!twilioConfigured()) {
    console.log(`[sms:log-mode] to=${to} body="${body}"`);
    return { ok: true };
  }
  try {
    if (!_client) {
      _client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    }
    await _client.messages.create({
      to,
      from: process.env.TWILIO_FROM_NUMBER,
      body,
    });
    return { ok: true };
  } catch (err) {
    console.error("sms: send failed", err);
    return { ok: false };
  }
}

/** Normalize a US phone number to E.164 (best effort). */
export function toE164(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return phone.startsWith("+") ? phone : `+${digits}`;
}
