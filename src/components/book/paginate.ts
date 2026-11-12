import type { GiftView } from "@/lib/types";

export interface BookSection {
  category: string;
  gifts: GiftView[];
}

export type BookPageSpec =
  | { kind: "intro" }
  | { kind: "gifts"; sections: BookSection[] }
  | { kind: "closing" };

export function paginateGifts(gifts: GiftView[], capacity: number, headerCost = 0.9): BookSection[][] {
  const n = gifts.length;
  if (n === 0) return [];
  const cap = Math.max(3, capacity);

  const catSize = new Map<string, number>();
  for (const g of gifts) catSize.set(g.category, (catSize.get(g.category) ?? 0) + 1);

  const page = (i: number, j: number) => {
    const counts = new Map<string, number>();
    for (let k = i; k < j; k++) counts.set(gifts[k].category, (counts.get(gifts[k].category) ?? 0) + 1);
    let cost = j - i + headerCost * counts.size;
    let penalty = 0;
    for (const [cat, c] of counts) {
      if (c < (catSize.get(cat) ?? 0)) penalty += c === 1 ? 4 : 0.8; // categoria dividida (item órfão pesa mais)
    }
    return { cost, penalty };
  };

  const best: number[] = Array(n + 1).fill(Infinity);
  const from: number[] = Array(n + 1).fill(0);
  best[0] = 0;
  for (let j = 1; j <= n; j++) {
    for (let i = j - 1; i >= 0; i--) {
      const { cost, penalty } = page(i, j);
      if (cost > cap + 1e-6) {
        if (i === j - 1) {
          if (best[i] + 1000 + cost * cost < best[j]) {
            best[j] = best[i] + 1000 + cost * cost;
            from[j] = i;
          }
        }
        break;
      }
      const total = best[i] + 1000 + (cap - cost) ** 2 + penalty;
      if (total < best[j]) {
        best[j] = total;
        from[j] = i;
      }
    }
  }

  const ranges: [number, number][] = [];
  for (let j = n; j > 0; j = from[j]) ranges.unshift([from[j], j]);
  return ranges.map(([i, j]) => {
    const sections: BookSection[] = [];
    for (let k = i; k < j; k++) {
      const last = sections[sections.length - 1];
      if (last && last.category === gifts[k].category) last.gifts.push(gifts[k]);
      else sections.push({ category: gifts[k].category, gifts: [gifts[k]] });
    }
    return sections;
  });
}

export function buildBookPages(gifts: GiftView[], capacity: number, headerCost: number): BookPageSpec[] {
  return [
    { kind: "intro" },
    ...paginateGifts(gifts, capacity, headerCost).map((sections) => ({ kind: "gifts" as const, sections })),
    { kind: "closing" },
  ];
}
