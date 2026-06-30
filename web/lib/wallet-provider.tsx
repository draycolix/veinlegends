'use client';

import { useState, useEffect, type ReactNode, type ComponentType } from 'react';

let InnerModule: { default: ComponentType<{ children: ReactNode }> } | null = null;
let loadPromise: Promise<{ default: ComponentType<{ children: ReactNode }> }> | null = null;
let loadFailed = false;

function loadInner() {
  if (InnerModule) return Promise.resolve(InnerModule);
  if (loadFailed) return Promise.reject(new Error('Wallet load failed'));
  if (!loadPromise) {
    loadPromise = import('./wallet-provider-inner')
      .then((mod) => {
        InnerModule = mod;
        return mod;
      })
      .catch((err) => {
        console.warn('Wallet adapter failed to load, running without wallet:', err.message ? err.message : err);
        loadFailed = true;
        loadPromise = null;
        throw err;
      });
  }
  return loadPromise;
}

// Simple passthrough when wallet is unavailable
function Passthrough({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function WalletContextProvider({ children }: { children: ReactNode }) {
  const [Inner, setInner] = useState<ComponentType<{ children: ReactNode }> | null>(
    () => InnerModule?.default ?? (loadFailed ? Passthrough : null)
  );

  useEffect(() => {
    if (!Inner) {
      let cancelled = false;
      loadInner()
        .then((mod) => {
          if (!cancelled) setInner(() => mod.default);
        })
        .catch(() => {
          if (!cancelled) setInner(() => Passthrough);
        });
      return () => { cancelled = true; };
    }
  }, [Inner]);

  if (!Inner) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="animate-pulse text-dark-400 text-lg">Loading VeinLegends...</div>
      </div>
    );
  }

  return <Inner>{children}</Inner>;
}

export function useWalletConnection() {
  if (!InnerModule && !loadFailed) {
    throw new Error('Wallet not loaded yet');
  }
  if (loadFailed || !InnerModule) {
    return { publicKey: null, connected: false, connecting: false, select: () => {}, connect: () => Promise.resolve(), disconnect: () => Promise.resolve() } as any;
  }
  const { useWalletConnection: inner } = require('./wallet-provider-inner');
  return inner();
}
