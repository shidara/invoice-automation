/** 金額を日本円表記にフォーマットする（例: 1200 -> ￥1,200）。 */
export function formatJPY(amount: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  }).format(amount);
}
