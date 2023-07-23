import messaging from '@react-native-firebase/messaging';
import { serverKey } from '@env';


export async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus);
    }
}



export const notificationLister = () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
            'Notification caused app to open from background state:',
            remoteMessage.notification,
        );
        navigation.navigate(remoteMessage.data.type);
    });

    // Check whether an initial notification is available\
    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                console.log(
                    'Notification caused app to open from quit state:',
                    remoteMessage.notification,
                );
                // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
            }
        });
}

export const getNotificationToken = async (UpdateLoggedInUser) => {
    console.log("?");

    await messaging().registerDeviceForRemoteMessages();
    const notification_token = await messaging().getToken();
    console.log(notification_token);
    UpdateLoggedInUser({notification_token:notification_token});


}
export const sendNotification = async (token) => {
    const message = {
            to: token,
            notification: {
                title: "Notification Title",
                body: "Notification Body",
            },
            data: {
                score: "850",
                time: "2:45",
            }
    };
    try {
        const response = await fetch(`https://fcm.googleapis.com/fcm/send`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serverKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });

        const responseData = await response.json();
        console.log('Successfully sent message:', responseData);
    } catch (error) {
        console.log('Error sending message:', error);
    }
};