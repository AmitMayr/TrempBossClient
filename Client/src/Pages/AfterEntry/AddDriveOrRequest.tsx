import { Text, View, StyleSheet, Dimensions, TextStyle, StyleProp, ScrollView, Platform, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Snackbar, TextInput } from 'react-native-paper'

import { rideContext } from '../../context/RidesContext';
import { userContext } from '../../context/UserContext';
import Modal from 'react-native-modal';
import { TranslationContext } from '../../styles/Languages/Languages';
import { InputObject, TextObject } from '../../types/types';
import DateTimePicker from '@react-native-community/datetimepicker';
export default function AddDriveOrRequest(props: any) {
  const { GetDictByLangAndKey } = useContext(TranslationContext);

  // console.log(props);


  const styles = createStyles(props.Theme.colors.primary, props.Theme.colors.secondary, props.Theme.colors.text, props.Theme.colors.background, props.Theme.colors.input, props.GeneralWords.align, props.Theme.colors.btn.background, props.IsHamburgerOpen)
  const [fromLocationCords, setFromLocationCords] = useState(null);
  const [seats_amount, setSeatsAmount] = useState('');
  const [note, setNote] = useState('');

  const [showDetails, setShowDetails] = useState("")
  const [snackbarVisible, setSnackbarVisible] = useState(false);


  const { addRide } = useContext(rideContext);
  const { userLoggedInId, setUserToken, users, userLoggedIn, isDriver } = useContext(userContext);


  const [fromCountryAndCity, setFromCountryAndCity] = useState("");
  const [toCountryAndCity, setToCountryAndCity] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  const [inProgress, setInProgress] = useState(false);


  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [text, setText] = useState(props.PageWords.PickDate);
  const [hour, setHour] = useState(props.PageWords.PickTime);

  const onChange = (event: any, selectedDate: any) => {
    if (event.type != "set") {
      setShowDatePicker(false);
      return;
    }
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    let tempDate = new Date(currentDate);
    let fDate = tempDate.getDate() + "/" + (tempDate.getMonth() + 1) + "/" + tempDate.getFullYear();
    setText(fDate);

  }

  const onTimeChange = (event: any, selectedTime: any) => {
    if (event.type != "set") {
      setShowTimePicker(false);
      return;
    }
    const currentHour = selectedTime || date;

    setShowTimePicker(false);
    setTime(currentHour);
    let tempDate = new Date(currentHour);
    let fTime = tempDate.getHours() + ":" + tempDate.getMinutes();
    setHour(fTime);

  };

  const handleTextChangeFrom = (newText: string) => {
    setFromCountryAndCity(newText);
  };
  const handleTextChangeseats_amount = (newText: string) => {
    setSeatsAmount(newText);
  };

  const handleTextChangeTo = (newText: string) => {
    setToCountryAndCity(newText);
  };
  const handleTextChangeNote = (newText: string) => {
    setNote(newText);
  };
  const handelSubmit = async () => {

    if (inProgress) {
      setShowDetails("באמצע תהליך");
      setSnackbarVisible(true);

      return;
    }

    setInProgress(true);
    if (!seats_amount) {
      setShowDetails("הכנס מספר מקומות פנויים");
      setSnackbarVisible(true);
      setInProgress(false);
      return;
    }
    if (fromCountryAndCity == "" || toCountryAndCity == "") {
      setShowDetails("מוצא או יעד ריקים");
      setSnackbarVisible(true);
      setInProgress(false);

      return;
    }

    // let status: number = -99

    try {
    } catch (error: any) {
      console.error("error " + error.message);
      setInProgress(false);
      return;
    }
    console.log(isDriver);
    const selectedDateTime = new Date(date);
    selectedDateTime.setHours(time.getHours());
    selectedDateTime.setMinutes(time.getMinutes());
    let result = await addRide({ creator_id: userLoggedIn.user._id, group_id: userLoggedIn.user.groups[0] || "64743b14b165e7102c90dd32", tremp_type: !isDriver ? "driver" : 'hitchhiker', tremp_time: selectedDateTime, seats_amount, from_root: { name: fromCountryAndCity, coordinates: { latitude: 32.334455, longitude: 34.855667 } }, to_root: { name: toCountryAndCity, coordinates: { latitude: 33.334455, longitude: 34.855667 } }, note }, userLoggedIn.token)
    if (!result?.status) {
      setShowDetails("Error: " + result?.error?.message);
      setSnackbarVisible(true);
      setInProgress(false);
      return;
    }
    setShowDetails("נסיעה הוספה");
    setSnackbarVisible(true);
    setInProgress(false);

  };
  // console.log("props.PageWords");
  // console.log(props.PageWords.IsDriverTitle);

  // console.log("props.PageWords");

  return (
    <ScrollView style={styles.container}>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}

        style={styles.snackbar}
      >
        {showDetails}
      </Snackbar>
      <View style={{ marginBottom: 125 }}>


        {isDriver ? <Text style={styles?.title}>{props?.PageWords.IsDriverTitle}</Text> :
          <Text style={styles?.title}>{props?.PageWords.IsHitchhikerTitle}</Text>}



        <TextInput
          maxLength={2}
          keyboardType='numeric'
          onChangeText={handleTextChangeseats_amount}
          value={seats_amount}
          style={styles.input}
          textColor={props.Theme.colors.input.text}
          theme={{ colors: { text: 'red' } }}
          placeholder={props.PageWords.seatsAvailable}
          placeholderTextColor={props.Theme.colors.input.placeholder}
        // label='מקומות פנויים'
        />

        <TextInput
          onChangeText={handleTextChangeFrom}
          value={fromCountryAndCity}
          style={styles.input}
          textColor={props.Theme.colors.input.text}
          theme={{ colors: { text: 'red' } }}
          placeholder={props.PageWords.fromCountry}
          placeholderTextColor={props.Theme.colors.input.placeholder}
        />

        <TextInput
          onChangeText={handleTextChangeTo}
          value={toCountryAndCity}
          style={styles.input}
          textColor={props.Theme.colors.input.text}
          placeholder={props.PageWords.toCountry}
          placeholderTextColor={props.Theme.colors.input.placeholder}
        />


        <TextInput
          onChangeText={handleTextChangeNote}
          value={note}
          style={styles.input}
          textColor={props.Theme.colors.input.text}
          theme={{ colors: { text: 'red' } }}
          placeholder={props.PageWords.note}
          placeholderTextColor={props.Theme.colors.input.placeholder}
        />

        <TouchableOpacity
          style={{}}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={{ color: props.Theme.colors.text.primary, textAlign: 'center' }}>{text}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{}}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={{ color: props.Theme.colors.text.primary, textAlign: 'center' }}>{hour}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            is24Hour
            display="default"
            onChange={(event, selectedDate) => onChange(event, selectedDate)}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={time}
            mode="time"
            is24Hour
            display="default"
            onChange={onTimeChange}
          />
        )}


        <Button
          style={styles.submitButton}
          onPress={handelSubmit}
          textColor={props.Theme.colors.text.primary}
        >
          {props.PageWords.addBtnText}
        </Button>








      </View>
    </ScrollView>

  )
}



const createStyles = (
  primary: string,
  secondary: string,
  text: TextObject,
  background: string,
  input: InputObject,
  align: string,
  btnBackGround: string,
  IsHamburgerOpen: boolean,
) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: background,
      opacity: IsHamburgerOpen ? 0.7 : 1,


    },
    textColor: {
      color: text.primary,
    },
    colorPrimary: {
      color: primary
    },
    input: {
      backgroundColor: input.border,
      textAlign: align as TextStyle['textAlign'],
      margin: 4,
    },
    submitButton: {
      backgroundColor: btnBackGround,
      width: Dimensions.get('window').width * 0.7,
      alignSelf: 'center', marginTop: 10
    },
    snackbar: {
      position: 'absolute',
      bottom: 0,
      backgroundColor: 'red',
    },
    title: {
      color: text.primary,
      textAlign: 'center'
    }
  });
};