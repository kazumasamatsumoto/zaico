import {
  Account,
  Address,
  Deadline,
  Mosaic,
  MosaicId,
  PlainMessage,
  RepositoryFactoryHttp,
  TransferTransaction,
  UInt64,
} from "symbol-sdk";
const node: string = process.env.REACT_APP_NODE_URL!;
const pk: string = process.env.REACT_APP_MANAGED_PRIVATE_KEY!;
const ra: string = process.env.REACT_APP_SYOYU_ADDRESS!;
const mosaicId = new MosaicId(process.env.REACT_APP_MOSAIC_ID!);

export const sendMosaic = async () => {
  const repositoryFactory = new RepositoryFactoryHttp(node);
  const epochAdjustment = await repositoryFactory
    .getEpochAdjustment()
    .toPromise();
  const networkType = await repositoryFactory.getNetworkType().toPromise();
  const networkGenerationHash = await repositoryFactory
    .getGenerationHash()
    .toPromise();
  const recipientAddress = Address.createFromRawAddress(ra);

  const transferTransaction = TransferTransaction.create(
    Deadline.create(epochAdjustment),
    recipientAddress,
    [new Mosaic(mosaicId, UInt64.fromUint(1000))],
    PlainMessage.create("This is a test message"),
    networkType,
    UInt64.fromUint(2000000)
  );

  const account = Account.createFromPrivateKey(pk, networkType);
  const signedTransaction = account.sign(
    transferTransaction,
    networkGenerationHash
  );
  console.log("Payload:", signedTransaction.payload);
  console.log("Transaction Hash:", signedTransaction.hash);
  const transactionRepository = repositoryFactory.createTransactionRepository();
  const response = await transactionRepository
    .announce(signedTransaction)
    .toPromise();
  console.log(response);
};

