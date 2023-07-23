
import { createDrawerNavigator, DrawerToggleButton } from '@react-navigation/drawer';
import { useContext, useEffect, useState } from 'react';

import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity, View, Switch, TouchableWithoutFeedback } from 'react-native';

import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Home from '../Pages/AfterEntry/Home';
import { userContext } from '../context/UserContext';
import { Button } from 'react-native-paper';
import AddDriveOrRequest from '../Pages/AfterEntry/AddDriveOrRequest';
import { TranslationContext } from '../styles/Languages/Languages';
import { ThemeContext } from '../styles/Themes/ThemeContext';
import Profile from '../Pages/AfterEntry/Profile';
import Settings from '../Pages/AfterEntry/Settings';
import ImageComp from '../comp/ImageComp';
import { useColorScheme } from 'react-native';
import FlexDirectionStyle from '../comp/FlexDirection';
import RideDetails from '../Pages/AfterEntry/RideDetails';

import Icon from 'react-native-vector-icons/FontAwesome';
import UserRides from '../Pages/AfterEntry/UserRides';
import Requests from '../Pages/AfterEntry/Requests';
const Drawer = createDrawerNavigator();













function hasObjectWithKey(arr, key) {
  return arr.some(obj => obj.hasOwnProperty(key));
}


export default function DrawerComp(props) {

  const navigation = useNavigation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  useEffect(() => {
    navigation.addListener('state', () => {
      try {
        if (!navigation.getState()) {
          return;
        }
        const isOpen = hasObjectWithKey(navigation.getState()?.history, 'status');
        if (isOpen) {

          setIsDrawerOpen(true);
          return;

        }
        setIsDrawerOpen(false)

      } catch (error) {
        setIsDrawerOpen(false)

      }

      // isOpen ? isOpen.open ? setIsDrawerOpen(true) : setIsDrawerOpen(false);

    });
  }, [navigation]);

  const flexDirection = FlexDirectionStyle();
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false)

  const isDarrkMode = useColorScheme() == 'dark'


  const { currentLanguage, setLanguage, GetDictByLangAndKey, LanguageWords } = useContext(TranslationContext);
  const { theme } = useContext(ThemeContext);
  const languageWords = LanguageWords();
  const { setIsLoggedIn, userLoggedInId, isDriver, setIsDriver } = useContext(userContext);




  const styles = createStyles(theme.colors.primary, theme.colors.secondary, theme.colors.text, theme.colors.background, theme.colors.twist, isDarrkMode, flexDirection, isDrawerOpen)
  const wordsKey = 'drawer';
  const pageWords = GetDictByLangAndKey(wordsKey);
  const generalWords = GetDictByLangAndKey('general');
  const [currentScreen, setCurrentScreen] = useState('Home')


  const handleOutsideClick = () => {
    setIsHamburgerOpen(false)
  }
  let HamburgerOptions = [
    { text: pageWords['profile'], link: pageWords['profile'] },
    { text: generalWords['logout'], link: generalWords['logout'] },


    // { text: "Home", link: "Home" },

    // { text: "test2", link: "test2" },
    // { id: 2, text: "AddDrive", link: "AddDrive" },


  ];



  const toggleSwitch = () => setIsDriver(previousState => !previousState);
  // const isHomeScreen = currentScreen == generalWords['home'];
  // const isAddRideScreen = currentScreen == generalWords['addRide'];

  // const updateCurrentScreen = () => {


  //   setCurrentScreen(navigation?.getCurrentRoute()?.params?.page || '')
  // }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}  >
        {/* Overlay */}
        <View style={styles.overlay} >

          <View style={{ flex: 1, alignItems: "center" }}>
            <DrawerToggleButton tintColor={isDarrkMode ? "white" : "black"} />
          </View>


          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignSelf: 'center', position: 'absolute', top: -30, }}>

              <Text style={{ color: theme.colors.text.primary }}>{generalWords['hitchhiker']}</Text>

              <TouchableWithoutFeedback onPress={toggleSwitch}>
                <Switch
                  style={{}}
                  trackColor={{ false: '#ff775a', true: '#44a4a1' }}
                  thumbColor={isDriver ? 'red' : '#81b0ff'}
                  ios_backgroundColor="#3e3e3e"
                  value={isDriver}
                />
              </TouchableWithoutFeedback>
              <Text style={{ color: theme.colors.text.primary }}>{generalWords['driver']}</Text>

            </View>


            <TouchableOpacity

              style={styles.iconContainer}
              onPress={() => { navigation.navigate(generalWords['addRide']); setCurrentScreen('Add Ride') }}
            >
              {/* <ImageComp
                source={isDarrkMode ? require('../asserts/images/pluswhite.png') : require('../asserts/images/plusblack.png')}
                isCurrentScreen={isAddRideScreen}
                isPlusbtn={true}
                isDriver={isDriver}
                onPress={() => { navigation.navigate(generalWords['addRide']); setCurrentScreen(generalWords['addRide']) }}
                activeScreenColor={theme.colors.activeScreen}

              /> */}
              <Icon name="plus" size={30} color={currentScreen == "Add Ride" ? theme.colors.text.primary : "#6e6d69"}
              // onPress={() => { navigation.navigate(generalWords['addRide']); setCurrentScreen(generalWords['addRide']) }}
              />

              <Text style={{ color: currentScreen == "Add Ride" ? theme.colors.text.primary : "gray" }}>{isDriver ? generalWords['addRide'] : generalWords['addTremp']} </Text>

            </TouchableOpacity>

          </View>

          <View style={{ flex: 1 }}>

            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => { navigation.navigate(generalWords['home']); setCurrentScreen("Home") }}
            >
              {/* <ImageComp
                source={isDarrkMode ? require('../asserts/images/homewhite.png') : require('../asserts/images/homeblack.png')}
                isCurrentScreen={isHomeScreen}
                activeScreenColor={theme.colors.activeScreen}

              /> */}

              <Icon name="home" size={30} color={currentScreen == "Home" ? theme.colors.text.primary : "#6e6d69"} />


              <Text style={{ color: currentScreen == "Home" ? theme.colors.text.primary : "gray" }}>{generalWords['home']}</Text>
            </TouchableOpacity>
          </View>

        </View>
        <View style={styles.drawerContainer}>

          <Drawer.Navigator
            // drawerContent={(props) => <CustomDrawerContent {...props}  setIsDrawerOpen={setIsDrawerOpen}/>}
            screenOptions={{

              drawerInactiveTintColor: isDarrkMode ? 'gray' : 'black',
              drawerActiveTintColor: isDarrkMode ? 'white' : 'black',
              // drawerActiveBackgroundColor:isDarrkMode?'black':'white',
              drawerPosition: flexDirection.isLangaugeRTL ? 'right' : 'left',
              drawerStyle:
                styles.drawerStyles,


              headerTintColor: theme.colors.text.secondary,
              headerStyle: {
                backgroundColor: theme.colors.twist,
              },
              headerTitleAlign: "center",
              headerTitle: generalWords['title'],
              headerLeft: () => (

                <Text style={styles.topButtons}
                >{generalWords['coins'] || "coins"}</Text>

              ),
              headerRight: () => (
                <View style={styles.hamburgerContainer} >
                  <TouchableOpacity onPress={() => { setIsHamburgerOpen(prev => !prev); }}
                    style={styles.topButtons}
                  >
                    <View style={styles.circle}>
                      <Icon name="user" size={30} color={theme.colors.text.secondary} />
                    </View>
                  </TouchableOpacity>
                  {isHamburgerOpen && (<View style={styles.hamburgerOptions} >

                    {HamburgerOptions.map((val, i) => {
                      return (
                        <TouchableOpacity style={styles.eachOption} onPress={(e) => { setIsHamburgerOpen(false); setCurrentScreen(''); if (val.text == generalWords['logout']) { setIsLoggedIn(false); return }; navigation.navigate(val.link) }} key={String(i)}>
                          <Text style={styles.eachOptionText}>{val.text}</Text>
                        </TouchableOpacity>

                      )
                    })}
                  </View>)}
                </View>
              ),


            }}
          >







            <Drawer.Screen name={generalWords['home']} initialParams={{ page: 'home' }}
              options={{
              }}
            >
              {() => <Home CurrentLanguage={currentLanguage} Theme={theme} LanguageWords={languageWords} GeneralWords={generalWords} onPress={handleOutsideClick} />}
            </Drawer.Screen>

            <Drawer.Screen name={generalWords['settings']}>
              {() => <Settings Theme={theme} GeneralWords={generalWords} PageWords={languageWords.settings} />}
            </Drawer.Screen>
            <Drawer.Screen name={pageWords['userRides']} initialParams={{ page: 'userRides' }}
              options={{
              }}
            >
              {() => <UserRides PageWords={pageWords} type={pageWords['userRides']} CurrentLanguage={currentLanguage} Theme={theme} LanguageWords={languageWords} GeneralWords={generalWords} />}
            </Drawer.Screen>

            {/* zzzz */}
            <Drawer.Screen name={pageWords['userTremps']} initialParams={{ page: 'userTremps' }}
              options={{
              }}
            >
              {() => <UserRides PageWords={pageWords} type={pageWords['userTremps']} CurrentLanguage={currentLanguage} Theme={theme} LanguageWords={languageWords} GeneralWords={generalWords} />}
            </Drawer.Screen>
            {/* zzzz */}



            <Drawer.Screen name={generalWords['addRide'] || 'addRide'}
              options={{ drawerItemStyle: { height: 0 } }} initialParams={{ page: 'addRide' }}
            >
              {() => <AddDriveOrRequest Theme={theme} GeneralWords={generalWords} PageWords={languageWords.addRide} IsHamburgerOpen={isHamburgerOpen} />}
            </Drawer.Screen>

            <Drawer.Screen name={pageWords['profile']} initialParams={{ page: 'profile' }}
              options={{ drawerItemStyle: { height: 0 } }}
            >
              {() => <Profile Theme={theme} LanguageWords={generalWords} IsHamburgerOpen={isHamburgerOpen} />}
            </Drawer.Screen>


            <Drawer.Screen name={'rideDetails'}
              options={{ drawerItemStyle: { height: 0 } }}
              component={RideDetails}

            >
            </Drawer.Screen>

            <Drawer.Screen name={'Requests'}
              options={{ drawerItemStyle: { height: 0 } }}
              component={Requests}

            >
            </Drawer.Screen>


            {/* <Drawer.Screen name={"2222222"}
              options={{ drawerItemStyle: { height: 0 } }} initialParams={{ page: '22' }}
            >
              {() => <AddDriveOrRequest Theme={theme} GeneralWords={generalWords} generalWords={languageWords.addRide} IsHamburgerOpen={isHamburgerOpen} onValueChange={()=>{console.log(navigation?.getCurrentRoute()?.params?.page || 'sss')}} />}
            </Drawer.Screen>
 */}






            {/* < Drawer.Screen name={'rideDetails'}
              options={{ drawerItemStyle: { height: 0 } }}
            >
              {() => <RideDetails />}
            </Drawer.Screen> */}



          </Drawer.Navigator>
        </View>
      </View >
    </SafeAreaProvider >

  );
}



const createStyles = (primary, secondary, text, background, twist, darkMode, directionStyle, isDrawerOpen) => StyleSheet.create({

  overlay: {
    backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.3)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: directionStyle.flexDirection,
    // justifyContent: 'space-around',
    height: 60,
    alignItems: 'center',
    zIndex: isDrawerOpen ? -1 : 3,


  },
  iconContainer: {
    alignItems: 'center',

  },
  drawerContainer: {
    flex: 1,

  },

  topButtons: {
    marginHorizontal: 20,
    color: text.primary,
  }



  ,
  hamburgerContainer: {
    alignItems: 'center',




  },
  hamburgerOptions: {
    gap: 2,
    position: 'absolute',
    top: 45,
    backgroundColor: 'rgba(255, 255, 255, 1)'




  },
  hamburgerBtn: {

  },
  eachOption: {
    borderColor: 'rgba(0, 0, 0, 0.3)'
    , borderWidth: 1,
    padding: 10,
    paddingVertical: 15,
    backgroundColor: twist,

  },

  drawerButton: {
    margin: 0, // Set margin to 0
    padding: 0, // Set padding to 0
    // Additional style properties as needed
  },
  eachOptionText: {
    alignSelf: 'center', overflow: 'scroll', color: text.primary,
  },
  activeScreen: {
    // tintColor: 'green'
  },
  drawerStyles: {
    backgroundColor: twist,

  },
  circle: {
    width: 40, // Adjust the width and height to your preference
    height: 40,
    borderRadius: 9000,
    borderWidth: 2,
    borderColor: text.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});