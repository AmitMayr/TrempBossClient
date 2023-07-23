
import Main from './src/Pages/Main';
import { RidesContextProvider } from './src/context/RidesContext';
import { UserContextProvider } from './src/context/UserContext';
import { TranslationProvider } from './src/styles/Languages/Languages';
import ThemeContextProvider from './src/styles/Themes/ThemeContext';
// import messaging from '@react-native-firebase/messaging';
// import { Alert } from 'react-native';
import React, { useEffect } from 'react';
// import { getNotificationToken, notificationLister, requestUserPermission } from './src/common';
export default function App() {
  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  //   });
  //   return unsubscribe;
  // }, []);

  // useEffect(() => {
  //   requestUserPermission();
  //   notificationLister();
  //   getNotificationToken();
  
   
  // }, [])
  
  return (
    <UserContextProvider>
      <RidesContextProvider>
        <TranslationProvider>
          <ThemeContextProvider>
            <Main />
          </ThemeContextProvider>
        </TranslationProvider>
      </RidesContextProvider>
    </UserContextProvider>
  );
}
