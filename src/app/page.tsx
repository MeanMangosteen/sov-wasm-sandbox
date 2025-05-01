import { createStandardRollup } from "@sovereign-sdk/web3";
import styles from "./page.module.css";
// import { Asset } from "@bulletxyz/bullet-sdk";

export const dynamic = "force-dynamic";

export default function Home() {
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
  });

  // console.log(Asset);

  return (
    <div className={styles.page}>
      <h1>Hello World</h1>
    </div>
  );
}
