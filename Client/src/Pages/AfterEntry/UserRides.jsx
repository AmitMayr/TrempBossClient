import { View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, ScrollView, TextInput, ActivityIndicator, Button, Alert } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import React, { useContext, useEffect, useState } from 'react'
import { Text } from 'react-native-paper'

// import BottomTabNavigator from '../../navigators/BottomTabNavigator';
import { rideContext } from '../../context/RidesContext';
import { userContext } from '../../context/UserContext';
import { useNavigation } from '@react-navigation/native';
import SwipeableComp from '../../comp/SwipeableComp';
export default function UserRides(props) {
  const { userLoggedIn, getUserById, isDriver, setIsDriver } = useContext(userContext);
  const [isLoading, setIsLoading] = useState(true); // New state variable
  const [isInAction, setIsInAction] = useState(false); // New state variable

  // const [selectedOption, setSelectedOption] = useState(props.type);
  const selectedOption = props.type;
  const [rides, setRides] = useState([]);
  const [filter, setFilter] = useState('');
  const navigation = useNavigation(); // Access the navigation prop
  const { trempsByFilters, joinRide, userRides, DeleteRide } = useContext(rideContext);

  const getRides = async () => {
    // console.log(userLoggedIn.token);
    // console.log(userLoggedIn.user._id);
    // console.log(selectedOption == 'drives' ? 'driver' : 'hitchhiker');

    setIsLoading(true); // Set isLoading to true before starting the request
    const result = await userRides(userLoggedIn.token, {
      // creator_id: userLoggedIn.user._id,
      // tremp_time: new Date(),
      user_id: userLoggedIn.user._id,
      type_of_tremp: selectedOption == props.PageWords["userRides"] ? 'driver' : 'hitchhiker',
    });
    setRides(result?.data || [])
    console.log("result?.data || []");

    console.log(result?.data || []);
    console.log("result?.data || []");

    if (!result?.status) {
      Alert.alert('Failed to get rides from server')

    }
    else if (result?.data?.length == 0) {
      Alert.alert('No rides found')

    }
    // sortRidesByDate(result)


    setIsLoading(false); // Set isLoading to false after the request completes
  };











  const formatDateTime = (dateTime) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', weekday: 'long' };
    let formattedDate;
    if (props.CurrentLanguage == 'heb') {
      formattedDate = new Date(dateTime).toLocaleString('he-IL', options);

    }
    else {
      formattedDate = new Date(dateTime).toLocaleString('en-IE', options);

    }


    return formattedDate;
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', getRides);

    return unsubscribe;
  }, []);

  const handleFilterChange = (text) => {
    setFilter(text);
  };

  const filterRides = () => {
    if (filter === '') {
      return rides;
    }
    const filteredRides = rides.filter(
      (ride) =>
        ride.from_root.name.toLowerCase().includes(filter.toLowerCase()) ||
        ride.to_root.name.toLowerCase().includes(filter.toLowerCase())
    );

    return filteredRides;
  };

  const handleRightPress = (e) => {


    navigation.navigate('Requests', {
      creator_id: e.creator_id,
      requestId: e._id,
      usersRideRequests: e.users_in_tremp,
      Theme: props.Theme,
      LanguageWords: props.LanguageWords,
      CurrentLanguage: props.CurrentLanguage
      // Add more key-value pairs here for additional JSON objects
      // For example: AnotherJSON: { key1: 'value1', key2: 'value2' }
    });

    // Alert.alert('Right clicked')
  }
  const handleLeftPress = async (e) => {
    if (isInAction) {
      return;
    }
    setIsInAction(true);
    const deleteJson = { tremp_id: e, user_id: userLoggedIn.user._id }
    let result = await DeleteRide(deleteJson, userLoggedIn.token)
    const userMessage = result?.status?result?.message:JSON.stringify(result)
    Alert.alert(userMessage)

    getRides();
    setIsInAction(false);

    // Alert.alert(JSON.stringify(result))
  }


  const rideComps = () => {
    if (rides.length == 0) {
      return;


    }
    const filteredRides = filterRides();

    return filteredRides?.map((ride, index) => (
      // onPress={() => navigation.navigate('rideDetails', { ride: ride, })}
      <SwipeableComp userRides={true} key={index} ride={ride} handleRightPress={handleRightPress} handleLeftPress={handleLeftPress} rightIcon={{ name: "info-circle", background: 'blue' }} leftIcon={{ name: "trash", background: 'red' }} Theme={props.Theme} LanguageWords={props.LanguageWords.general} CurrentLanguage={props.CurrentLanguage} />

      
    ));
  };

  const styles = createStyles(
    props.Theme.colors.primary,
    props.Theme.colors.secondary,
    props.Theme.colors.text,
    props.Theme.colors.background,
    props.LanguageWords.align
  );

  return (
    <View style={styles.container}>
      <ScrollView style={{ marginBottom: 60 }}>
        <TextInput
          placeholderTextColor={props.Theme.colors.input.placeholder}
          style={styles.input}
          placeholder="Search by From Root or To Root"
          onChangeText={handleFilterChange}
        />
        <View style={styles.pickerContainer}>

          <Picker
            dropdownIconColor="gray"
            style={styles.picker}
            selectedValue={selectedOption}
            onValueChange={(val) => { navigation.navigate(val) }}
          >
            <Picker.Item label={props.PageWords["userRides"]} value={props.PageWords["userRides"]} />
            <Picker.Item label={props.PageWords["userTremps"]} value={props.PageWords["userTremps"]} />
          </Picker>
        </View>
        {isLoading ? (
          <ActivityIndicator size="large" color={props.Theme.colors.primary} />
        ) : (
          <View style={styles.cardContainer}>{rideComps()}</View>
        )}
        <View style={{ marginBottom: 50 }} />
      </ScrollView>
    </View>
  );
}

const createStyles = (primary, secondary, text, background, align) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: background,
      textAlign: 'right',
    },
    cardContainer: {
      marginBottom: 10,
      justifyContent: 'center'
    },
    card: {
      width: '80%',
      backgroundColor: secondary,
      borderRadius: 8,
      padding: 10,
      marginBottom: 10,
      elevation: 2,
    },
    text: {
      color: text.primary,
      textAlign: align,
    },
    input: {
      color: text.primary,

      borderWidth: 1,
      borderColor: primary,
      padding: 10,
      marginBottom: 10,
    },
    picker: {
      color: text.primary,
    },
    pickerContainer: {
      borderWidth: 1, borderColor: text.primary,

    }
  });
