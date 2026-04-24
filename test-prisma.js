import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";
const { Pool } = pkg;

try {
  const adapter = new PrismaPg({ connectionString: "postgres://user:pass@localhost/db" });
  console.log("Success with object");
} catch(e) {
  console.log("Error with object", e.message);
}

try {
  const pool = new Pool({ connectionString: "postgres://user:pass@localhost/db" });
  const adapter2 = new PrismaPg(pool);
  console.log("Success with Pool");
} catch(e) {
  console.log("Error with Pool", e.message);
}
