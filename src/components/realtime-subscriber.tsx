"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface RealtimeSubscriberProps {
  table: string;
  schema?: string;
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
}

export function RealtimeSubscriber({
  table,
  schema = "public",
  event = "*",
}: RealtimeSubscriberProps) {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`realtime:${schema}:${table}`)
      .on(
        "postgres_changes" as any,
        { event, schema, table } as any,
        (payload: any) => {
          console.log(`[Realtime] Received ${event} event on ${table}:`, payload);
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router, table, schema, event]);

  return null;
}
