export function formatTime(iso: string) {
  const date = new Date(iso);
  const mins = Math.max(1, Math.floor((Date.now() - date.getTime()) / 60_000));
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
  return date.toLocaleDateString('en', { month: 'short', day: 'numeric' });
}

