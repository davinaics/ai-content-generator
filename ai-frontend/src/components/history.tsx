import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FilterCategory = "all" | "education" | "sales";

const EDUCATION_TYPES = [
  "Materi Pembelajaran",
  "Soal Latihan",
  "Kuis Interaktif",
  "Penugasan",
  "Rangkuman Materi",
  "Modul Belajar",
  "Penjelasan Konsep Sulit",
];

const SALES_TYPES = [
  "Iklan Produk",
  "Brosur / Pamflet Promosi",
  "Proposal Penawaran",
  "Email Marketing",
  "Surat Kontrak",
  "Deskripsi Produk",
  "Copywriting Sosial Media",
];

// helper title case
const formatTitle = (text: string) => {
  if (!text) return "";
  const smallWords = [
    "dan",
    "di",
    "ke",
    "dari",
    "yang",
    "untuk",
    "pada",
    "dengan",
    "atau",
    "karena",
    "dalam",
  ];

  return text
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word, index) => {
      if (index !== 0 && smallWords.includes(word)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

export function History() {
  const [history, setHistory] = useState<any[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/history")
      .then((res) => res.json())
      .then((data) => {
        const sorted = (data || []).sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setHistory(sorted);
      })
      .catch((err) => console.error("Gagal mengambil data history:", err));
  }, []);

  const cleanText = (text: string) => {
    return text
      .replace(/\*\*/g, "")
      .replace(/[#*_`~>|]/g, "")
      .replace(/<\|.*?\|>/g, "")
      .replace(/\n/g, " ")
      .trim();
  };

  const getBadgeClasses = (category: string) => {
    const c = (category || "").toLowerCase();

    if (c.includes("education") || c.includes("edukasi")) {
      return "bg-emerald-900/60 text-emerald-300";
    }

    if (
      c.includes("sales") ||
      c.includes("marketing") ||
      c.includes("copywriting")
    ) {
      return "bg-orange-900/60 text-orange-300";
    }

    return "bg-accent/15 text-accent";
  };

  const filteredHistory = history.filter((item) => {
    const category = (item.category || "").toLowerCase();
    const contentType = item.content_type || "";

    if (categoryFilter === "education") {
      if (
        !(
          category.includes("education") ||
          category.includes("edukasi") ||
          category.includes("ai education")
        )
      ) {
        return false;
      }
    } else if (categoryFilter === "sales") {
      if (
        !(
          category.includes("sales") ||
          category.includes("marketing") ||
          category.includes("copywriting")
        )
      ) {
        return false;
      }
    }

    if (typeFilter !== "all") {
      if (contentType !== typeFilter) return false;
    }

    return true;
  });

  const currentTypeOptions =
    categoryFilter === "education"
      ? EDUCATION_TYPES
      : categoryFilter === "sales"
      ? SALES_TYPES
      : [];

  return (
    <div className="min-h-screen py-3 px-8 bg-background text-text-primary">
      <div className="mx-auto space-y-8">
        {/* Header + Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border-dark pb-3">
          <h1 className="text-3xl font-bold tracking-tight text-accent">
            Riwayat Konten
          </h1>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="space-y-1">
              <p className="text-xs text-text-muted">Kategori</p>
              <Select
                value={categoryFilter}
                onValueChange={(val: FilterCategory) => {
                  setCategoryFilter(val);
                  setTypeFilter("all");
                }}
              >
                <SelectTrigger className="w-[180px] bg-surface border-border-dark text-text-secondary">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent className="bg-surface border-border-dark text-text-secondary">
                  <SelectItem value="all">Semua kategori</SelectItem>
                  <SelectItem value="education">AI Education</SelectItem>
                  <SelectItem value="sales">AI Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-text-muted">Jenis konten</p>
              <Select
                value={typeFilter}
                onValueChange={(val: string) => setTypeFilter(val)}
                disabled={categoryFilter === "all"}
              >
                <SelectTrigger className="w-[220px] bg-surface border-border-dark text-text-secondary disabled:opacity-60">
                  <SelectValue
                    placeholder={
                      categoryFilter === "all"
                        ? "Pilih kategori dulu"
                        : "Semua jenis konten"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="bg-surface border-border-dark text-text-secondary max-h-64">
                  <SelectItem value="all">Semua jenis konten</SelectItem>
                  {currentTypeOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <p className="text-text-muted text-center text-sm">
            Belum ada konten yang sesuai filter.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHistory.map((item: any) => (
              <Card
                key={item.id}
                className="cursor-pointer bg-surface border border-border-dark hover:border-accent-hover hover:shadow-shadow-accent transition-all duration-300 rounded-2xl"
                onClick={() => navigate(`/history/${item.id}`)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-text-primary line-clamp-1">
                    {formatTitle(item.topic || "Tanpa Judul")}
                  </CardTitle>

                  <p className="text-xs text-text-secondary flex items-center gap-2 mt-1">
                    <Clock className="h-4 w-4 text-accent" />
                    {new Date(item.created_at).toLocaleString("id-ID")}
                  </p>

                  {item.content_type && (
                    <span
                      className={`mt-2 inline-block text-[11px] px-3 py-1 rounded-full ${getBadgeClasses(
                        item.category || ""
                      )}`}
                    >
                      {item.content_type}
                    </span>
                  )}
                </CardHeader>

                <CardContent>
                  <p className="line-clamp-3 text-sm text-text-secondary leading-relaxed">
                    {cleanText(item.content).slice(0, 200)}...
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
