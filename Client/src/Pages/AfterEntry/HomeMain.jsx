// In App.js in a new project

import { useContext } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { userContext } from '../../context/UserContext';


import { TranslationContext } from '../../styles/Languages/Languages';

import { ThemeContext } from '../../styles/Themes/ThemeContext';

import DrawerComp from  '../../navigators/DrawerComp';



import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
import { getNotificationToken, notificationLister, requestUserPermission } from '../../comp/Notification';

export default function HomeMain() {
  const { userLoggedIn,setUserLoggedIn ,UpdateLoggedInUser} = useContext(userContext);
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new message arrived!', JSON.stringify( remoteMessage.notification.title + ' ' + remoteMessage.notification.body));
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    requestUserPermission();
    notificationLister();
    getNotificationToken(UpdateLoggedInUser);
  
   
  }, [])











  // console.log(userLoggedIn);

  // const { currentLanguage, setLanguage, GetDictByLangAndKey, LanguageWords } = useContext(TranslationContext);
  const wordsKey = 'general';
  // const pageWords = GetDictByLangAndKey(wordsKey);


  const { setTheme, lightTheme, darkTheme } = useContext(ThemeContext);
  const isDarrkMode = useColorScheme() == 'dark'
  useEffect(() => {
    if (isDarrkMode) {
      setTheme(darkTheme)
    }
    else {
      setTheme(lightTheme)
    }

  }, [isDarrkMode])



  return (
    <View style={{ flex: 1 }}>
      <DrawerComp />
    </View >
  );
}


