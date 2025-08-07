import { Store, Trie } from "@aiken-lang/merkle-patricia-forestry";
import fs from "fs/promises";

const init = async (folder: string): Promise<Trie> => {
  const db = new Trie(new Store(folder));
  // @ts-expect-error: Library issue
  await db.save();
  return db;
};

const inspect = async (db: Trie) => {
  // console.log(db.hash?.toString("hex") || Buffer.alloc(32).toString("hex"));
  console.log(db);
  console.log(db.hash?.toString("hex") || Buffer.alloc(32).toString("hex"));
};

const clear = async (folder: string) => {
  await fs.rm(folder, { recursive: true });
};

const fill = async (db: Trie, keys: string[], progress: () => void) => {
  for (const key of keys) {
    await db.insert(key, "");
    progress();
  }
  console.log(db);
};

const add = async (
  db: Trie,
  key: string,
  value: string,
  asHex: boolean = false
) => {
  await db.insert(
    asHex ? Buffer.from(key, "hex") : key,
    asHex ? Buffer.from(value, "hex") : value
  );
  console.log(db);
};

const remove = async (db: Trie, key: string, asHex: boolean = false) => {
  await db.delete(asHex ? Buffer.from(key, "hex") : key);
  console.log(db);
};

const printProof = async (
  db: Trie,
  key: string,
  format: "json" | "cborHex",
  asHex: boolean = false
) => {
  const proof = await db.prove(asHex ? Buffer.from(key, "hex") : key);
  switch (format) {
    case "json":
      console.log(proof.toJSON());
      break;
    case "cborHex":
      console.log(proof.toCBOR().toString("hex"));
      break;
  }
};

export { add, clear, fill, init, inspect, printProof, remove };
