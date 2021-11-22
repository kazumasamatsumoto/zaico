import React, { useState } from "react";
import "./ExploreContainer.css";
import { Address, RepositoryFactoryHttp } from "symbol-sdk";
import { IonButton } from "@ionic/react";

const ExploreContainer = () => {
  const [mosaicArray, setMosaicArray] = useState<any[]>([]);
  var loop = () => {
    const items = [];
    for (let i = 0; i < mosaicArray.length; i++) {
      items.push(
        <li key={mosaicArray[i].id}>
          <p>{mosaicArray[i].id}</p>
          <p>{mosaicArray[i].amount}</p>
        </li>
      );
    }
    return <ul>{items}</ul>;
  };

  const getAccountMosaics = () => {
    const rawAddress = "TAEFXKFB4GJEO7ZSUN2RG4ZB2GIN4WKLGPQHSPQ";
    const address = Address.createFromRawAddress(rawAddress);
    // replace with node endpoint
    const nodeUrl = "http://ngl-dual-101.testnet.symboldev.network:3000";
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
        setMosaicArray(mosaicsArrayList);
      },
      (err) => console.error(err)
    );
  };
  return (
    <>
      <IonButton onClick={getAccountMosaics}>テスト</IonButton>
      {loop()}
    </>
  );
};

export default ExploreContainer;
