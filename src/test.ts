import { makeConstrData, makeIntData, makeListData } from "@helios-lang/uplc";

type WhitelistedItem = {
  time_gap: number;
  amount: number;
};

const makeWhitelistedItem = (whitelisted_item: WhitelistedItem) => {
  return makeConstrData(0, [
    makeIntData(whitelisted_item.time_gap),
    makeIntData(whitelisted_item.amount),
  ]);
};

const makeWhitelistedValue = (whitelisted_items: WhitelistedItem[]) => {
  return makeListData(whitelisted_items.map(makeWhitelistedItem));
};

const oneHour = 3600000;
const twoHours = 7200000;

console.log(
  Buffer.from(
    makeWhitelistedValue([
    //   { time_gap: twoHours, amount: 2 },
      // { time_gap: oneHour, amount: 4 },
    ]).toCbor()
  ).toString("hex")
);
