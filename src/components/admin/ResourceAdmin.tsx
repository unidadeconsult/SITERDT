import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { getStoredAdminPassword } from '../../lib/adminAuth';

interface ResourceItem {
  id: string;
}

interface ResourceAdminProps<T extends ResourceItem> {
  resourceUrl: string;
  itemLabel: string;
  renderItem: (item: T) => { title: string; subtitle: string };
  FormComponent: React.ComponentType<{
    initial?: T;
    submitLabel: string;
    onSubmit: (fields: Record<string, string>) => Promise<void>;
  }>;
  onAuthError?: () => void;
}

export default function ResourceAdmin<T extends ResourceItem>({
  resourceUrl,
  itemLabel,
  renderItem,
  FormComponent,
  onAuthError,
}: ResourceAdminProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [editing, setEditing] = useState<T | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchItems = () => {
    setLoading(true);
    fetch(resourceUrl)
      .then((res) => res.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const create = async (fields: Record<string, string>) => {
    const res = await fetch(resourceUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: getStoredAdminPassword(), ...fields }),
    });
    if (res.status === 401) {
      onAuthError?.();
      throw new Error('Senha de administrador incorreta.');
    }
    const data = await res.json();
    if (!res.ok || data.ok === false) throw new Error(data.error || 'Falha ao criar.');
    fetchItems();
    setView('list');
  };

  const update = async (fields: Record<string, string>) => {
    if (!editing) return;
    const res = await fetch(resourceUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: getStoredAdminPassword(), id: editing.id, ...fields }),
    });
    if (res.status === 401) {
      onAuthError?.();
      throw new Error('Senha de administrador incorreta.');
    }
    const data = await res.json();
    if (!res.ok || data.ok === false) throw new Error(data.error || 'Falha ao atualizar.');
    fetchItems();
    setView('list');
    setEditing(null);
  };

  const remove = async (id: string, title: string) => {
    if (!confirm(`Excluir "${title}"? Essa ação não pode ser desfeita.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(resourceUrl, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: getStoredAdminPassword(), id }),
      });
      if (res.status === 401) {
        onAuthError?.();
        return;
      }
      const data = await res.json();
      if (!res.ok || data.ok === false) {
        alert(data.error || 'Falha ao excluir.');
        return;
      }
      fetchItems();
    } finally {
      setDeleting(null);
    }
  };

  if (view === 'create') {
    return (
      <div>
        <button
          onClick={() => setView('list')}
          className="flex items-center gap-1.5 text-white/60 hover:text-rdt-gold text-sm mb-6"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>
        <FormComponent submitLabel={`Adicionar ${itemLabel}`} onSubmit={create} />
      </div>
    );
  }

  if (view === 'edit' && editing) {
    return (
      <div>
        <button
          onClick={() => {
            setView('list');
            setEditing(null);
          }}
          className="flex items-center gap-1.5 text-white/60 hover:text-rdt-gold text-sm mb-6"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>
        <FormComponent initial={editing} submitLabel="Salvar alterações" onSubmit={update} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <p className="text-white/50 text-sm">
          {items.length} {itemLabel.toLowerCase()}
          {items.length === 1 ? '' : 's'} cadastrado{items.length === 1 ? '' : 's'}.
        </p>
        <button
          onClick={() => setView('create')}
          className="flex items-center gap-2 bg-rdt-gold text-rdt-black font-condensed font-bold uppercase tracking-wide text-sm px-4 py-2.5 rounded hover:bg-white transition-colors"
        >
          <Plus size={16} />
          Adicionar {itemLabel}
        </button>
      </div>

      {loading && <p className="text-white/40 text-sm">Carregando...</p>}

      <div className="flex flex-col divide-y divide-white/5 border-t border-white/5">
        {items.map((item) => {
          const { title, subtitle } = renderItem(item);
          return (
            <div key={item.id} className="flex items-center justify-between gap-4 py-4">
              <div className="min-w-0">
                <p className="text-white font-semibold truncate">{title}</p>
                <p className="text-white/40 text-xs mt-1 truncate">{subtitle}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setEditing(item);
                    setView('edit');
                  }}
                  className="p-2 rounded border border-white/10 text-white/60 hover:text-rdt-gold hover:border-rdt-gold/40 transition-colors"
                  aria-label="Editar"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => remove(item.id, title)}
                  disabled={deleting === item.id}
                  className="p-2 rounded border border-white/10 text-white/60 hover:text-red-400 hover:border-red-400/40 transition-colors disabled:opacity-40"
                  aria-label="Excluir"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
