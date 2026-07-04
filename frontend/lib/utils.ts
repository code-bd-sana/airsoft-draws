/**
 * Combines CSS class names safely.
 * Replaces external libraries like clsx for a lightweight zero-dependency setup.
 */
export function cn(...classes: (string | undefined | null | boolean | Record<string, boolean>)[]) {
  const result: string[] = [];
  
  classes.forEach((c) => {
    if (!c) return;
    if (typeof c === "string") {
      result.push(c);
    } else if (typeof c === "object") {
      Object.entries(c).forEach(([key, value]) => {
        if (value) {
          result.push(key);
        }
      });
    }
  });
  
  return result.join(" ");
}

/**
 * Formats a numeric value into GBP (e.g. £1,200.00 or £1.50).
 */
export function formatCurrency(amount: number, minimumFractionDigits = 2): string {
  // If price is a whole integer (like £500), let's keep it clean without decimals.
  const hasDecimals = amount % 1 !== 0;
  const fractions = hasDecimals ? 2 : minimumFractionDigits;

  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: fractions,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Extracts a user-friendly error message from an API error response.
 * Specifically handles NestJS class-validator arrays.
 */
export function extractApiError(error: any, defaultMessage: string = "An error occurred"): string {
  const responseData = error?.response?.data;
  
  if (!responseData) return error?.message || defaultMessage;

  // Handle NestJS validation array format: { error: [{ field: "email", errors: ["email must be valid"] }] }
  if (Array.isArray(responseData.error)) {
    const errorMessages = responseData.error
      .map((err: any) => {
        if (err.errors && Array.isArray(err.errors)) {
          return `${err.field}: ${err.errors.join(", ")}`;
        }
        return err.field || JSON.stringify(err);
      });
    return `Validation Error - ${errorMessages.join(" | ")}`;
  }

  // Handle standard { message: "Error string" } format
  if (typeof responseData.message === "string") {
    return responseData.message;
  }
  
  // Handle standard { error: "Error string" } format
  if (typeof responseData.error === "string") {
    return responseData.error;
  }

  return defaultMessage;
}
