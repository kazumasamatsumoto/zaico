import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import Description from '../components/Description';
import './Tab3.css';

const Tab3: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 3</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 3</IonTitle>
          </IonToolbar>
        </IonHeader>
        <Description />
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
