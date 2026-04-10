import { formatDistanceToNow, format, isToday, isYesterday, parseISO } from "date-fns";

export function formatTimeAgo(dateString: string): string {
  try {
    const date = parseISO(dateString);
    if (isNaN(date.getTime())) return "Recently";

    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return "Recently";
  }
}

export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    if (isNaN(date.getTime())) return "Unknown date";

    if (isToday(date)) return `Today, ${format(date, "h:mm a")}`;
    if (isYesterday(date)) return `Yesterday, ${format(date, "h:mm a")}`;
    return format(date, "MMM d, yyyy");
  } catch {
    return "Unknown date";
  }
}

export function formatFullDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    if (isNaN(date.getTime())) return "Unknown date";
    return format(date, "EEEE, MMMM d, yyyy 'at' h:mm a");
  } catch {
    return "Unknown date";
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

export function getDomainFromUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function generatePlaceholderGradient(category: string): string {
  const gradients: Record<string, string> = {
    world: "from-emerald-500 to-teal-600",
    technology: "from-violet-500 to-purple-600",
    business: "from-amber-500 to-orange-600",
    sports: "from-red-500 to-rose-600",
    health: "from-green-500 to-emerald-600",
    entertainment: "from-pink-500 to-rose-600",
    science: "from-cyan-500 to-blue-600",
    general: "from-slate-600 to-slate-700",
  };
  return gradients[category] || gradients.general;
}
