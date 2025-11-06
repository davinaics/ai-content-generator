import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
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

  // === Hitung Statistik Dinamis ===
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
      description: "Konten yang telah dibuat",
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

  // === Ambil 5 Aktivitas Terbaru ===
  const recent = history.slice(0, 5);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang di AI Content Generator. Lihat statistik dan aktivitas
          terbaru Anda.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : stat.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Terbaru</CardTitle>
          <CardDescription>Konten yang baru saja dibuat</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Memuat data...</p>
          ) : recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Belum ada konten yang dibuat.
            </p>
          ) : (
            <div className="space-y-4">
              {recent.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.topic || "Tanpa Judul"}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.created_at).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded">
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
