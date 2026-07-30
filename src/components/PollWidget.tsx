import { useEffect, useState } from 'react';
import { Vote, CheckCircle2, Loader2 } from 'lucide-react';
import { usePoll } from '../context/PollContext';

export default function PollWidget() {
  const { poll, vote } = usePoll();
  const [votedId, setVotedId] = useState<string | null>(null);
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    setVotedId(localStorage.getItem(`rdt_voted_${poll.id}`));
  }, [poll.id]);

  const total = poll.options.reduce((sum, o) => sum + o.votes, 0);

  const handleVote = async (id: string) => {
    if (votedId || voting) return;
    setVoting(true);
    await vote(id);
    localStorage.setItem(`rdt_voted_${poll.id}`, id);
    setVotedId(id);
    setVoting(false);
  };

  return (
    <div className="bg-rdt-graphite/40 border border-white/5 rounded-lg p-5">
      <div className="flex items-center gap-2 mb-1">
        <Vote className="text-rdt-gold" size={20} />
        <h2 className="font-display font-bold text-white text-lg">Enquete do Dia</h2>
      </div>
      <p className="text-white/70 text-sm mb-4">{poll.question}</p>

      <div className="flex flex-col gap-2.5">
        {poll.options.map((opt) => {
          const pct = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
          const isChosen = votedId === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => handleVote(opt.id)}
              disabled={!!votedId || voting}
              className={`relative w-full text-left rounded-md border overflow-hidden transition-colors ${
                votedId
                  ? 'border-white/10 cursor-default'
                  : 'border-white/15 hover:border-rdt-gold/50 cursor-pointer'
              }`}
            >
              {votedId && (
                <div
                  className={`absolute inset-y-0 left-0 ${
                    isChosen ? 'bg-rdt-gold/30' : 'bg-white/10'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              )}
              <div className="relative flex items-center justify-between px-3 py-2.5">
                <span className="text-sm text-white flex items-center gap-1.5 font-medium">
                  {isChosen && <CheckCircle2 size={14} className="text-rdt-gold" />}
                  {opt.label}
                </span>
                {votedId && (
                  <span className="text-xs font-semibold text-white/70">{pct}%</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-white/30 text-xs mt-3 flex items-center gap-1.5">
        {voting && <Loader2 size={11} className="animate-spin" />}
        {total.toLocaleString('pt-BR')} votos {votedId ? '· obrigado por participar!' : ''}
      </p>
    </div>
  );
}
