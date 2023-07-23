import Login from './BeforeEntry/Login';
import Sign_up from './BeforeEntry/Signup';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext, useEffect, useState } from 'react';
import { userContext } from '../context/UserContext';
import { useColorScheme } from 'react-native';
import { TranslationContext } from '../styles/Languages/Languages';
import DropDown from '../comp/DropDown';
import { ThemeContext } from '../styles/Themes/ThemeContext';
import HomeMain from './AfterEntry/HomeMain';
import languagesOptions from '../styles/Languages/languageOptions.json'
// import 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

export default function Main() {
  // const {theme,setTheme,lightTheme,darkTheme} = useContext(ThemeContext);
  const wordsKey = "general";
  const { setLanguage, GetDictByLangAndKey } = useContext(TranslationContext);
  const pageWords = GetDictByLangAndKey(wordsKey);
  const [selectedItem, setSelectedItem] = useState(languagesOptions[0])

  const { theme, setTheme, lightTheme, darkTheme } = useContext(ThemeContext);
  const isDarrkMode = useColorScheme() == 'dark'
  useEffect(() => {
    if (isDarrkMode) {
      setTheme(darkTheme)
    }
    else {
      setTheme(lightTheme)
    }

  }, [isDarrkMode])


  // console.log(isDarrkMode + " isDarrkMode");
  const align = pageWords['align']
  const onSelect = (item) => {
    setLanguage(item.value)
    setSelectedItem(item)
  }


  const { isLoggedIn } = useContext(userContext);



  let context = !isLoggedIn ? (
    <SafeAreaProvider >
      <NavigationContainer >
        <Stack.Navigator

          screenOptions={({ route }) => ({
            headerTitle: '',
            headerTransparent: true,
            headerLeft: align === 'left' ? () => (
              <DropDown

                value={selectedItem}
                onSelect={onSelect}
                languagesOptions={languagesOptions}
              />
            ) : undefined,
            headerRight: align === 'right' ? () => (
              <DropDown
                value={selectedItem}
                onSelect={onSelect}
                languagesOptions={languagesOptions}
              />) : undefined,
          })}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Sign_up} />
        </Stack.Navigator>
      </NavigationContainer>

    </SafeAreaProvider>
  ) : (
    <NavigationContainer>
      <HomeMain />
    </NavigationContainer>
  );

  return context;
}
