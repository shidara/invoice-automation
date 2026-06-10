/**
 * LIFF（LINE内起動）のランタイムヘルパ。React 非依存。
 *
 * - 静的プリレンダ時に window へ触れないよう、@line/liff は動的 import する。
 * - NEXT_PUBLIC_LIFF_ID 未設定なら何もしない（通常 Web として動作させる）。
 */

type LiffSdk = Awaited<typeof import('@line/liff')>['default'];

const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID;

let liffRef: LiffSdk | null = null;
let initPromise: Promise<void> | null = null;

/** LIFF ID が設定されているか（＝LINE内起動対応が有効か） */
export function isLiffConfigured(): boolean {
  return Boolean(LIFF_ID);
}

/**
 * LIFF を初期化する（多重初期化はしない）。
 * 未設定なら no-op。失敗は呼び出し側に伝播させる。
 */
export function initLiff(): Promise<void> {
  if (!LIFF_ID) return Promise.resolve();
  if (initPromise) return initPromise;
  initPromise = import('@line/liff').then(async ({ default: liff }) => {
    await liff.init({ liffId: LIFF_ID });
    liffRef = liff;
  });
  return initPromise;
}

/** LINE アプリ内（LIFF クライアント）で動作しているか。未初期化なら false。 */
export function isInLineClient(): boolean {
  if (!liffRef) return false;
  try {
    return liffRef.isInClient();
  } catch {
    return false;
  }
}
