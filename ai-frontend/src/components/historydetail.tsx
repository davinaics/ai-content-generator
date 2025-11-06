import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function HistoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:8000/history")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((d: any) => d.id === id);
        setItem(found);
      });
  }, [id]);

  if (!item) return <p className="p-6">Memuat konten...</p>;

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm mb-4 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali
      </button>

      <h1 className="text-2xl font-bold mb-2">{item.topic}</h1>
      <p className="text-muted-foreground mb-4">
        {new Date(item.created_at).toLocaleString()}
      </p>

      <article className="prose prose-neutral max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {item.content}
        </ReactMarkdown>
      </article>
    </div>
  );
}
