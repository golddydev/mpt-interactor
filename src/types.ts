import { Store, Trie } from "@aiken-lang/merkle-patricia-forestry";
import { existsSync } from "fs";

class CommandImpl {
  storePath: string;
  mpt: Trie | null;
  running = true;

  constructor(storePath: string) {
    this.storePath = storePath;
    this.mpt = null;
  }

  async loadMPT() {
    if (existsSync(this.storePath)) {
      this.mpt = await Trie.load(new Store(this.storePath));
      console.log("Database exists, current state: ");
      console.log(this.mpt);
    } else {
      console.log("Database not exists");
    }
  }
}

export { CommandImpl };
