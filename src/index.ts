import prompts from "prompts";

import { doMPTActions } from "./mpt.js";
import { CommandImpl } from "./types.js";

const main = async () => {
  const storePath = "db/";
  const commandImpl = new CommandImpl(storePath);
  await commandImpl.loadMPT();

  while (commandImpl.running) {
    const mainAction = await prompts({
      message: "Pick main action",
      name: "action",
      type: "select",
      choices: [
        {
          title: "mpt",
          description: "MPT actions",
          value: () => doMPTActions(commandImpl),
        },
        {
          title: "exit",
          description: "Exit",
          value: () => {
            commandImpl.running = false;
          },
        },
      ],
    });
    try {
      await mainAction.action();
    } catch (err) {
      console.error(err);
    }
  }
};

main();
