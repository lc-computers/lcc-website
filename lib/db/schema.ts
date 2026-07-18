import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  uuid,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/** Captured leads from every source (contact form, chat, health check, bookings). */
export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name"),
    email: text("email"),
    phone: text("phone"),
    organization: text("organization"),
    source: text("source").notNull(), // contact | chat | health_check | booking
    message: text("message"),
    meta: jsonb("meta").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("leads_email_idx").on(t.email), index("leads_source_idx").on(t.source)]
);

/** Chat agent transcripts, keyed by browser session. */
export const chatSessions = pgTable(
  "chat_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionKey: text("session_key").notNull(),
    messages: jsonb("messages")
      .$type<{ role: "user" | "assistant"; content: string; at: string }[]>()
      .notNull()
      .default([]),
    leadCaptured: boolean("lead_captured").notNull().default(false),
    leadEmailSentAt: timestamp("lead_email_sent_at", { withTimezone: true }),
    closedAt: timestamp("closed_at", { withTimezone: true }),
    lastActiveAt: timestamp("last_active_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("chat_sessions_key_idx").on(t.sessionKey),
    index("chat_sessions_active_idx").on(t.lastActiveAt),
  ]
);

/** M365 security health check submissions + graded results. */
export const healthChecks = pgTable(
  "health_checks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    domain: text("domain").notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    freeMailProvider: boolean("free_mail_provider").notNull().default(false),
    results: jsonb("results").$type<Record<string, unknown>>().notNull(),
    overallGrade: text("overall_grade").notNull(),
    reportHtml: text("report_html"),
    leadId: uuid("lead_id").references(() => leads.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("health_checks_domain_idx").on(t.domain)]
);

/** Residential service menu (seeded from lib/site.ts). */
export const services = pgTable("services", {
  slug: text("slug").primaryKey(),
  name: text("name").notNull(),
  priceCents: integer("price_cents").notNull(),
  kind: text("kind").notNull(), // in_home | remote
  durationMinutes: integer("duration_minutes").notNull(),
  bufferMinutes: integer("buffer_minutes").notNull().default(0),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

/**
 * Residential bookings. Times are stored as UTC instants; all display is
 * America/Chicago. blockEndAt = service end + travel buffer (capacity math).
 */
export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serviceSlug: text("service_slug")
      .notNull()
      .references(() => services.slug),
    status: text("status").notNull().default("pending_payment"),
    // pending_payment | confirmed | canceled | refunded | completed
    customerName: text("customer_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    street: text("street"),
    city: text("city"),
    zip: text("zip"),
    smsConsent: boolean("sms_consent").notNull().default(false),
    priceCents: integer("price_cents").notNull(),
    travelFeeCents: integer("travel_fee_cents").notNull().default(0),
    totalCents: integer("total_cents").notNull(),
    startAt: timestamp("start_at", { withTimezone: true }).notNull(),
    endAt: timestamp("end_at", { withTimezone: true }).notNull(),
    blockEndAt: timestamp("block_end_at", { withTimezone: true }).notNull(),
    manageToken: text("manage_token").notNull(),
    stripeSessionId: text("stripe_session_id"),
    stripePaymentIntentId: text("stripe_payment_intent_id"),
    graphEventId: text("graph_event_id"),
    reminderSentAt: timestamp("reminder_sent_at", { withTimezone: true }),
    reviewRequestSentAt: timestamp("review_request_sent_at", { withTimezone: true }),
    recoveryEmailSentAt: timestamp("recovery_email_sent_at", { withTimezone: true }),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
    canceledAt: timestamp("canceled_at", { withTimezone: true }),
    refundedAt: timestamp("refunded_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("bookings_start_idx").on(t.startAt),
    index("bookings_status_idx").on(t.status),
    uniqueIndex("bookings_manage_token_idx").on(t.manageToken),
    index("bookings_stripe_session_idx").on(t.stripeSessionId),
  ]
);

/** Short-lived slot reservations created at checkout creation (15 minutes). */
export const bookingHolds = pgTable(
  "booking_holds",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bookingId: uuid("booking_id")
      .notNull()
      .references(() => bookings.id, { onDelete: "cascade" }),
    startAt: timestamp("start_at", { withTimezone: true }).notNull(),
    blockEndAt: timestamp("block_end_at", { withTimezone: true }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("booking_holds_expires_idx").on(t.expiresAt), index("booking_holds_start_idx").on(t.startAt)]
);

/** Scheduled nurture/marketing sends. Suppression is checked at send time. */
export const nurtureQueue = pgTable(
  "nurture_queue",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    name: text("name"),
    templateKey: text("template_key").notNull(), // hc_day3_article | hc_day7_walkthrough | newsletter
    sendAt: timestamp("send_at", { withTimezone: true }).notNull(),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    canceledAt: timestamp("canceled_at", { withTimezone: true }),
    meta: jsonb("meta").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("nurture_send_at_idx").on(t.sendAt), index("nurture_email_idx").on(t.email)]
);

/** Unsubscribed / suppressed addresses. Checked before every marketing send. */
export const suppression = pgTable("suppression", {
  email: text("email").primaryKey(), // stored lowercase
  reason: text("reason").notNull().default("unsubscribe"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Topics queued for the AI content engine. */
export const keywordQueue = pgTable(
  "keyword_queue",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    topic: text("topic").notNull(),
    angle: text("angle").notNull(),
    status: text("status").notNull().default("pending"), // pending | drafted
    sortOrder: integer("sort_order").notNull().default(0),
    usedAt: timestamp("used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("keyword_status_idx").on(t.status)]
);

/** Blog content: AI drafts and published posts (launch articles seeded in). */
export const posts = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    contentMd: text("content_md").notNull(),
    status: text("status").notNull().default("draft"), // draft | published
    source: text("source").notNull().default("ai"), // launch | ai
    keywordId: uuid("keyword_id").references(() => keywordQueue.id),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("posts_slug_idx").on(t.slug), index("posts_status_idx").on(t.status)]
);

/** Monthly newsletter digests (drafted by cron, approved + sent from admin). */
export const newsletters = pgTable("newsletters", {
  id: uuid("id").primaryKey().defaultRandom(),
  subject: text("subject").notNull(),
  contentMd: text("content_md").notNull(),
  status: text("status").notNull().default("draft"), // draft | sent
  sentAt: timestamp("sent_at", { withTimezone: true }),
  recipientCount: integer("recipient_count"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** First-party conversion events (privacy-friendly: no PII, no cookies). */
export const events = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    props: jsonb("props").$type<Record<string, string | number>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("events_name_idx").on(t.name), index("events_created_idx").on(t.createdAt)]
);

/** Fixed-window rate limiting for public APIs. */
export const rateLimits = pgTable("rate_limits", {
  key: text("key").primaryKey(), // e.g. "health-check:1.2.3.4:2026-07-16T14"
  count: integer("count").notNull().default(0),
  windowStart: timestamp("window_start", { withTimezone: true }).notNull().defaultNow(),
});

/** Processed Stripe webhook events — idempotency guard. */
export const stripeEvents = pgTable("stripe_events", {
  id: text("id").primaryKey(), // Stripe event id
  type: text("type").notNull(),
  processedAt: timestamp("processed_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Small operational settings editable from /admin (e.g. technician_count). */
export const appSettings = pgTable("app_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
