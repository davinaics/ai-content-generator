import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Copy, Download, RefreshCw, FileText } from "lucide-react";
import jsPDF from "jspdf";
import PptxGenJS from "pptxgenjs";

export function ContentCreation() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [rating, setRating] = useState<number | "">("");
  const [feedback, setFeedback] = useState("");
  const [formData, setFormData] = useState({
    topic: "",
    keywords: "",
    tone: "",
    category: "",
    contentType: "",
    length: "",
  });

  const contentOptions: Record<string, string[]> = {
    "AI Education": [
      "Materi Pembelajaran",
      "Modul Belajar",
      "Rangkuman Materi",
      "Penjelasan Konsep Sulit",
      "Soal Latihan",
      "Kuis Interaktif",
      "Penugasan",
    ],
    "AI Sales": [
      "Copywriting Sosial Media",
      "Iklan Produk",
      "Brosur / Pamflet Promosi",
      "Deskripsi Produk",
      "Email Marketing",
      "Proposal Penawaran",
      "Surat Kontrak",
    ],
  };

  const cleanText = (text: string) => {
    return text
      .replace(/\*\*/g, "")
      .replace(/[#*_`~>|]/g, "")
      .replace(/<\|.*?\|>/g, "")
      .trim();
  };

  const handleGenerate = async () => {
    if (isGenerating || !formData.topic) return;

    setIsGenerating(true);

    try {
      const prompt = `
      Kategori: ${formData.category}.
      Jenis konten: ${formData.contentType}.
      Topik: ${formData.topic}.
      Kata kunci: ${formData.keywords}.
      Tone: ${formData.tone}.
      Panjang: ${formData.length}.
    `;

      const response = await fetch("http://127.0.0.1:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          topic: formData.topic,
          keywords: formData.keywords,
          tone: formData.tone,
          category: formData.category,
          content_type: formData.contentType,
          length: formData.length,
          max_tokens: 3000,
        }),
      });

      const data = await response.json();
      const content = cleanText(data.result || "Tidak ada hasil.");
      setGeneratedContent(content);

      setRating("");
      setFeedback("");
    } catch (error) {
      console.error(error);
      setGeneratedContent("Terjadi kesalahan saat membuat konten.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "category" ? { contentType: "" } : {}),
    }));
  };

  const copyToClipboard = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent);
      alert("✅ Konten berhasil disalin ke clipboard!");
    } else {
      alert("⚠️ Belum ada konten untuk disalin.");
    }
  };

  const handleDownloadPDF = () => {
    if (!generatedContent) {
      alert("⚠️ Belum ada konten untuk diunduh.");
      return;
    }

    const doc = new jsPDF();
    const marginX = 15;
    const marginY = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - marginX * 2;

    doc.setFont("Times", "Normal");
    doc.setFontSize(14);
    doc.text(formData.topic || "Hasil Konten AI", marginX, marginY);

    doc.setFontSize(11);
    const lines = doc.splitTextToSize(generatedContent, maxWidth);
    doc.text(lines, marginX, marginY + 10);

    doc.save(`${formData.topic || "hasil_konten"}.pdf`);
  };

  const handleDownloadPPT = async () => {
    if (!generatedContent) {
      alert("⚠️ Belum ada konten untuk diunduh.");
      return;
    }

    const pptx = new PptxGenJS();

    // Slide Judul
    const titleSlide = pptx.addSlide();
    titleSlide.addText(formData.topic || "AI Generated Content", {
      x: 1,
      y: 1.5,
      fontSize: 28,
      bold: true,
    });

    // Pecah konten per paragraf → 1 slide
    const paragraphs = generatedContent
      .split("\n")
      .filter((p) => p.trim() !== "");

    paragraphs.forEach((text) => {
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
      fileName: `${formData.topic || "hasil_konten"}.pptx`,
    });
  };

  // Teks dinamis berdasarkan skor rating
  const getRatingHelperText = () => {
    if (!rating) {
      return "Beri penilaian untuk kualitas konten ini (1–10), lalu tuliskan 3 masukan singkat agar AI bisa memberikan jawaban yang lebih baik di permintaan berikutnya.";
    }

    const score = Number(rating);

    if (score >= 1 && score <= 5) {
      return "Sepertinya konten ini masih jauh dari harapan kamu. Tuliskan 3 hal utama yang perlu diperbaiki agar kualitas jawabannya bisa naik setidaknya menjadi 7/10. Misalnya: bagian mana yang kurang relevan, kurang lengkap, atau gaya bahasanya tidak sesuai.";
    }

    if (score >= 6 && score <= 8) {
      return "Konten ini sudah lumayan, tapi masih bisa ditingkatkan. Tuliskan 3 saran perbaikan agar jawaban seperti ini bisa menjadi 9/10. Misalnya: bagian mana yang perlu diperdalam, contoh apa yang bisa ditambahkan, atau bagian mana yang perlu dibuat lebih runtut.";
    }

    // 9–10
    return "Hampir sempurna! ✨ Tuliskan 3 masukan kecil agar jawaban seperti ini bisa menjadi 10/10 untuk kamu. Misalnya: penyesuaian gaya bahasa, struktur paragraf, atau detail tambahan yang masih kamu butuhkan.";
  };

  return (
    <div className="flex min-h-screen bg-background text-text-secondary">
      {/* 🧩 Sidebar Form */}
      <div className="w-1/3 p-6 border-r border-border-dark bg-surface/50 backdrop-blur-md">
        <Card className="bg-surface border border-border-light hover:border-accent transition-all duration-300 rounded-xl shadow-accent/10">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-text-primary">
              Buat Konten Baru
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Topic */}
            <div className="space-y-2">
              <Label className="text-text-muted">Topik</Label>
              <Input
                placeholder="Masukkan topik konten..."
                className="bg-surface-alt border-border-light focus:border-accent focus:ring-0"
                value={formData.topic}
                onChange={(e) => handleInputChange("topic", e.target.value)}
              />
            </div>

            {/* Keywords */}
            <div className="space-y-2">
              <Label className="text-text-muted">Kata Kunci</Label>
              <Input
                placeholder="Kata kunci dipisahkan koma..."
                className="bg-surface-alt border-border-light focus:border-accent"
                value={formData.keywords}
                onChange={(e) => handleInputChange("keywords", e.target.value)}
              />
            </div>

            {/* Tone */}
            <div className="space-y-2">
              <Label className="text-text-muted">Tone</Label>
              <Select
                value={formData.tone}
                onValueChange={(v) => handleInputChange("tone", v)}
              >
                <SelectTrigger className="bg-surface-alt border-border-light focus:border-accent">
                  <SelectValue placeholder="Pilih tone konten" />
                </SelectTrigger>
                <SelectContent className="bg-surface border-border-dark text-text-secondary">
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="text-text-muted">Kategori</Label>
              <Select
                value={formData.category}
                onValueChange={(v) => handleInputChange("category", v)}
              >
                <SelectTrigger className="bg-surface-alt border-border-light focus:border-accent">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent className="bg-surface border-border-dark text-text-secondary">
                  <SelectItem value="AI Education">AI Education</SelectItem>
                  <SelectItem value="AI Sales">AI Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Content Type */}
            {formData.category && (
              <div className="space-y-2">
                <Label className="text-text-muted">Jenis Konten</Label>
                <Select
                  value={formData.contentType}
                  onValueChange={(v) => handleInputChange("contentType", v)}
                >
                  <SelectTrigger className="bg-surface-alt border-border-light focus:border-accent">
                    <SelectValue placeholder="Pilih jenis konten" />
                  </SelectTrigger>
                  <SelectContent className="bg-surface border-border-dark text-text-secondary max-h-64">
                    {contentOptions[formData.category].map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Length */}
            <div className="space-y-2">
              <Label className="text-text-muted">Panjang Konten</Label>
              <Select
                value={formData.length}
                onValueChange={(v) => handleInputChange("length", v)}
              >
                <SelectTrigger className="bg-surface-alt border-border-light focus:border-accent">
                  <SelectValue placeholder="Pilih panjang konten" />
                </SelectTrigger>
                <SelectContent className="bg-surface border-border-dark text-text-secondary">
                  <SelectItem value="short">Pendek (100–300 kata)</SelectItem>
                  <SelectItem value="medium">Sedang (300–600 kata)</SelectItem>
                  <SelectItem value="long">Panjang (600–1000 kata)</SelectItem>
                  <SelectItem value="extended">
                    Sangat Panjang (1000+ kata)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !formData.topic}
              className="w-full bg-accent hover:bg-accent-hover transition-all duration-200"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Membuat...
                </>
              ) : (
                "Generate Konten"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 📄 Panel kanan: hasil + feedback (dipisah card) */}
      <div className="flex-1 p-6 space-y-4">
        {/* Card Hasil Konten */}
        <Card className="bg-surface border border-border-light rounded-xl hover:border-accent transition-all duration-300 shadow-accent/10 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border-light pb-3">
            <CardTitle className="text-lg text-text-primary">
              Hasil Konten
            </CardTitle>
            {generatedContent && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="border-border-light hover:border-accent hover:bg-active/20"
                >
                  <Copy className="h-4 w-4 mr-2" /> Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadPDF}
                  className="border-border-light hover:border-accent hover:bg-active/20"
                >
                  <Download className="h-4 w-4 mr-2" /> PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadPPT}
                  className="border-border-light hover:border-accent hover:bg-active/20"
                >
                  <Download className="h-4 w-4 mr-2" /> PPT
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerate}
                  className="border-border-light hover:border-accent hover:bg-active/20"
                >
                  <RefreshCw className="h-4 w-4 mr-2" /> Regenerate
                </Button>
              </div>
            )}
          </CardHeader>

          <CardContent>
            {generatedContent ? (
              <Textarea
                className="w-full min-h-[360px] max-h-[60vh] overflow-auto resize-none font-mono bg-surface-alt text-text-secondary border-border-light focus:border-accent"
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
              />
            ) : (
              <div className="flex items-center justify-center h-[300px] text-text-muted">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-40 text-accent" />
                  <p>Konten yang dibuat AI akan muncul di sini</p>
                  <p className="text-sm text-text-muted">
                    Isi form di sebelah kiri dan klik{" "}
                    <span className="text-accent font-medium">
                      Generate Konten
                    </span>
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card Penilaian Konten (di bawah, hanya jika sudah ada konten) */}
        {generatedContent && (
          <Card className="bg-surface border border-border-light rounded-xl shadow-accent/10">
            <CardHeader className="pb-2">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-text-primary">
                    Penilaian Konten
                  </CardTitle>
                  <p className="text-xs text-text-muted mt-1">
                    {getRatingHelperText()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Label htmlFor="rating" className="text-xs text-text-muted">
                    Skor (1–10)
                  </Label>
                  <Input
                    id="rating"
                    type="number"
                    min={1}
                    max={10}
                    value={rating}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "") {
                        setRating("");
                      } else {
                        const n = Number(v);
                        if (n >= 1 && n <= 10) {
                          setRating(n);
                        }
                      }
                    }}
                    className="w-16 text-center bg-surface-alt border-border-light focus:border-accent focus:ring-0 text-text-primary"
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-2">
              <Label htmlFor="feedback" className="text-xs text-text-muted">
                Tulis 3 poin masukan kamu di sini
              </Label>
              <Textarea
                id="feedback"
                rows={3}
                className="bg-surface-alt border-border-light focus:border-accent text-text-secondary"
                placeholder={`- Contoh: Tambahkan contoh praktis di bagian akhir
- Contoh: Perjelas struktur langkah-langkah
- Contoh: Sesuaikan gaya bahasa agar lebih santai`}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
