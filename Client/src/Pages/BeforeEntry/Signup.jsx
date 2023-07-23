import React, { useContext, useState } from 'react'
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Snackbar, Button, Text } from 'react-native-paper';
import { userContext } from '../../context/UserContext';
import { TranslationContext } from '../../styles/Languages/Languages';
// import { Formik } from 'formik';
// import * as Yup from 'yup';
import { ThemeContext } from '../../styles/Themes/ThemeContext';

export default function Sign_up(props) {
  const { theme } = useContext(ThemeContext);
  const { primary, secondary, text, background } = theme.colors
  const styles = createStyles(primary, secondary, text, background)
  const primaryColorVar = primaryColor(primary, secondary, text.primary);
  const { GetDictByLangAndKey } = useContext(TranslationContext);
  const wordsKey = 'login';
  const pageWords = GetDictByLangAndKey(wordsKey);
  const generalWords = GetDictByLangAndKey('general');
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [maskedPassword, setMaskedPassword] = useState(password)

  const [confirmPassword, setConfirmPassword] = useState("")
  const [maskedConfirmPassword, setMaskedConfirmPassword] = useState(confirmPassword)

  const [errorMessage, setErrorMessage] = useState("")
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const { InsertOne } = useContext(userContext);
  const [showPassword, setShowPassword] = useState(false)
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


  const maskedConfirmChanged = async (value, newChar) => {
    if (value.length < confirmPassword.length) {
      setConfirmPassword(prev => prev.slice(0, -1))
      setMaskedConfirmPassword('*'.repeat(confirmPassword.length - 1))

      return;
    }
    setConfirmPassword(prev => prev += newChar)
    setMaskedConfirmPassword('*'.repeat(confirmPassword.length) + "*")
  };
  const maskedConfirmEmpty = () => {
    setConfirmPassword("")
    setMaskedConfirmPassword("")
  };


  const signUpAction = async () => {
    // Implement sign-up logic here


    if (email === "" || password === "" || confirmPassword === "") {
      await setErrorMessage("אנא מלא את כל הפרטים")
      await setSnackbarVisible(true);
      return;
    }
    if (password !== confirmPassword) {
      await setErrorMessage("אימות סיסמא לא תואם")
      await setSnackbarVisible(true);
      return;
    }
    try {//upload to database
      const result = await AsyncStorage.getItem('personObj')
      const asJson = JSON.parse(result);
      let insertResult = await InsertOne({ user_email: email, password })
      console.log(insertResult);
      if (!insertResult?.status) {
        await setErrorMessage(insertResult?.error?.message)
        await setSnackbarVisible(true);
        return;
      }
      props.navigation.navigate('Login')
    }
    catch {

    }

  }





  return (

    <View style={styles.container}>
      <Text style={styles.primaryColor} variant="headlineLarge">{pageWords['register']}</Text>

      <TextInput
        placeholder={pageWords['insertMail']}
        style={styles.input}
        onChangeText={(value) => { setEmail(value) }}
        value={email}
        placeholderTextColor="gray"
        textAlign={generalWords['align']}

      />

      {showPassword && <View>
        <TextInput
          placeholder={pageWords['insertPassword']}
          autoCapitalize="none"
          style={showPassword ? styles.input : styles.hideInput}
          onChangeText={(value) => { setPassword(value); setMaskedPassword('*'.repeat(value.length)); }}
          value={password}

          placeholderTextColor="gray"
          // secureTextEntry={!showPassword}
          textAlign={generalWords['align']}
        />
        <TextInput
          placeholder={pageWords['confirmPass']}

          style={styles.input}
          onChangeText={(value) => { setConfirmPassword(value); setMaskedConfirmPassword('*'.repeat(value.length)); }}
          value={confirmPassword}
          placeholderTextColor="gray"
          textAlign={generalWords['align']}

        />
      </View>}
      {!showPassword && <View>
        <TextInput
          placeholder={pageWords['insertPassword']}
          autoCapitalize="none"
          style={styles.hideInput}
          onChangeText={(value) => { value ? maskedChanged(value, value[value.length - 1]) : maskedEmpty() }}
          value={maskedPassword}

          placeholderTextColor="gray"
          // secureTextEntry={!showPassword}
          textAlign={generalWords['align']}
        />
        <TextInput
          placeholder={pageWords['confirmPass']}

          style={styles.input}
          onChangeText={(value) => { value ? maskedConfirmChanged(value, value[value.length - 1]) : maskedConfirmEmpty() }}
          value={maskedConfirmPassword}
          placeholderTextColor="gray"
          textAlign={generalWords['align']}

        />
      </View>
      }





      <TouchableOpacity onPress={toggleShowPassword} >
        <Text style={styles.showPasswordButtonText}
        >{showPassword ? pageWords['hidePassword'] : pageWords['showPassword'] }</Text>
      </TouchableOpacity>



      <Button
        mode="outlined"
        textColor={primaryColorVar.opposite}
        buttonColor={primaryColorVar.secondary}
        onPress={() => signUpAction()}
        labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
        style={{ marginTop: 10 }}
      >
        {pageWords['register']}

      </Button>


      <Button textColor={primaryColorVar.primary} onPress={() => {
        props.navigation.navigate('Login')
      }}>

        {pageWords['ifRegistered']}
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
          backgroundColor: 'red',
          borderRadius: 20,
        }}
      >
        {errorMessage}
      </Snackbar>

    </View >

  )
}
const primaryColor = (primary, secondary, opposite) => {
  return { primary, secondary, opposite }
}
const createStyles = (primary, secondary, text, background) => StyleSheet.create({
  container: {
    flex: 1,
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

  input: {

    width: 300,
    borderColor: "gray",
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    backgroundColor: background,
    fontSize: 18,
    fontWeight: "bold",
    color: text.primary,
    letterSpacing: 1.2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  hideInput: {
    color: text.primary,
    width: 300,
    borderColor: "gray",
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    backgroundColor: background,
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1.2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  showPasswordButton: {
    textAlign: 'right'

  },
  showPasswordButtonLeft: {
    textAlign: 'left'


  },
  showPasswordButtonText: {
    color: text.primary
  },
});
