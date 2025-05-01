"use client";
import { KnownTypeId, Schema } from "@sovereign-sdk/universal-wallet-wasm";
import { useEffect } from "react";
import { useState } from "react";
import schemaObject from "./schema.json";
import { createStandardRollup } from "@sovereign-sdk/web3";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadSchema(schemaObject: any) {
  try {
    return Schema.fromJSON(JSON.stringify(schemaObject));
  } catch (err) {
    throw err;
  }
}

export const App = () => {
  //   const [schema, setSchema] = useState<Schema | null>(null);

  useEffect(() => {
    createStandardRollup({
      url: "https://rollup-testnet.zeta.markets",
      context: {
        defaultTxDetails: {
          max_priority_fee_bips: 0,
          max_fee: "100000000",
          gas_limit: null,
          chain_id: 4321,
        },
      },
    }).then((rollup) => {
      console.log(rollup);
    });
  }, []);

  //   console.log(schema);

  return <div>{null}</div>;
};
