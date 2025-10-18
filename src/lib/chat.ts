// src/lib/chat.ts
import { processProductQuery } from './chatIntegration';

export async function testChat(site_id: string, message: string) {
  // Primero intentar buscar productos en el catálogo local
  try {
    const productResponse = await processProductQuery(message);
    if (productResponse && !productResponse.includes('No encuentro')) {
      return { answer: productResponse };
    }
  } catch (error) {
    console.log('Error en búsqueda local de productos:', error);
  }

  // Si no encuentra productos localmente, usar la API externa
  const url =
    (import.meta as any).env?.VITE_EDGE_CHAT_REPLY ??
    "https://akwobmrcwqbbrdvzyiul.functions.supabase.co/functions/v1/chat-reply";

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      site_id,
      session_id: crypto.randomUUID(),
      message,
    }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} - ${txt}`);
  }

  return (await res.json()) as { answer?: string };
}