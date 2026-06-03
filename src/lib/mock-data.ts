// Realistic mock data for AFIOS modules
export type RiskLevel = "critical" | "high" | "medium" | "low" | "safe";
export type TxnStatus = "fraud" | "suspicious" | "review" | "clear";

export interface Transaction {
  id: string;
  ts: string;
  amount: number;
  currency: string;
  customer: string;
  merchant: string;
  mcc: string;
  country: string;
  device: string;
  ip: string;
  risk: number;
  confidence: number;
  status: TxnStatus;
  channel: "card" | "wire" | "ach" | "wallet";
}

const merchants = ["Amazon", "Apple", "Shopify", "Steam", "Booking", "Stripe Sub", "Uber", "AliExpress", "Wise FX", "Coinbase", "Walmart", "Zara", "DoorDash", "Netflix", "Patreon"];
const countries = ["US", "GB", "DE", "FR", "BR", "NG", "RU", "CN", "AE", "SG", "MX", "IN", "ZA", "TR", "VN"];
const channels: Transaction["channel"][] = ["card", "wire", "ach", "wallet"];

function seeded(i: number) { return ((i * 9301 + 49297) % 233280) / 233280; }

export function generateTransactions(n = 80): Transaction[] {
  const out: Transaction[] = [];
  const now = Date.now();
  for (let i = 0; i < n; i++) {
    const r = seeded(i + 1);
    const risk = Math.round(r * 100);
    const status: TxnStatus =
      risk > 88 ? "fraud" : risk > 70 ? "suspicious" : risk > 45 ? "review" : "clear";
    out.push({
      id: `TX-${(900000 + i).toString(36).toUpperCase()}`,
      ts: new Date(now - i * 1000 * (3 + Math.floor(r * 40))).toISOString(),
      amount: Math.round((10 + r * 9800) * 100) / 100,
      currency: ["USD", "EUR", "GBP", "AED"][i % 4],
      customer: `CUS-${10000 + (i * 31) % 90000}`,
      merchant: merchants[(i * 7) % merchants.length],
      mcc: ["5411", "5732", "4814", "6011", "4829", "5812"][i % 6],
      country: countries[(i * 11) % countries.length],
      device: `dev_${(i * 17 % 9999).toString(16)}`,
      ip: `${10 + i % 240}.${(i * 3) % 255}.${(i * 7) % 255}.${(i * 13) % 255}`,
      risk,
      confidence: Math.round(60 + r * 40),
      status,
      channel: channels[i % 4],
    });
  }
  return out;
}

export const kpis = {
  txnVolume: { value: 24_817_402, delta: 4.2 },
  fraudVolume: { value: 18_402, delta: -8.6 },
  fraudRate: { value: 0.074, delta: -0.012 },
  lossPrevented: { value: 12_482_300, delta: 18.4 },
  activeCases: { value: 412, delta: 11 },
  openAlerts: { value: 1_284, delta: -4 },
  analystProd: { value: 87, delta: 2 },
  mttiMinutes: { value: 14.2, delta: -1.8 },
};

export const fraudTrend = Array.from({ length: 30 }, (_, i) => ({
  day: `D-${30 - i}`,
  fraud: Math.round(400 + Math.sin(i / 3) * 120 + (i > 22 ? 180 : 0) + seeded(i) * 80),
  prevented: Math.round(380 + Math.sin(i / 3) * 110 + (i > 22 ? 160 : 0) + seeded(i + 5) * 70),
  forecast: i > 22 ? Math.round(520 + (i - 22) * 18) : undefined,
}));

export const riskDistribution = [
  { name: "Critical", value: 84, color: "var(--risk-critical)" },
  { name: "High", value: 213, color: "var(--risk-high)" },
  { name: "Medium", value: 612, color: "var(--risk-medium)" },
  { name: "Low", value: 1820, color: "var(--risk-low)" },
  { name: "Safe", value: 22088, color: "var(--risk-safe)" },
];

export const emergingThreats = [
  { id: "T-2041", name: "Synthetic ID Ring — LATAM", severity: "critical", delta: 142, region: "BR / MX" },
  { id: "T-2039", name: "Account Takeover via SIM Swap", severity: "high", delta: 64, region: "US East" },
  { id: "T-2037", name: "Card Testing — Mid-tier eCom", severity: "high", delta: 38, region: "Global" },
  { id: "T-2034", name: "First-Party Loan Fraud", severity: "medium", delta: 22, region: "GB / EU" },
  { id: "T-2031", name: "Wallet Drainer Phishing Kit v3", severity: "critical", delta: 88, region: "Global" },
];

export const countryHeat = [
  { c: "US", v: 8420 }, { c: "GB", v: 3120 }, { c: "DE", v: 2104 }, { c: "BR", v: 1880 },
  { c: "NG", v: 1420 }, { c: "IN", v: 1340 }, { c: "MX", v: 990 }, { c: "FR", v: 880 },
  { c: "SG", v: 670 }, { c: "AE", v: 540 }, { c: "RU", v: 510 }, { c: "CN", v: 420 },
];

export const cases = Array.from({ length: 24 }, (_, i) => ({
  id: `CASE-${4400 + i}`,
  title: [
    "High-velocity card testing on tier-1 merchant",
    "Suspected synthetic identity — credit line $40k",
    "ATO sequence: login + payee add + wire",
    "Mule account funnel detected (graph cluster #88)",
    "Refund abuse pattern across 14 accounts",
    "Crypto off-ramp via newly-funded wallet",
  ][i % 6],
  analyst: ["A. Okafor", "M. Schultz", "R. Patel", "C. Nguyen", "S. Ivanova"][i % 5],
  priority: ["critical", "high", "medium"][i % 3] as RiskLevel,
  age: `${(i % 14) + 1}h`,
  status: ["In Review", "Escalated", "Evidence", "Pending Decision"][i % 4],
  exposure: 1000 + i * 4217,
}));

export const models = [
  { name: "FALCON-NEO v4.2", type: "GBM Ensemble", accuracy: 99.2, precision: 94.1, recall: 91.7, f1: 92.9, drift: 0.04, status: "active" },
  { name: "GRAPHSENSE v2.1", type: "GNN", accuracy: 97.8, precision: 89.4, recall: 93.2, f1: 91.3, drift: 0.12, status: "active" },
  { name: "DNA-PROFILER v1.6", type: "Transformer", accuracy: 96.5, precision: 88.0, recall: 90.4, f1: 89.2, drift: 0.21, status: "monitoring" },
  { name: "VELOCITY-X v3.0", type: "Streaming Rules + ML", accuracy: 98.9, precision: 92.7, recall: 88.1, f1: 90.3, drift: 0.07, status: "active" },
  { name: "SYNTHID-DETECT v0.9", type: "Hybrid", accuracy: 94.1, precision: 81.2, recall: 87.4, f1: 84.2, drift: 0.34, status: "shadow" },
];
