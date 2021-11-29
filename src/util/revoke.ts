import {
  Account,
  Address,
  Deadline,
  Mosaic,
  MosaicId,
  MosaicSupplyRevocationTransaction,
  RepositoryFactoryHttp,
  TransactionService,
  UInt64,
} from "symbol-sdk";

export async function revoke(revisedAddress: string) {
  const node: string = process.env.REACT_APP_NODE_URL!;
  const repoFactory = new RepositoryFactoryHttp(node!, {
    websocketUrl: node.replace("http", "ws") + "/ws",
    websocketInjected: WebSocket,
  });
  const pk = process.env.REACT_APP_MANAGED_PRIVATE_KEY!;
  try {
    const networkType = await repoFactory.getNetworkType().toPromise();
    const generationHash = await repoFactory.getGenerationHash().toPromise();
    const epochAdjustment = await repoFactory.getEpochAdjustment().toPromise();

    const account = Account.createFromPrivateKey(pk, networkType);

    const mosaicId = new MosaicId(process.env.REACT_APP_MOSAIC_ID!);
    const tx = MosaicSupplyRevocationTransaction.create(
      Deadline.create(epochAdjustment),
      Address.createFromRawAddress(revisedAddress),
      new Mosaic(mosaicId, UInt64.fromUint(1)),
      networkType
    ).setMaxFee(1000);

    const signedTx = account.sign(tx, generationHash);

    const transactionRepo = repoFactory.createTransactionRepository();
    const receiptRepo = repoFactory.createReceiptRepository();
    const listener = repoFactory.createListener();

    const transactionService = new TransactionService(
      transactionRepo,
      receiptRepo
    );
    listener.open().then(() => {
      transactionService.announce(signedTx, listener).subscribe(
        (x) => {
          console.log(x);
          listener.close();
        },
        (err) => {
          console.error(err);
          listener.close();
        }
      );
    });
  } catch (err) {
    throw err;
  }
}