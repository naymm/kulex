export function toPaymentRouteParams(
  params: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    result[key] = Array.isArray(value) ? (value[0] ?? '') : value;
  }

  return result;
}
