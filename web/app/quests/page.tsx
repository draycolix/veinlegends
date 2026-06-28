'use client';

import Link from 'next/link';
import QuestsContent from '@/components/QuestsContent';

export default function QuestsPage() {
  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-2">
        <Link href="/" className="text-dark-400 hover:text-dark-200 text-sm">← Home</Link>
        <h1 className="font-display text-3xl font-bold mt-2 mb-2">📜 Quests</h1>
      </div>
      <QuestsContent />
    </div>
  );
}