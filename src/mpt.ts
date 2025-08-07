import prompts from "prompts";

import {
  add,
  clear,
  fill,
  init,
  inspect,
  printProof,
  remove,
} from "./store/index.js";
import { CommandImpl } from "./types.js";

const doMPTActions = async (commandImpl: CommandImpl) => {
  let finished: boolean = false;

  while (!finished) {
    const mptAction = await prompts({
      message: "Pick an action",
      type: "select",
      name: "action",
      choices: [
        {
          title: "init",
          description: "Initialize a new handle database",
          value: async () => {
            commandImpl.mpt = await init(commandImpl.storePath);
          },
          disabled: !!commandImpl.mpt,
        },
        {
          title: "inspect",
          description: "Print out the current database state",
          value: () => inspect(commandImpl.mpt!),
          disabled: !commandImpl.mpt,
        },
        {
          title: "add",
          description: "Add an HAL to the current root",
          value: async () => {
            const { key, value } = await prompts([
              {
                name: "key",
                type: "text",
                message: "The key to insert",
              },
              {
                name: "value",
                type: "text",
                message: "The value to store at this key",
              },
            ]);
            await add(commandImpl.mpt!, key, value, commandImpl.asHex);
          },
          disabled: !commandImpl.mpt,
        },
        {
          title: "remove",
          description: "Remove an HAL from the current root",
          value: async () => {
            const { key } = await prompts({
              name: "key",
              type: "text",
              message: "The key to remove",
            });
            await remove(commandImpl.mpt!, key, commandImpl.asHex);
          },
          disabled: !commandImpl.mpt,
        },
        {
          title: "fill",
          description: "Fill HALs",
          value: async () => {
            const keys = Array.from({ length: 100 }, (_, i) => `hal-${i + 1}`);
            await fill(commandImpl.mpt!, keys, () => {
              console.log("Filling HALs...");
            });
          },
          disabled: !commandImpl.mpt,
        },
        {
          title: "prove",
          description:
            "Prove the existence (or non-existence) of an ADA handle",
          value: async () => {
            const { key, format } = await prompts([
              {
                name: "key",
                type: "text",
                message: "The key to prove",
              },
              {
                name: "format",
                type: "select",
                message: "What format would you like the proof in?",
                choices: [
                  { title: "JSON", value: "json" },
                  { title: "cborHex", value: "cborHex" },
                ],
              },
            ]);
            await printProof(commandImpl.mpt!, key, format, commandImpl.asHex);
          },
          disabled: !commandImpl.mpt,
        },
        {
          title: "clear",
          description: "Clear the local db",
          value: async () => {
            const { confirmed } = await prompts({
              name: "confirmed",
              type: "confirm",
              message: "Are you sure you want to clear the database?",
            });
            if (confirmed) {
              await clear(commandImpl.storePath);
              commandImpl.mpt = null;
            }
          },
          disabled: !commandImpl.mpt,
        },
        {
          title: "back",
          description: "Back to main actions",
          value: () => {
            finished = true;
          },
        },
      ],
    });
    await mptAction.action();
  }
};

export { doMPTActions };
