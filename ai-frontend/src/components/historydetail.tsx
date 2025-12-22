import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Copy, Download } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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

export function HistoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/history")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((d: any) => String(d.id) === String(id));
        setItem(found);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const copyContent = () => {
    if (!item?.content) return;
    navigator.clipboard.writeText(item.content);
    alert("✅ Konten berhasil disalin!");
  };

  const downloadContent = () => {
    if (!item?.content) return;
    const blob = new Blob([item.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${item.topic || "konten_ai"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-[80vh] text-text-muted bg-background">
        <Loader2 className="animate-spin mr-2 h-5 w-5 text-accent" />
        Memuat konten...
      </div>
    );

  if (!item)
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-text-muted bg-background">
        <p>Konten tidak ditemukan.</p>
        <Button
          onClick={() => navigate(-1)}
          className="mt-4 bg-accent hover:bg-accent-hover text-text-primary transition-all"
        >
          <ArrowLeft className="mr-2 ize-4" /> Kembali
        </Button>
      </div>
    );

  return (
    <div className="min-h-screen bg-background text-text-primary p-5 flex justify-center">
      <Card className="w-full bg-surface border border-border-dark shadow-shadow-accent rounded-2xl">
        <CardHeader>
          <div className="flex justify-between">
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition cursor-pointer"
            >
              <ArrowLeft /> Kembali
            </Button>

            <div className="flex gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={copyContent}
                className="border-border-dark text-text-secondary hover:bg-accent-hover hover:text-text-primary transition-all cursor-pointer"
              >
                <Copy className="h-4 w-4 mr-2" /> Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadContent}
                className="border-border-dark text-text-secondary hover:bg-accent-hover hover:text-text-primary transition-all cursor-pointer"
              >
                <Download className="h-4 w-4 mr-2" /> Download
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <CardTitle className="text-3xl font-bold text-accent">
              {formatTitle(item.topic || "Tanpa Judul")}
            </CardTitle>
            <p className="text-sm text-text-muted">
              {new Date(item.created_at).toLocaleString("id-ID", {
                dateStyle: "long",
                timeStyle: "short",
              })}
            </p>
          </div>
        </CardHeader>

        <Separator className="bg-border-dark/40" />

        <CardContent className="mt-6">
          <div className="prose prose-invert max-w-none leading-relaxed text-text-secondary">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {item.content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
