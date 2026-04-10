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

export function parseRSSDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return new Date().toISOString();
    return date.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

export function generatePlaceholderGradient(category: string): string {
  const gradients: Record<string, string> = {
    "top-stories": "from-red-600 to-red-700",
    world: "from-amber-500 to-orange-600",
    uk: "from-blue-600 to-indigo-700",
    asia: "from-emerald-500 to-teal-600",
    "middle-east": "from-orange-500 to-red-600",
    africa: "from-yellow-500 to-amber-600",
    business: "from-emerald-600 to-green-700",
    technology: "from-violet-500 to-purple-600",
    science: "from-cyan-500 to-teal-600",
    sport: "from-green-500 to-emerald-600",
    football: "from-green-600 to-lime-600",
    cricket: "from-sky-500 to-blue-600",
    entertainment: "from-pink-500 to-rose-600",
  };
  return gradients[category] || gradients["top-stories"];
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "\u2019")
    .replace(/&lsquo;/g, "\u2018")
    .replace(/&rdquo;/g, "\u201D")
    .replace(/&ldquo;/g, "\u201C")
    .replace(/&mdash;/g, "\u2014")
    .replace(/&ndash;/g, "\u2013")
    .replace(/\s+/g, " ")
    .trim();
}
