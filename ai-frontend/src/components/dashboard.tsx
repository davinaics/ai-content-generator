import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Clock, Users } from "lucide-react";

// Helper: bikin judul jadi kapital tiap kata (kecuali kata kecil tertentu)
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

export function Dashboard() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("http://localhost:8000/history");
        const data = await response.json();
        setHistory(data || []);
      } catch (error) {
        console.error("Gagal mengambil data riwayat:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const totalKonten = history.length;
  const hariIni = history.filter((item) => {
    const created = new Date(item.created_at);
    const now = new Date();
    return (
      created.getDate() === now.getDate() &&
      created.getMonth() === now.getMonth() &&
      created.getFullYear() === now.getFullYear()
    );
  }).length;

  const kategoriUnik = new Set(
    history.filter((item) => item.content_type).map((item) => item.content_type)
  ).size;

  const stats = [
    {
      title: "Total Konten",
      value: totalKonten,
      description: "Total konten yang telah dibuat",
      icon: FileText,
    },
    {
      title: "Hari Ini",
      value: hariIni,
      description: "Total konten baru",
      icon: Clock,
    },
    {
      title: "Kategori",
      value: kategoriUnik,
      description: "Total kategori konten berbeda yang pernah dibuat",
      icon: Users,
    },
  ];

  // 3 konten terbaru
  const recent = history
    .slice()
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 3);

  // warna badge (sama dengan History.tsx)
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

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Dashboard</h1>
        <p className="text-text-muted">
          Selamat datang di{" "}
          <span className="text-accent font-semibold">
            AI Content Generator
          </span>
          . Lihat statistik dan aktivitas terbaru kamu.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3 mb-10">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="bg-surface border border-border text-foreground hover:border-accent/60 hover:shadow-accent/30 transition-all duration-300 backdrop-blur-md"
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-text-muted">
                {stat.title}
              </CardTitle>
              <stat.icon className="size-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-accent">
                {loading ? "..." : stat.value}
              </div>
              <p className="text-xs text-text-muted mt-2">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="bg-surface border border-border text-foreground backdrop-blur-md">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-text-primary">
              Aktivitas Terbaru
            </CardTitle>
            <CardDescription className="text-text-muted">
              Konten terbaru yang telah dihasilkan
            </CardDescription>
          </div>

          {/* Legend warna */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-900/80 border border-emerald-400/60" />
              <span>Education</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-orange-900/80 border border-orange-400/60" />
              <span>Sales</span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-sm text-text-muted">Memuat data...</p>
          ) : recent.length === 0 ? (
            <p className="text-sm text-text-muted">
              Belum ada konten yang dibuat.
            </p>
          ) : (
            <div className="space-y-3">
              {recent.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-card p-4 rounded-xl border border-border hover:border-accent/50 hover:bg-accent/10 transition-all duration-200"
                >
                  <div className="text-white">
                    <p className="font-medium text-foreground">
                      {formatTitle(item.topic || "Tanpa Judul")}
                    </p>
                    <p className="text-xs text-text-muted">
                      {new Date(item.created_at).toLocaleString("id-ID")}
                    </p>
                  </div>
                  {item.content_type && (
                    <span
                      className={
                        "px-3 py-1 text-xs rounded-md shadow " +
                        getBadgeClasses(item.category || "")
                      }
                    >
                      {item.content_type}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
