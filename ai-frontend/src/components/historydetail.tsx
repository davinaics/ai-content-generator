import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Copy, Download } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import jsPDF from "jspdf";
import PptxGenJS from "pptxgenjs";

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

  const downloadPDF = () => {
    if (!item?.content) return;

    const doc = new jsPDF();
    const marginX = 15;
    const marginY = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - marginX * 2;

    doc.setFont("Times", "Normal");
    doc.setFontSize(16);
    doc.text(formatTitle(item.topic || "Hasil Konten AI"), marginX, marginY);

    doc.setFontSize(11);
    const lines = doc.splitTextToSize(item.content, maxWidth);
    doc.text(lines, marginX, marginY + 12);

    doc.save(`${item.topic || "konten_ai"}.pdf`);
  };

  const downloadPPT = async () => {
    if (!item?.content) return;

    const pptx = new PptxGenJS();

    // Slide Judul
    const titleSlide = pptx.addSlide();
    titleSlide.addText(formatTitle(item.topic || "AI Generated Content"), {
      x: 1,
      y: 1.5,
      fontSize: 28,
      bold: true,
    });

    // 1 paragraf = 1 slide
    const paragraphs = item.content
      .split("\n")
      .filter((p: string) => p.trim() !== "");

    paragraphs.forEach((text: string) => {
      const slide = pptx.addSlide();
      slide.addText(text, {
        x: 0.8,
        y: 0.8,
        w: 8.5,
        h: 4.5,
        fontSize: 16,
        wrap: true,
      });
    });

    await pptx.writeFile({
      fileName: `${item.topic || "konten_ai"}.pptx`,
    });
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
                onClick={downloadPDF}
                className="border-border-dark text-text-secondary hover:bg-accent-hover hover:text-text-primary transition-all"
              >
                <Download className="h-4 w-4 mr-2" /> PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadPPT}
                className="border-border-dark text-text-secondary hover:bg-accent-hover hover:text-text-primary transition-all"
              >
                <Download className="h-4 w-4 mr-2" /> PPT
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
