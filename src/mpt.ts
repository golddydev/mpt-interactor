import prompts from "prompts";

import {
  addHandle,
  clear,
  init,
  inspect,
  printProof,
  removeHandle,
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
          description: "Add an ADA Handle to the current root",
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
            await addHandle(commandImpl.mpt!, key, value);
          },
          disabled: !commandImpl.mpt,
        },
        {
          title: "remove",
          description: "Remove an ada handle from the current root",
          value: async () => {
            const { key } = await prompts({
              name: "key",
              type: "text",
              message: "The key to remove",
            });
            await removeHandle(commandImpl.mpt!, key);
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
            await printProof(commandImpl.mpt!, key, format);
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
