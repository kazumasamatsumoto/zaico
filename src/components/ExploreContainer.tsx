import "./ExploreContainer.css";
import { IonButton } from "@ionic/react";
import { getAccountMosaics, sendMosaic } from "../util/symbol";

const ExploreContainer = () => {
  const managedPrivateKey = process.env.REACT_APP_MANAGED_PRIVATE_KEY;
  const zaicoPrivateKey = process.env.REACT_APP_ZAICO_PRIVATE_KEY;
  const managedAddress = process.env.REACT_APP_MANAGED_ADDRESS;
  const zaicoAddress = process.env.REACT_APP_ZAICO_ADDRESS;
  const nodeUrl = process.env.REACT_APP_NODE_URL;

  return (
    <>
      <IonButton onClick={() => getAccountMosaics(zaicoAddress!, nodeUrl!)}>
        冷蔵庫テスト
      </IonButton>
      <IonButton
        onClick={() => sendMosaic(managedPrivateKey!, zaicoAddress!, nodeUrl!)}
      >
        在庫側トランザクションテスト
      </IonButton>
      <IonButton
        onClick={() => sendMosaic(zaicoPrivateKey!, managedAddress!, nodeUrl!)}
      >
        冷蔵庫側トランザクションテスト
      </IonButton>
    </>
  );
};

export default ExploreContainer;
