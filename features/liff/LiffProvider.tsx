'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { initLiff, isLiffConfigured } from '@/lib/liff';

interface LiffState {
  /** LIFF 初期化が完了したか（未設定の場合も true 扱いにはしない） */
  ready: boolean;
  /** 初期化エラー（あれば） */
  error: string | null;
}

const LiffContext = createContext<LiffState>({ ready: false, error: null });

/** LIFF の初期化状態を参照するフック。 */
export function useLiff(): LiffState {
  return useContext(LiffContext);
}

/**
 * LIFF を初期化する Provider。
 * LIFF ID 未設定なら何もしない（通常 Web として動作）。
 * 初期化に失敗してもアプリ表示は止めない。
 */
export default function LiffProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<LiffState>({ ready: false, error: null });

  useEffect(() => {
    if (!isLiffConfigured()) return;
    let active = true;
    initLiff()
      .then(() => {
        if (active) setState({ ready: true, error: null });
      })
      .catch((e: unknown) => {
        if (active) {
          setState({
            ready: false,
            error: e instanceof Error ? e.message : 'LIFFの初期化に失敗しました',
          });
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return <LiffContext.Provider value={state}>{children}</LiffContext.Provider>;
}
