export function formatDate(value: string | null | undefined) {
  if (!value) {
    return "Belum dijadwalkan";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function statusClass(status: string | null | undefined) {
  const normalized = status?.toLowerCase() ?? "";

  if (normalized.includes("selesai")) {
    return "bg-[#2C3B2E]/10 text-[#2C3B2E]";
  }

  if (normalized.includes("jalan") || normalized.includes("berlangsung")) {
    return "bg-[#4A5D45]/10 text-[#4A5D45]";
  }

  return "bg-[#C08A2E]/15 text-[#C08A2E]";
}
