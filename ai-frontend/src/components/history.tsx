import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function History() {
  const [history, setHistory] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/history")
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .catch((err) => console.error("Gagal mengambil data history:", err));
  }, []);

  // 🔹 Fungsi buat bersihin markdown dan karakter aneh dari konten
  const cleanText = (text: string) => {
    return text
      .replace(/\*\*/g, "") // hapus **bold**
      .replace(/[#*_`~>|]/g, "") // hapus markdown simbol
      .replace(/<\|.*?\|>/g, "") // hapus tag begin__of__sentence dll
      .replace(/\n/g, " ") // ganti newline jadi spasi
      .trim();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Riwayat Konten</h1>

      {history.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Belum ada konten yang dibuat.
        </p>
      ) : (
        <div className="space-y-4">
          {history.map((item: any) => (
            <Card
              key={item.id}
              className="cursor-pointer hover:shadow-md transition border border-gray-200"
              onClick={() => navigate(`/history/${item.id}`)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">
                  {item.topic || "Tanpa Judul"}
                </CardTitle>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />{" "}
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </CardHeader>

              <CardContent>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {cleanText(item.content).slice(0, 180)}...
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
