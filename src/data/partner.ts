// Seeded data for the Brand / Partner (B2B) dashboard — the "seller side" of the
// intermediary. Represents a brand viewing FitCart's fit-intelligence + traffic analytics.
export const PARTNER = {
  brand: 'Roadster',
  plan: 'Fit-SDK Pilot',
  kpis: {
    tryOns: 48210,
    handoffs: 12640,
    handoffRate: 26.2,
    returnReduction: 31, // % lower returns on FitCart-assisted purchases
    fitAccuracy: 82,
    revenueAttributed: 18.4, // lakh
  },
  monthlyTryOns: [
    { m: 'Mar', v: 3.1 }, { m: 'Apr', v: 3.8 }, { m: 'May', v: 4.6 },
    { m: 'Jun', v: 5.9 }, { m: 'Jul', v: 7.2 }, { m: 'Aug', v: 8.6 },
  ],
  topProducts: [
    { name: 'Oxford Cotton Slim Shirt', tryOns: 6820, handoffs: 2110, fit: 8.6, trueToSize: 88 },
    { name: 'Textured Bomber Jacket', tryOns: 5240, handoffs: 1490, fit: 8.1, trueToSize: 74 },
    { name: 'Relaxed Tapered Jeans', tryOns: 4980, handoffs: 1180, fit: 7.4, trueToSize: 69 },
    { name: 'Essential Crew Tee', tryOns: 4410, handoffs: 1520, fit: 8.9, trueToSize: 91 },
  ],
  fitInsights: [
    { region: 'Shoulder', signal: 'Runs true to size', tone: 'good' as const },
    { region: 'Sleeve length', signal: 'Runs ~1.5cm long on slim frames', tone: 'warn' as const },
    { region: 'Chest', signal: 'Slim fit — 12% size up', tone: 'warn' as const },
    { region: 'Length', signal: 'Consistent across sizes', tone: 'good' as const },
  ],
  incomingOrders: [
    { id: 'FC-48213', customer: 'A. Sharma', items: 2, value: 3798, status: 'Handoff opened', avatar: 'Athletic' },
    { id: 'FC-48210', customer: 'R. Nair', items: 1, value: 1299, status: 'Purchased', avatar: 'Slim' },
    { id: 'FC-48207', customer: 'M. Iyer', items: 3, value: 5197, status: 'Handoff opened', avatar: 'Curvy' },
    { id: 'FC-48201', customer: 'K. Bose', items: 1, value: 2499, status: 'Purchased', avatar: 'Plus' },
  ],
}
