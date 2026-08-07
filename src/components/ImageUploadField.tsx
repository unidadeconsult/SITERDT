import { useRef, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { getStoredAdminPassword } from '../lib/adminAuth';

const MAX_SIZE_MB = 5;

interface ImageUploadFieldProps {
  label: string;
  hint: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  round?: boolean;
}

export default function ImageUploadField({
  label,
  hint,
  value,
  onChange,
  required,
  round,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File) => {
    setError('');
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Arquivo muito grande (máx. ${MAX_SIZE_MB}MB).`);
      return;
    }
    setUploading(true);
    try {
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
          'X-Admin-Password': getStoredAdminPassword(),
        },
        body: file,
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) {
        setError(data.error || 'Falha ao enviar a imagem.');
        return;
      }
      onChange(data.url);
    } catch {
      setError('Falha de conexão ao enviar a imagem.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="text-xs font-condensed uppercase tracking-wide text-white/50 mb-1 flex items-center justify-between">
        <span>
          {label} {required && '*'}
        </span>
        <span className="text-white/30 normal-case tracking-normal">{hint}</span>
      </label>

      <div className="flex items-center gap-3">
        {value && (
          <img
            src={value}
            alt=""
            className={`w-14 h-14 object-cover border border-white/10 shrink-0 ${
              round ? 'rounded-full' : 'rounded'
            }`}
          />
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-sm px-3 py-2 rounded transition-colors disabled:opacity-50"
        >
          {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
          {value ? 'Trocar imagem' : 'Enviar imagem'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = '';
          }}
        />
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
