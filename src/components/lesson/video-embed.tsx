export function VideoEmbed({ url }: { url: string | null }) {
  if (!url) return null;

  // Extract YouTube video ID
  let videoId: string | null = null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      videoId = parsed.searchParams.get("v");
    } else if (parsed.hostname.includes("youtu.be")) {
      videoId = parsed.pathname.slice(1);
    }
  } catch {
    return null;
  }

  if (!videoId) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">🎬 Video Lesson</h2>
      <div className="aspect-video rounded-lg overflow-hidden border">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`}
          title="Video lesson"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}
