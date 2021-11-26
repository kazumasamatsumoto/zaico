import {
  Account,
  AggregateTransaction,
  Deadline,
  MosaicDefinitionTransaction,
  MosaicFlags,
  MosaicId,
  MosaicNonce,
  MosaicSupplyChangeAction,
  MosaicSupplyChangeTransaction,
  RepositoryFactoryHttp,
  TransactionService,
  UInt64,
} from "symbol-sdk";

export async function createMosaic() {
  const node = "https://sym-test-01.opening-line.jp:3001";
  const repoFactory = new RepositoryFactoryHttp(node, {
    websocketUrl: node.replace("http", "ws") + "/ws",
    websocketInjected: WebSocket,
  });
  const pk = process.env.REACT_APP_MANAGED_PRIVATE_KEY!;
  try {
    const networkType = await repoFactory.getNetworkType().toPromise();
    const generationHash = await repoFactory.getGenerationHash().toPromise();
    const epochAdjustment = await repoFactory.getEpochAdjustment().toPromise();

    const account = Account.createFromPrivateKey(pk, networkType);
    console.log(account.address.plain());
    const div = 1;

    const nonce = MosaicNonce.createRandom();
    const mosaicDefinitionTx = MosaicDefinitionTransaction.create(
      Deadline.create(epochAdjustment),
      nonce,
      MosaicId.createFromNonce(nonce, account.address),
      MosaicFlags.create(true, true, false, true),
      div,
      UInt64.fromUint(0),
      networkType
    );

    const supply = 100000000;

    const mosaicSupplyTx = MosaicSupplyChangeTransaction.create(
      Deadline.create(epochAdjustment),
      mosaicDefinitionTx.mosaicId,
      MosaicSupplyChangeAction.Increase,
      UInt64.fromUint(supply * Math.pow(10, div)),
      networkType
    );

    const aggregateTx = AggregateTransaction.createComplete(
      Deadline.create(epochAdjustment),
      [
        mosaicDefinitionTx.toAggregate(account.publicAccount),
        mosaicSupplyTx.toAggregate(account.publicAccount),
      ],
      networkType,
      []
    ).setMaxFeeForAggregate(100, 1);

    const signedTx = account.sign(aggregateTx, generationHash);

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
