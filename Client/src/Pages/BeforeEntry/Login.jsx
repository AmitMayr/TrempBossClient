import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, TextInput, TouchableOpacity, View, Text, Dimensions, I18nManager } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Snackbar, Button } from 'react-native-paper';
import { userContext } from '../../context/UserContext';
// const UserModel = require('../../Server/models/usersModel');
import { TranslationContext } from '../../styles/Languages/Languages';
import { ThemeContext } from '../../styles/Themes/ThemeContext';
import CheckBox from '@react-native-community/checkbox';
import FlexDirectionStyle from '../../comp/FlexDirection';
import Icon from 'react-native-vector-icons/FontAwesome';



const { width } = Dimensions.get('window');
export default function Login(props) {
  const { theme } = useContext(ThemeContext);
  const { primary, secondary, text, background } = theme.colors
  const primaryColorVar = primaryColor(primary, secondary, text.primary);
  const { GetDictByLangAndKey } = useContext(TranslationContext);
  const wordsKey = "login";
  const pageWords = GetDictByLangAndKey(wordsKey);
  const directions = FlexDirectionStyle();
  
  const styles = createStyles(primary, secondary, text, background, directions)

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [maskedPassword, setMaskedPassword] = useState(password)

  const [rememberLogin, setRememberLogin] = useState(true);
  const [showDetails, setShowDetails] = useState("")
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const {loginUser, setIsLoggedIn, users, setUserLoggedInId } = useContext(userContext);

  const [isLoading, setIsLoading] = useState(false)

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };



  const maskedChanged = (value, newChar) => {

    if (value.length < password.length) {
      setPassword(prev => prev.slice(0, -1))
      setMaskedPassword('*'.repeat(password.length - 1))
      return;
    }
    setPassword(prev => prev += newChar)
    setMaskedPassword('*'.repeat(password.length) + "*")
  };
  const maskedEmpty = () => {
    setPassword("")
    setMaskedPassword("")
  };

  const storeData = async (value) => {
    try {
      const jsonAsString = JSON.stringify(value)
      // await  AsyncStorage.removeItem('personObj');
      await AsyncStorage.setItem('personObj', jsonAsString);
    } catch (e) {
    }
  }

  //opt1 – with async-await
  const getData = async () => {
    try {
      const result = await AsyncStorage.getItem('personObj')
      const asJson = JSON.parse(result);//
      if (asJson) {
        setEmail(asJson.email)
        setPassword(asJson.password)
        setMaskedPassword('*'.repeat(asJson.password.length));

      }
    } catch (e) {
      // error reading value
    }
  }

  useEffect(() => {
    //function that runs when navigation to the page.
    const focusListener = props.navigation.addListener('focus', () => {
      getData()
    });
    return () => {
    }
  }, []);






  const signUpAction = async () => {
    if(isLoading){
      return;
    };
     setIsLoading(true)
    // await setUserLoggedInId('64aab369d6886f76d2e48011')
    // await setIsLoggedIn(true);
    // if (Array.isArray(users) && !users.length) { // if the users array not loaded yet and its empty
    //   setShowDetails(pageWords['loadingUsers']);
    //   setSnackbarVisible(true);
    //   return;
    // }

    // Implement sign-up logic here
    // await getData();
    if (email === "" || email === null) {
      setShowDetails(pageWords['enterEmail']);
      setSnackbarVisible(true);
      setIsLoading(false)
      return;
    }
    if (password === null || password === "") {
      setShowDetails(pageWords['enterPassword']);
      setSnackbarVisible(true);
      setIsLoading(false)
      return;
    }
    const result =await loginUser({ user_email: email, password})

    // let isUserMatched = users.find(user => user.user_email === email.toLowerCase() && user.password === password)
    if (!result.status) {
      setShowDetails(result.message + " ");
      setSnackbarVisible(true);
      setIsLoading(false)
      return;
    }

    if (rememberLogin) {
      await storeData({ email, password })
    }
    else {
      await AsyncStorage.removeItem('personObj');
    }
    setIsLoading(false)


  }




  return (
    <View style={styles.container}>

      <Text style={styles.primaryColor} variant="headlineLarge">{pageWords['login']}</Text>



      <TextInput
        placeholder={pageWords['insertMail']}
        style={[styles.input, { width: width * 0.8 }, styles.inputBorder]}
        onChangeText={(value) => { setEmail(value) }}
        value={email}
        keyboardType='email-address'
        autoCapitalize='none'
        placeholderTextColor="gray"
        textAlign={directions.textAlign} 
      />

      <View style={[styles.inputContainer, styles.inputBorder]}>
        <TextInput
          placeholder={pageWords['insertPassword']}
          autoCapitalize="none"
          style={styles.input}
          onChangeText={showPassword ? (value) => { setPassword(value); setMaskedPassword('*'.repeat(value.length)); } :
            (value) => { value ? maskedChanged(value, value[value.length - 1]) : maskedEmpty() }}
          value={showPassword ? password : maskedPassword}
          placeholderTextColor="gray"
          textAlign={directions.textAlign}
        />
        <TouchableOpacity onPress={toggleShowPassword} >
        {/* <Icon name={showPassword ? 'eye-off' : 'eye'} size={30} color={text.primary}/> */}
          <Text style={styles.showPasswordButtonText}>{showPassword ? '✖' : '👁'}</Text>
        </TouchableOpacity>
      </View>








      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <CheckBox
          value={rememberLogin}
          onValueChange={() => setRememberLogin(prev => !prev)}
          style={styles.checkbox}
        />

        <Text style={styles.primaryTextColor}>{pageWords["rememberMe"]}</Text>
      </View>


      <Button

        mode="outlined"
        textColor={primaryColorVar.opposite}
        buttonColor={primaryColorVar.secondary}
        onPress={() => signUpAction()}
        labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
        style={{ marginTop: 10 ,opacity:isLoading? 0.2 : 1 }}

      >
        {pageWords['login']}
      </Button>


      <Button textColor={primaryColorVar.primary}
        onPress={() => {
          props.navigation.navigate('Signup')
        }}>

        {pageWords['ifNotRegistered']}
      </Button>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          onPress: () => {
            // Handle undo action
          },
        }}
        style={{
          backgroundColor: '#ff3d00',
          borderRadius: 8,
          marginHorizontal: 24,
          marginBottom: 24,
        }}
        theme={{
          colors: {
            text: '#fff',
          },
        }}
      >
        {showDetails}
      </Snackbar>

    </View>

  )

}


const primaryColor = (primary, secondary, opposite) => {
  return { primary, secondary, opposite }
}
const createStyles = (primary, secondary, text, background, directionStyle) => StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: background,
  },
  primaryColor: {
    color: primary
  },
  primaryTextColor: {
    color: text.primary
  },
  inputContainer: {
    //אם השפת מכשיר לא מימין לשמאל
    //   אם השפה שנבחרה באפליקציה היא מימין לשמאל
    //       row רגיל
    //   אם השפה הנבחרה באפליקציה היא משמאל לימין 
    //       row הפוך
    //אם השפת מכשיר כן מימין לשמאל
    //   אם השפה שנבחרה באפליקציה היא מימין לשמאל
    //       row הפוך
    //   אם השפה הנבחרה באפליקציה היא משמאל לימין 
    //       row רגיל

    flexDirection: directionStyle.flexDirection,
    width: width * 0.8,
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  inputBorder: {
    borderColor: "gray",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
    backgroundColor: background,
  },
  input: {
    fontSize: 18,
    fontWeight: "bold",
    color: text.primary,
    letterSpacing: 1.2,
    shadowColor: "#000",
    minWidth:width*0.6


  },



  showPasswordButtonText: {
    // color:'green',
    color: text.primary

  },
});


