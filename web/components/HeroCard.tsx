'use client';

import { motion } from 'framer-motion';
import type { Character } from '@/lib/characters';
import { BLOODLINES, RARITY_CONFIG } from '@/lib/characters';

interface HeroCardProps {
  character: Character;
  size?: 'sm' | 'lg';
  selected?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  onClick?: () => void;
}

export default function HeroCard({
  character,
  size = 'sm',
  selected = false,
  disabled = false,
  disabledReason,
  onClick,
}: HeroCardProps) {
  const bl = BLOODLINES[character.bloodline];
  const rc = RARITY_CONFIG[character.rarity];

  // Tier-exclusive effects
  const tierEffects: Record<string, string> = {
    Legendary: 'ring-1 ring-yellow-500/50 before:absolute before:inset-0 before:rounded-2xl before:animate-pulse before:shadow-[inset_0_0_30px_rgba(250,204,21,0.15)]',
    Epic: 'ring-1 ring-purple-500/30',
    Rare: 'ring-1 ring-blue-500/20',
    Common: '',
  };
  const tierEffect = tierEffects[character.rarity] || '';
  const isLarge = size === 'lg';

  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={!disabled ? onClick : undefined}
      className={`
        relative overflow-hidden rounded-2xl transition-all cursor-pointer
        ${tierEffect}
        ${selected ? 'ring-2 ring-yellow-400 shadow-xl shadow-yellow-400/30' : ''}
        ${disabled ? 'opacity-40 cursor-not-allowed grayscale' : 'hover:shadow-lg'}
        ${isLarge ? 'p-6' : 'p-2.5'}
        bg-dark-800 border border-dark-700
      `}
    >
      {/* Rarity glow */}
      <div
        className={`absolute inset-0 opacity-20 ${rc.glow}`}
        style={{
          background: `radial-gradient(circle at 30% 20%, ${getRarityColor(character.rarity)}20, transparent 70%)`,
        }}
      />

      {/* Character Art SVG */}
      <div className={`relative flex justify-center ${isLarge ? 'mb-4' : 'mb-2'}`}>
        <div className={`flex items-center justify-center rounded-xl overflow-hidden bg-dark-900/80 border border-dark-600 ${isLarge ? 'w-full h-64' : 'w-full h-28'}`}>
          <img
            src={`/characters/${character.bloodline.toLowerCase()}.svg`}
            alt={character.bloodline}
            className={`object-contain ${isLarge ? 'w-full h-full scale-110' : 'w-full h-full scale-100'}`}
          />
        </div>
      </div>

      {/* Header — Bloodline icon + Name + Rarity badge */}
      <div className={`relative flex items-center gap-2 ${isLarge ? 'mb-3' : 'mb-1.5'}`}>
        <span className={isLarge ? 'text-2xl' : 'text-lg'}>{bl.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className={`font-display font-bold truncate ${isLarge ? 'text-lg' : 'text-xs'}`}>
              {character.name}
            </h3>
            {character.generation > 0 && (
              <span className="text-[10px] text-dark-500 bg-dark-700 px-1.5 py-0.5 rounded">
                Gen {character.generation}
              </span>
            )}
          </div>
          {character.title && (
            <p className={`text-dark-400 truncate ${isLarge ? 'text-sm' : 'text-xs'}`}>
              {character.title}
            </p>
          )}
        </div>
        <span className={`text-xs px-1.5 py-0.5 rounded-full font-mono ${rc.textColor} bg-dark-900/80 ${isLarge ? '' : 'text-[10px] px-1'}`}>
          {rc.label}
        </span>
      </div>

      {/* Stats bars */}
      <div className="relative space-y-1 mb-2">
        {(['mining', 'battle', 'hp'] as const).map((stat) => (
          <div key={stat} className="flex items-center gap-1.5">
            <span className={`text-right uppercase ${isLarge ? 'text-[10px] w-10' : 'text-[8px] w-7'} text-dark-500`}>
              {stat === 'hp' ? 'HP' : stat}
            </span>
            <div className={`flex-1 bg-dark-700 rounded-full overflow-hidden ${isLarge ? 'h-1.5' : 'h-1'}`}>
              <div
                className={`h-full rounded-full transition-all ${
                  stat === 'mining'
                    ? 'bg-yellow-500'
                    : stat === 'battle'
                    ? 'bg-red-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${(character.stats[stat] / 10) * 100}%` }}
              />
            </div>
            <span className={`text-right font-mono ${isLarge ? 'text-[10px] w-4' : 'text-[8px] w-3'} text-dark-300`}>
              {character.stats[stat]}
            </span>
          </div>
        ))}
      </div>

      {/* Lore — only in large mode */}
      {isLarge && character.appearance && (
        <div className="relative space-y-3 text-xs">
          <div className="bg-dark-900/50 rounded-lg p-3">
            <p className="text-dark-500 font-bold mb-1">👁 Appearance</p>
            <p className="text-dark-300 leading-relaxed">{character.appearance}</p>
          </div>
          {character.backstory && (
            <div className="bg-dark-900/50 rounded-lg p-3">
              <p className="text-dark-500 font-bold mb-1">📜 Backstory</p>
              <p className="text-dark-300 leading-relaxed">{character.backstory}</p>
            </div>
          )}
          {character.personality && (
            <div className="bg-dark-900/50 rounded-lg p-3">
              <p className="text-dark-500 font-bold mb-1">🧠 Personality</p>
              <p className="text-dark-300 leading-relaxed">{character.personality}</p>
            </div>
          )}
          {character.signature && (
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-3 border border-yellow-500/20">
              <p className="text-yellow-400 font-bold mb-1">⚡ Signature Ability</p>
              <p className="text-dark-200 leading-relaxed">{character.signature}</p>
            </div>
          )}
        </div>
      )}

      {/* Breed count */}
      {character.breedCount > 0 && (
        <div className="relative mt-3 pt-2 border-t border-dark-700">
          <p className="text-[10px] text-dark-500">
            Bred: {character.breedCount}×
          </p>
        </div>
      )}

      {/* Disabled overlay */}
      {disabled && disabledReason && (
        <div className="absolute inset-0 flex items-center justify-center bg-dark-900/60">
          <span className="text-xs text-red-400 font-bold bg-dark-800 px-3 py-1 rounded-full">
            {disabledReason}
          </span>
        </div>
      )}
    </motion.div>
  );
}

function getRarityColor(rarity: string): string {
  switch (rarity) {
    case 'Legendary': return '#facc15';
    case 'Epic': return '#a855f7';
    case 'Rare': return '#3b82f6';
    default: return '#6b7280';
  }
}
