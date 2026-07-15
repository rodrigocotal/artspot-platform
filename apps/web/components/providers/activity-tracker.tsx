'use client';

import { useEffect, useMemo, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

type ActivityEventType = 'page_view' | 'page_exit' | 'engagement';

function randomId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function getStoredId(storage: Storage, key: string, prefix: string) {
  const existing = storage.getItem(key);
  if (existing) return existing;
  const value = randomId(prefix);
  storage.setItem(key, value);
  return value;
}

function sendActivity(
  data: {
    eventType: ActivityEventType;
    sessionId: string;
    visitorId: string;
    path: string;
    title?: string;
    referrer?: string;
    metadata?: Record<string, unknown>;
  },
  accessToken?: string
) {
  const body = JSON.stringify(data);
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  if (navigator.sendBeacon && !accessToken) {
    const blob = new Blob([body], { type: 'application/json' });
    navigator.sendBeacon(`${API_URL}/activity`, blob);
    return;
  }

  fetch(`${API_URL}/activity`, {
    method: 'POST',
    headers,
    body,
    keepalive: true,
  }).catch(() => undefined);
}

export function ActivityTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const startedAt = useRef(Date.now());
  const lastPath = useRef<string | null>(null);

  const path = useMemo(() => {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  useEffect(() => {
    if (pathname.startsWith('/admin')) return;

    const sessionId = getStoredId(window.sessionStorage, 'artaldo_session_id', 'sess');
    const visitorId = getStoredId(window.localStorage, 'artaldo_visitor_id', 'vis');
    const previousPath = lastPath.current;

    if (previousPath && previousPath !== path) {
      sendActivity(
        {
          eventType: 'page_exit',
          sessionId,
          visitorId,
          path: previousPath,
          metadata: { durationMs: Date.now() - startedAt.current },
        },
        session?.accessToken as string | undefined
      );
    }

    startedAt.current = Date.now();
    lastPath.current = path;

    sendActivity(
      {
        eventType: 'page_view',
        sessionId,
        visitorId,
        path,
        title: document.title,
        referrer: document.referrer || undefined,
        metadata: {
          width: window.innerWidth,
          height: window.innerHeight,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      },
      session?.accessToken as string | undefined
    );

    const engagementTimer = window.setTimeout(() => {
      sendActivity(
        {
          eventType: 'engagement',
          sessionId,
          visitorId,
          path,
          metadata: { durationMs: Date.now() - startedAt.current },
        },
        session?.accessToken as string | undefined
      );
    }, 30000);

    return () => window.clearTimeout(engagementTimer);
  }, [path, pathname, session?.accessToken]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState !== 'hidden' || !lastPath.current || lastPath.current.startsWith('/admin')) return;
      const sessionId = getStoredId(window.sessionStorage, 'artaldo_session_id', 'sess');
      const visitorId = getStoredId(window.localStorage, 'artaldo_visitor_id', 'vis');
      sendActivity({
        eventType: 'page_exit',
        sessionId,
        visitorId,
        path: lastPath.current,
        metadata: { durationMs: Date.now() - startedAt.current },
      });
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  return null;
}
