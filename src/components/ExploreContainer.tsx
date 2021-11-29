import "./ExploreContainer.css";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonRow,
} from "@ionic/react";
import { sendMosaic } from "../util/symbol";
import { revoke } from "../util/revoke";
import { Address, RepositoryFactoryHttp } from "symbol-sdk";
import { useEffect } from "react";
import React from "react";
import { lastValueFrom } from "rxjs";

interface Samples {
  id: number;
  name: string;
  address: string;
  amount: number;
}

const ExploreContainer = () => {
  const [sampleArray, setSampleArray] = React.useState<Samples[]>([]);
  const GetSampleData = async () => {
    const accountInfo = [
      {
        id: 1,
        name: "醤油",
        address: "TBH65JM4C4PZ3Z2QMFOU2JTHTZBMJRVPF6H234A",
        amount: 0,
      },
      {
        id: 2,
        name: "ふりかけ",
        address: "TDOAWCKHLL7COX5IH35HA5FRWXFPAKNTMAAAB2Y",
        amount: 0,
      },
      {
        id: 3,
        name: "梅干し",
        address: "TBYYBKGNJ3N3LWHSD7Y7YWN56MVDT6EUO5SPDGQ",
        amount: 0,
      },
      {
        id: 4,
        name: "チーズ",
        address: "TCRZGRHNDAGH5M76KXU6XSPALHQF34T7ELBW2MQ",
        amount: 0,
      },
      {
        id: 5,
        name: "お茶",
        address: "TA433BKCP2KFJDUUCUJFH23TWPIZ4PYF6Y2EBYA",
        amount: 0,
      },
      {
        id: 6,
        name: "スポーツドリンク",
        address: "TDJ5USR7E4QCR5HTCL6BIVNNQO7ULSXYGS4C2GY",
        amount: 0,
      },
      {
        id: 7,
        name: "目薬",
        address: "TAKMLOHEQ5LPRNLV36SIZ6YFUKYR24FNGSW24ZQ",
        amount: 0,
      },
      {
        id: 8,
        name: "水薬",
        address: "TBIPPXL6PAQ4Z52VDSR4HGR7JZEG2KZH2BWW2XQ",
        amount: 0,
      },
      {
        id: 9,
        name: "アイスノン（頭用）",
        address: "TA3B2UKG77KCJNUH57YKO2DO4LGB3XWLRQCCQZA",
        amount: 0,
      },
      {
        id: 10,
        name: "アイスノン（腋用）",
        address: "TCRRRAJK24HPLP6VXAVL7SWTW3LHAXRU7SKZRFA",
        amount: 0,
      },
      {
        id: 11,
        name: "アイスノン（鼠蹊部用）",
        address: "TBSZHALDSTDZRWE2FWSYGEKAIB23HNDZ32WYQNI",
        amount: 0,
      },
      {
        id: 12,
        name: "かっぱえびせん",
        address: "TBAUA532V3TST4LBLJX6REGPCIU4GN5WR3TA6RY",
        amount: 0,
      },
      {
        id: 13,
        name: "チョコレート",
        address: "TASOPR2D7DB7ENCU5RIL3GQGSJ3KC3GFMJFTLTY",
        amount: 0,
      },
    ];

    for (let i = 0; i < accountInfo.length; i++) {
      const address = Address.createFromRawAddress(accountInfo[i].address);
      const repositoryFactory = new RepositoryFactoryHttp(
        process.env.REACT_APP_NODE_URL!
      );
      const accountHttp = repositoryFactory.createAccountRepository();
      const sample$: any = accountHttp.getAccountInfo(address);
      const sample: any = await lastValueFrom(sample$);
      accountInfo[i].amount = sample.mosaics[0].amount.compact();
    }
    setSampleArray(accountInfo);
  };

  useEffect(() => {
    GetSampleData();
  }, []);

  const revokeFunction = (receive: string) => {
    revoke(receive)
      .then(() => {})
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      <IonGrid>
        <IonRow>
          {sampleArray.map((value, index) => {
            return (
              <IonCol key={index} size="3">
                <IonCard>
                  <IonCardContent>
                    {value.name}:{value.amount}こ
                  </IonCardContent>
                  <IonButton onClick={() => revokeFunction(value.address)}>減らす</IonButton>
                  <IonButton onClick={() => sendMosaic(value.address)}>増やす</IonButton>
                </IonCard>
              </IonCol>
            );
          })}
        </IonRow>
      </IonGrid>
    </>
  );
};

export default ExploreContainer;
