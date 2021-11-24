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

export const sendMosaic = async (
  sendPrivateKey: string,
  receivedAddress: string,
  nodeUrl: string
) => {
  const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
  const epochAdjustment = await repositoryFactory
    .getEpochAdjustment()
    .toPromise();
  const networkType = await repositoryFactory.getNetworkType().toPromise();
  const networkGenerationHash = await repositoryFactory
    .getGenerationHash()
    .toPromise();
  const recipientAddress = Address.createFromRawAddress(receivedAddress);

  const transferTransaction = TransferTransaction.create(
    Deadline.create(epochAdjustment),
    recipientAddress,
    [
      new Mosaic(new MosaicId("097F10A736FA356E"), UInt64.fromUint(1000)),
      new Mosaic(new MosaicId("40CBB70FB472A7FE"), UInt64.fromUint(1000)),
      new Mosaic(new MosaicId("4C46E3191DD07D23"), UInt64.fromUint(1000)),
    ],
    PlainMessage.create("This is a test message"),
    networkType,
    UInt64.fromUint(2000000)
  );

  const account = Account.createFromPrivateKey(sendPrivateKey, networkType);
  const signedTransaction = account.sign(
    transferTransaction,
    networkGenerationHash
  );
  console.log("Payload:", signedTransaction.payload);
  console.log("Transaction Hash:", signedTransaction.hash);
  const transactionRepository =
    repositoryFactory.createTransactionRepository();
  const response = await transactionRepository
    .announce(signedTransaction)
    .toPromise();
  console.log(response);
};

export const getAccountMosaics = (managedAddress: string, nodeUrl: string) => {
  const address = Address.createFromRawAddress(managedAddress);
  const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
  const accountHttp = repositoryFactory.createAccountRepository();
  const divisibility = 6;
  const mosaicsArrayList: any[] = [];

  accountHttp.getAccountInfo(address).subscribe(
    (accountInfo) => {
      console.log(accountInfo);
      for (let i = 0; i < accountInfo.mosaics.length; i++) {
        const mosaics = { id: "", amount: 0 };
        mosaics.id = accountInfo.mosaics[i].id.toHex();
        if (mosaics.id === "091F837E059AE13C") {
          mosaics.amount =
            accountInfo.mosaics[i].amount.compact() /
            Math.pow(10, divisibility);
        } else {
          mosaics.amount =
            accountInfo.mosaics[i].amount.compact() / Math.pow(10, 1);
        }
        mosaicsArrayList.push(mosaics);
      }
      console.log(mosaicsArrayList);
    },
    (err) => console.error(err)
  );
};
