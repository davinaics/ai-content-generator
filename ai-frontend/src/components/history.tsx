import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  const cleanText = (text: string) => {
    return text
      .replace(/\*\*/g, "")
      .replace(/[#*_`~>|]/g, "")
      .replace(/<\|.*?\|>/g, "")
      .replace(/\n/g, " ")
      .trim();
  };

  return (
    <div className="min-h-screen py-3 px-8 bg-background text-text-primary">
      <div className="mx-auto space-y-8">
        <h1 className="text-3xl font-bold tracking-tight text-accent border-b border-border-dark pb-3">
          Riwayat Konten
        </h1>

        {history.length === 0 ? (
          <p className="text-text-muted text-center text-sm">
            Belum ada konten yang dibuat.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((item: any) => (
              <Card
                key={item.id}
                className="cursor-pointer bg-surface border border-border-dark hover:border-accent-hover hover:shadow-shadow-accent transition-all duration-300 rounded-2xl"
                onClick={() => navigate(`/history/${item.id}`)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-text-primary line-clamp-1">
                    {item.topic || "Tanpa Judul"}
                  </CardTitle>
                  <p className="text-xs text-text-secondary flex items-center gap-2 mt-1">
                    <Clock className="h-4 w-4 text-accent" />{" "}
                    {new Date(item.created_at).toLocaleString()}
                  </p>
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
