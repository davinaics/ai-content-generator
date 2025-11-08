import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Clock, Users } from "lucide-react";

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
  const kategoriUnik = new Set(history.map((item) => item.category)).size;

  const stats = [
    {
      title: "Total Konten",
      value: totalKonten,
      description: "Semua konten yang telah dibuat",
      icon: FileText,
    },
    {
      title: "Hari Ini",
      value: hariIni,
      description: "Konten baru hari ini",
      icon: Clock,
    },
    {
      title: "Kategori",
      value: kategoriUnik,
      description: "Kategori konten berbeda",
      icon: Users,
    },
  ];

  const recent = history.slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Dashboard
        </h1>
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
              <div className="text-4xl font-bold text-white">
                {loading ? "..." : stat.value}
              </div>
              <p className="text-xs text-text-muted mt-2">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="bg-surface border border-border text-foreground backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-text-primary">
            Aktivitas Terbaru
          </CardTitle>
          <CardDescription className="text-text-muted">
            Konten terbaru yang telah dihasilkan
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-text-muted">Memuat data...</p>
          ) : recent.length === 0 ? (
            <p className="text-sm text-text-muted">Belum ada konten yang dibuat.</p>
          ) : (
            <div className="space-y-3">
              {recent.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-card p-4 rounded-xl border border-border hover:border-accent/50 hover:bg-accent/10 transition-all duration-200"
                >
                  <div className="text-white">
                    <p className="font-medium text-foreground">
                      {item.topic || "Tanpa Judul"}
                    </p>
                    <p className="text-xs text-text-muted">
                      {new Date(item.created_at).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-accent text-white rounded-md shadow">
                    {item.content_type || "Konten"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
