import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const playlistInput = body.playlist || "";

    // Extract playlist ID from URL or raw ID
    let playlistId = playlistInput.trim();
    if (playlistId.includes("list=")) {
      const match = playlistId.match(/list=([a-zA-Z0-9_-]+)/);
      if (match) playlistId = match[1];
    }

    if (!playlistId) {
      return NextResponse.json({ error: "Keine gültige Playlist-ID oder URL angegeben." }, { status: 400 });
    }

    // Fetch public RSS feed for playlist without needing API key
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${encodeURIComponent(playlistId)}`;
    const res = await fetch(rssUrl, { next: { revalidate: 60 } });

    if (!res.ok) {
      return NextResponse.json({
        success: false,
        message: "Playlist-Feed konnte nicht abgerufen werden. Bitte prüfe, ob die Playlist öffentlich ist."
      }, { status: 404 });
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

    return NextResponse.json({
      success: true,
      playlistId,
      videoCount: entries.length,
      entries
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Fehler beim Synchronisieren der Playlist." }, { status: 500 });
  }
}
