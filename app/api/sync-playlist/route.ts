import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_PLAYLIST_ID } from "@/lib/playlist";

async function performSync(playlistInput: string) {
  let playlistId = (playlistInput || DEFAULT_PLAYLIST_ID).trim();
  if (playlistId.includes("list=")) {
    const match = playlistId.match(/list=([a-zA-Z0-9_-]+)/);
    if (match) playlistId = match[1];
  }

  if (!playlistId) {
    return { error: "Keine gültige Playlist-ID oder URL angegeben.", status: 400 };
  }

  // Fetch public RSS feed for playlist without needing API key
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${encodeURIComponent(playlistId)}`;
  const res = await fetch(rssUrl, { next: { revalidate: 60 } });

  if (!res.ok) {
    return {
      error: "Playlist-Feed konnte nicht abgerufen werden. Bitte prüfe, ob die Playlist öffentlich ist.",
      status: 404
    };
  }

  const xmlText = await res.text();

  // Parse video entries from XML
  const entries: { id: string; title: string; published: string }[] = [];
  const entryMatches = xmlText.match(/<entry>[\s\S]*?<\/entry>/g) || [];

  for (const entryXml of entryMatches) {
    const videoIdMatch = entryXml.match(/<yt:videoId>([\s\S]*?)<\/yt:videoId>/);
    const titleMatch = entryXml.match(/<title>([\s\S]*?)<\/title>/);
    const pubMatch = entryXml.match(/<published>([\s\S]*?)<\/published>/);

    if (videoIdMatch && titleMatch) {
      entries.push({
        id: videoIdMatch[1].trim(),
        title: titleMatch[1].trim().replace("&amp;", "&"),
        published: pubMatch ? pubMatch[1].trim() : ""
      });
    }
  }

  return {
    success: true,
    playlistId,
    videoCount: entries.length,
    entries
  };
}

// GET method for Vercel Daily Cron Job
export async function GET(req: NextRequest) {
  try {
    const playlist = req.nextUrl.searchParams.get("playlist") || DEFAULT_PLAYLIST_ID;
    const result = await performSync(playlist);
    if ("error" in result) {
      return NextResponse.json({ success: false, message: result.error }, { status: result.status });
    }
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Fehler beim Daily Sync." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await performSync(body.playlist || DEFAULT_PLAYLIST_ID);
    if ("error" in result) {
      return NextResponse.json({ success: false, message: result.error }, { status: result.status });
    }
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Fehler beim Synchronisieren der Playlist." }, { status: 500 });
  }
}

