export function formatDateFr(dateStr: string): string | null {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return null;
      const day = date.getDate();
      // const dayStr = day === 1 ? "1er" : day;
      const month = date.toLocaleString("fr-FR", { month: "long" });
      const year = date.getFullYear();
      return `${month} ${year}`;
    } catch {
      return dateStr;
    }
  }