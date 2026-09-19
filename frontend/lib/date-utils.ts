/**
 * UK Date & Time Formatting Utilities
 * Standardizes all raffle, draw, and competition timestamps to UK Time (Europe/London: BST / GMT).
 * During Summer (BST): UTC+1
 * During Winter (GMT): UTC+0
 */

export const UK_TIMEZONE = "Europe/London";

/**
 * Safely parses string, number, or Date into a valid Date object or null.
 */
export function parseDate(input: Date | string | number | null | undefined): Date | null {
  if (!input) return null;
  const d = new Date(input);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Returns the short UK timezone name for a given date ("BST" or "GMT").
 */
export function getUkTimeZoneName(input: Date | string | number | null | undefined = new Date()): string {
  const d = parseDate(input) || new Date();
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: UK_TIMEZONE,
      timeZoneName: "short",
      hour: "2-digit",
    }).formatToParts(d);
    const tz = parts.find((p) => p.type === "timeZoneName");
    return tz ? tz.value : "UK";
  } catch {
    return "UK";
  }
}

/**
 * Formats a date into a clean UK date string.
 * Examples:
 * - 'medium' (default): "15 Jun 2026"
 * - 'long': "Thursday, 15 Jun 2026"
 * - 'full': "Thursday, 15 June 2026"
 * - 'short': "15/06/2026"
 * - 'dayMonth': "15 Jun"
 */
export function formatUkDate(
  input: Date | string | number | null | undefined,
  style: "short" | "medium" | "long" | "full" | "dayMonth" = "medium",
  fallback: string = "TBD"
): string {
  const d = parseDate(input);
  if (!d) return fallback;

  try {
    if (style === "short") {
      return new Intl.DateTimeFormat("en-GB", {
        timeZone: UK_TIMEZONE,
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(d);
    }
    if (style === "dayMonth") {
      return new Intl.DateTimeFormat("en-GB", {
        timeZone: UK_TIMEZONE,
        day: "numeric",
        month: "short",
      }).format(d);
    }
    if (style === "long") {
      return new Intl.DateTimeFormat("en-GB", {
        timeZone: UK_TIMEZONE,
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(d);
    }
    if (style === "full") {
      return new Intl.DateTimeFormat("en-GB", {
        timeZone: UK_TIMEZONE,
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(d);
    }
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: UK_TIMEZONE,
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return fallback;
  }
}

/**
 * Formats time in 24h format for UK timezone.
 * Examples:
 * - with zone: "14:30 BST"
 * - without zone: "14:30"
 */
export function formatUkTime(
  input: Date | string | number | null | undefined,
  includeZone: boolean = true,
  fallback: string = "TBD"
): string {
  const d = parseDate(input);
  if (!d) return fallback;

  try {
    const timeStr = new Intl.DateTimeFormat("en-GB", {
      timeZone: UK_TIMEZONE,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(d);

    if (!includeZone) return timeStr;
    const zone = getUkTimeZoneName(d);
    return `${timeStr} ${zone}`;
  } catch {
    return fallback;
  }
}

/**
 * Formats a schedule string (date + time) in UK Time.
 * Examples:
 * - default: "15 Jun · 14:30 BST"
 * - with year: "15 Jun 2026 · 14:30 BST"
 * - comma style: "15 Jun 2026, 14:30 BST"
 */
export function formatUkSchedule(
  input: Date | string | number | null | undefined,
  options: {
    includeYear?: boolean;
    includeZone?: boolean;
    separator?: string;
    fallback?: string;
  } = {}
): string {
  const {
    includeYear = false,
    includeZone = true,
    separator = " · ",
    fallback = "TBD",
  } = options;

  const d = parseDate(input);
  if (!d) return fallback;

  try {
    const dateStr = new Intl.DateTimeFormat("en-GB", {
      timeZone: UK_TIMEZONE,
      day: "numeric",
      month: "short",
      ...(includeYear ? { year: "numeric" as const } : {}),
    }).format(d);

    const timeStr = formatUkTime(d, includeZone);
    return `${dateStr}${separator}${timeStr}`;
  } catch {
    return fallback;
  }
}

/**
 * Formats a full, prominent date & time description in UK timezone.
 * Example: "Thursday, 25 Jun 2026 at 15:00 BST (UK Time)"
 */
export function formatUkFull(
  input: Date | string | number | null | undefined,
  fallback: string = "TBD"
): string {
  const d = parseDate(input);
  if (!d) return fallback;

  try {
    const dateStr = formatUkDate(d, "full");
    const timeStr = formatUkTime(d, true);
    return `${dateStr} at ${timeStr} (UK Time)`;
  } catch {
    return fallback;
  }
}

/**
 * Converts a UTC Date or ISO string into a UK local "YYYY-MM-DDTHH:mm" string
 * suitable for HTML `<input type="datetime-local">`.
 */
export function toUkDateTimeLocalString(
  input: Date | string | number | null | undefined
): string {
  const d = parseDate(input);
  if (!d) return "";

  try {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: UK_TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const parts = formatter.formatToParts(d);
    const p: Record<string, string> = {};
    for (const part of parts) p[part.type] = part.value;
    const hour = p.hour === "24" ? "00" : p.hour;
    return `${p.year}-${p.month}-${p.day}T${hour}:${p.minute}`;
  } catch {
    return "";
  }
}

/**
 * Converts a UK local datetime string from `<input type="datetime-local">` (e.g. "2026-06-25T15:00")
 * into the exact UTC ISO string for that moment in UK time (Europe/London).
 */
export function ukDateTimeLocalToIso(localStr: string): string {
  if (!localStr) return "";
  const match = localStr.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!match) {
    const d = new Date(localStr);
    return isNaN(d.getTime()) ? "" : d.toISOString();
  }

  const [, y, m, d, h, min] = match;
  const targetUtcMs = Date.UTC(+y, +m - 1, +d, +h, +min);
  const dObj = new Date(targetUtcMs);

  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: UK_TIMEZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });

  const parts = fmt.formatToParts(dObj);
  const p: Record<string, string> = {};
  for (const part of parts) p[part.type] = part.value;
  const ph = +p.hour === 24 ? 0 : +p.hour;
  const londonAsUtcMs = Date.UTC(+p.year, +p.month - 1, +p.day, ph, +p.minute);
  const offsetMs = londonAsUtcMs - targetUtcMs;

  return new Date(targetUtcMs - offsetMs).toISOString();
}
