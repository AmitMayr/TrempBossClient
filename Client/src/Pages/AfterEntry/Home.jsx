import { View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, ScrollView, TextInput, ActivityIndicator, Button, Animated, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Text } from 'react-native-paper'
// import BottomTabNavigator from '../../navigators/BottomTabNavigator';
import { rideContext } from '../../context/RidesContext';
import { userContext } from '../../context/UserContext';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Swipeable } from 'react-native-gesture-handler';
import SwipeableComp from '../../comp/SwipeableComp';
import FlexDirectionStyle from '../../comp/FlexDirection';

export default function Home(props) {
  const flexDirection = FlexDirectionStyle();

  const { userLoggedIn, getUserById, isDriver, setIsDriver } = useContext(userContext);
  const [isLoading, setIsLoading] = useState(true); // New state variable
  const [rides, setRides] = useState([]);
  const [filter, setFilter] = useState('');
  const navigation = useNavigation(); // Access the navigation prop
  const { trempsByFilters, joinRide } = useContext(rideContext);

  useEffect(() => {
    getRides()
  }, [isDriver])










  const getRides = async () => {
    // console.log(JSON.stringify(new Date()));
    setIsLoading(true); // Set isLoading to true before starting the request
    const result = await trempsByFilters(userLoggedIn.token, {
      creator_id: userLoggedIn.user._id,
      tremp_time: new Date(),
      type_of_tremp: isDriver ? 'hitchhiker' : 'driver',
    });
    // console.log(JSON.stringify(new Date()));
    console.log("result");

    console.log(result);
    if (typeof result === 'number') {
      setRides([]);
    } else {
      setRides(result.data)
      // sortRidesByDate(result)

    }
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
    return formattedDate
  }

  useEffect(() => {
    getRides();
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
  const sendJoinRequest = (tremp_id, user_id) => {
    try {
      joinRide(tremp_id, user_id, userLoggedIn.token)
      getRides();
    } catch (error) {
      console.log("Error sending join request");
    }
  }

  const handleRequestJoin = (tremp_id) => {
    Alert.alert(
      'Join ride',
      'Are you sure you want to request to join the ride?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            try {
              sendJoinRequest(tremp_id, userLoggedIn.user._id)
            } catch (error) {
              console.log('error sending join request ', error);

            }
            console.log('Request sent!');
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleInfo = (ride) => {
    // console.log(ride);
    navigation.navigate('rideDetails', { ride: ride })
  };


  const rideComps = () => {
    const filteredRides = filterRides();
    return filteredRides.map((ride, index) => (
      <SwipeableComp key={index} ride={ride} handleRightPress={handleInfo} handleLeftPress={handleRequestJoin} rightIcon={{ name: "info-circle", background: 'blue' }} leftIcon={{ name: "plus-circle", background: 'green' }} Theme={props.Theme} LanguageWords={props.LanguageWords.general} CurrentLanguage={props.CurrentLanguage} />

    ));
  };

  const styles = createStyles(
    props.Theme.colors.primary,
    props.Theme.colors.secondary,
    props.Theme.colors.text,
    props.Theme.colors.background,
    props.LanguageWords.align,
    flexDirection
  );
  console.log(props?.LanguageWords.addRide.rideRequests);
  return (
    <View style={styles.container}>
      <ScrollView style={{ marginBottom: 60 }}>
        <View>

          {isDriver ? <Text style={styles?.title}>{props?.LanguageWords?.addRide?.rideRequests}</Text> :
            <Text style={styles?.title}>{props?.LanguageWords.addRide.rideOffers}</Text>
          }
        </View>
        <View style={{ flexDirection: flexDirection.flexDirection, alignItems: 'center' }}>

          <View style={{ flex: 3 }}>
            <TextInput
              placeholderTextColor={props.Theme.colors.input.placeholder}
              style={styles.input}
              placeholder={props?.GeneralWords?.searchPlaceholder}
              onChangeText={handleFilterChange}
            />
          </View>

          <View style={{ flex: 1, alignItems: 'center' }}>
            <TouchableOpacity onPress={getRides}>
              <Icon name="refresh" size={30} color={props.Theme.colors.text.secondary} />
            </TouchableOpacity>
          </View>

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



const createStyles = (primary, secondary, text, background, align,flexDirection) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: background,
      textAlign: 'right',
    },
    cardContainer: {
      display: 'flex',
      gap: 30,
      margin: 10,
    },
    card: {
      alignItems: 'center',
      borderRadius: 8,
      padding: 10,
      elevation: 1,
    },
    text: {
      color: text.primary,
      textAlign: align,
    },
    input: {
      borderWidth: 1,
      borderColor: primary,
      padding: 10,
    },
    title: {
      color: text.primary,
      textAlign: 'center'
    }


  });
