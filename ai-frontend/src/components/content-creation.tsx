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

export function ContentCreation() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
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
      "Soal Latihan",
      "Kuis Interaktif",
      "Penugasan",
      "Rangkuman Materi",
      "Modul Belajar",
      "Penjelasan Konsep Sulit",
    ],
    "AI Sales": [
      "Iklan Produk",
      "Brosur / Pamflet Promosi",
      "Proposal Penawaran",
      "Email Marketing",
      "Surat Kontrak",
      "Deskripsi Produk",
      "Copywriting Sosial Media",
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
    if (!formData.topic) return;
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

      // await fetch("http://localhost:8000/history", {
      //  method: "POST",
      //  headers: { "Content-Type": "application/json" },
      //  body: JSON.stringify({
      //   topic: formData.topic,
      //    content,
      //    created_at: new Date().toISOString(),
      //  }),
      //});
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

  const handleDownload = () => {
    if (!generatedContent) {
      alert("⚠️ Belum ada konten untuk diunduh.");
      return;
    }

    const blob = new Blob([generatedContent], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formData.topic || "hasil_konten"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
                  <SelectContent className="bg-surface border-border-dark text-text-secondary">
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

      {/* 📄 Output Panel */}
      <div className="flex-1 p-6">
        <Card className="h-full bg-surface border border-border-light rounded-xl hover:border-accent transition-all duration-300 shadow-accent/10 backdrop-blur-md">
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
                  onClick={handleDownload}
                  className="border-border-light hover:border-accent hover:bg-active/20"
                >
                  <Download className="h-4 w-4 mr-2" /> Download
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

          <CardContent className="h-full">
            {generatedContent ? (
              <Textarea
                className="w-full h-full min-h-[500px] resize-none font-mono bg-surface-alt text-text-secondary border-border-light focus:border-accent"
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-text-muted">
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
      </div>
    </div>
  );
}
