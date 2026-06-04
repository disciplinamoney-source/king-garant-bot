import fs from "node:fs";
import path from "node:path";

const DB_PATH = process.env.JSON_DB_PATH || path.join(process.cwd(), "data", "db.json");
const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({ balances: [], deals: [] }, null, 2));
}

function loadDb(): { balances: any[]; deals: any[] } {
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

function saveDb(data: { balances: any[]; deals: any[] }) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Simple eq helper — returns filter function
export function eq(field: string, value: any) {
  return (row: any) => row[field] === value;
}

// Table symbols
export const balancesTable = Symbol("balances");
export const dealsTable = Symbol("deals");

// Simple query builder
const db = {
  select: () => ({
    from: (table: any) => ({
      where: (filter: any) => {
        const data = loadDb();
        const tableName = table === balancesTable ? "balances" : "deals";
        const rows = data[tableName as keyof typeof data].filter(filter);
        return {
          limit: (n: number) => rows.slice(0, n),
          get: () => rows,
        };
      },
      get: () => {
        const data = loadDb();
        const tableName = table === balancesTable ? "balances" : "deals";
        return data[tableName as keyof typeof data];
      },
    }),
  }),
  insert: (table: any) => ({
    values: (values: any) => {
      const data = loadDb();
      const tableName = table === balancesTable ? "balances" : "deals";
      const rows = Array.isArray(values) ? values : [values];
      const withTimestamps = rows.map((r: any) => ({
        ...r,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      data[tableName as keyof typeof data].push(...withTimestamps);
      saveDb(data);
      return { returning: () => withTimestamps };
    },
  }),
  update: (table: any) => ({
    set: (values: any) => ({
      where: (filter: any) => {
        const data = loadDb();
        const tableName = table === balancesTable ? "balances" : "deals";
        const idx = data[tableName as keyof typeof data].findIndex(filter);
        if (idx !== -1) {
          data[tableName as keyof typeof data][idx] = {
            ...data[tableName as keyof typeof data][idx],
            ...values,
            updatedAt: new Date().toISOString(),
          };
          saveDb(data);
        }
      },
    }),
  }),
};

export { db };

