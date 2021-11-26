import "./ExploreContainer.css";
import { IonButton } from "@ionic/react";
import { sendMosaic } from "../util/symbol";
import { revoke } from "../util/revoke";
import { Address, RepositoryFactoryHttp } from "symbol-sdk";
import { useState } from "react";

const ExploreContainer = () => {
  const [mosaicAmount, setMosaicAmount] = useState(0);
  const accountInfo = [{
    name: "醤油", address: process.env.REACT_APP_SYOYU_ADDRESS
  }]
  const revokeFunction = () => {
    revoke()
      .then(() => {})
      .catch((err) => {
        console.error(err);
      });
  };

  const getAccountMosaics = () => {
    const address = Address.createFromRawAddress(
      process.env.REACT_APP_SYOYU_ADDRESS!
    );
    const repositoryFactory = new RepositoryFactoryHttp(
      process.env.REACT_APP_NODE_URL!
    );
    const accountHttp = repositoryFactory.createAccountRepository();

    accountHttp.getAccountInfo(address).subscribe(
      (accountInfo) => {
        setMosaicAmount(accountInfo.mosaics[0].amount.compact());
      },
      (err) => console.error(err)
    );
  };

  return (
    <>
      <IonButton onClick={() => revokeFunction()}>取り戻す</IonButton>
      <IonButton onClick={() => sendMosaic()}>送信テスト</IonButton>
      <IonButton onClick={() => getAccountMosaics()}>
        アカウント情報取得
      </IonButton>
      {accountInfo[0].name}:{mosaicAmount / 10}
    </>
  );
};

export default ExploreContainer;
