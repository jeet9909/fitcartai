export const inr = (n: number) => '₹' + n.toLocaleString('en-IN')
export const pct = (n: number) => `${Math.round(n)}%`
export const off = (mrp: number, price: number) => Math.round(((mrp - price) / mrp) * 100)
export function orderId() {
  return 'FC-' + Math.floor(100000 + Math.random() * 899999)
}
