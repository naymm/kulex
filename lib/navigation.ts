import { router, type Href } from 'expo-router';

export const MENU_ORIGIN = 'menu';
export const MENU_ROUTE = '/(tabs)/menu' as Href;

export function normalizeOrigin(from?: string | string[]): string | undefined {
  if (Array.isArray(from)) return from[0];
  return from;
}

export function appendMenuOrigin(href: string): string {
  const [path, query = ''] = href.split('?');
  const params = new URLSearchParams(query);
  params.set('from', MENU_ORIGIN);
  const qs = params.toString();
  return qs ? `${path}?${qs}` : `${path}?from=${MENU_ORIGIN}`;
}

export function pushFromMenu(href: string): void {
  router.push(appendMenuOrigin(href) as Href);
}

export function goBackFromOrigin(
  from?: string | string[],
  fallback?: () => void,
): void {
  if (normalizeOrigin(from) === MENU_ORIGIN) {
    router.dismissTo(MENU_ROUTE);
    return;
  }

  if (fallback) {
    fallback();
    return;
  }

  if (router.canGoBack()) {
    router.back();
    return;
  }

  router.dismissTo(MENU_ROUTE);
}

export function withOriginParams(
  from?: string | string[],
  params: Record<string, string> = {},
): Record<string, string> {
  const origin = normalizeOrigin(from);
  return origin ? { ...params, from: origin } : params;
}

export function logoutToLogin(): void {
  if (router.canDismiss()) {
    router.dismissAll();
  }
  router.replace('/login');
}
