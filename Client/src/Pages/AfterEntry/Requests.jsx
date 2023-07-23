

import { View, StyleSheet, TouchableOpacity, ScrollView, Alert, Image, Dimensions } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import { Text, TextInput, Button } from 'react-native-paper';
import { userContext } from '../../context/UserContext';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import SwipeableComp from '../../comp/SwipeableComp';
import { rideContext } from '../../context/RidesContext';

const { width } = Dimensions.get('window');
const imageSize = width * 0.5;

export default function Requests({ route }) {
  const { usersRideRequests, Theme, LanguageWords, CurrentLanguage, requestId, creator_id } = route.params;
  const styles = createStyles(
    Theme.colors.primary,
    Theme.colors.secondary,
    Theme.colors.text,
    Theme.colors.background,

  );
  const { UpdateApproveStatus } = useContext(rideContext);
  const [requests, setRequests] = useState(usersRideRequests);

  useEffect(() => {
    setRequests(usersRideRequests);
  }, [usersRideRequests]);
  console.log("route.params");
  console.log(route.params.usersRideRequests);

  console.log("route.params");
  const { userLoggedIn, UpdateLoggedInUser, UpdateLoggedInUserImage } = useContext(userContext);
  // const [firstName, setFirstName] = useState(userLoggedIn.user.first_name);
  // const [lastName, setLastName] = useState(userLoggedIn.user.last_name);
  // const [phoneNumber, setPhoneNumber] = useState(userLoggedIn.user.phone_number);
  // const [email, setEmail] = useState(userLoggedIn.user.user_email);
  // const [gender, setGender] = useState(userLoggedIn.user.gender);

  const handleRightPress = async (userRequest, index) => {
    const bodyInfo = { tremp_id: requestId, creator_id: creator_id, user_id: userRequest?.user_id, approval: true };
    let result = await UpdateApproveStatus(bodyInfo, userLoggedIn.token);
    if (result.status) {
      setRequests((prevRequests) =>
        prevRequests.map((perUserRequest) =>
          perUserRequest.user_id === userRequest?.user_id ? { ...userRequest, is_approved: "approved" } : perUserRequest
        )
      );
    }
  };

  const handleLeftPress = async (userRequest, index) => {
    const bodyInfo = { tremp_id: requestId, creator_id: creator_id, user_id: userRequest?.user_id, approval: false };
    let result = await UpdateApproveStatus(bodyInfo, userLoggedIn.token);
    if (result.status) {
      setRequests((prevRequests) =>
        prevRequests.map((perUserRequest) =>
        perUserRequest.user_id === userRequest?.user_id ? { ...userRequest, is_approved: "denied" } : perUserRequest
        )
      );
    }
  };

  const renderedRequests = requests?.map((userRequest, index) => (
    <SwipeableComp
      userRequest={userRequest}
      hideRideInfo={true}
      key={index}
      handleRightPress={() => handleRightPress(userRequest, index)}
      handleLeftPress={() => handleLeftPress(userRequest, index)}
      rightIcon={{ name: 'check', background: 'green' }}
      leftIcon={{ name: 'times', background: 'red' }}
      Theme={Theme}
      LanguageWords={LanguageWords.general}
      CurrentLanguage={CurrentLanguage}
    />
  ));
  return (
    <View style={styles.container}>
      <ScrollView style={{ marginBottom: 120 }}>
        {/* <Text style={styles.textColor}>{LanguageWords.profile}</Text> */}
        {renderedRequests}
      </ScrollView>
    </View>
  );
}

const createStyles = (primary, secondary, text, background) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: background,
      padding: 16,
    },
    textColor: {
      color: text.primary,
      textAlign: 'center',
      marginVertical: 8,
    },
    editText: {
      color: primary,
      textAlign: 'center',
      marginVertical: 8,
    },
    input: {
      fontSize: 18,
      fontWeight: 'bold',
      letterSpacing: 1.2,
      shadowColor: '#000',
      marginBottom: 16,
      borderColor: 'gray',
      borderWidth: 2,
      borderRadius: 10,
      paddingHorizontal: 10,
      marginVertical: 10,
      backgroundColor: background,
      color: 'red',
      textColor: 'red',
    },
    image: {
      alignSelf: 'center',
      width: imageSize,
      height: imageSize,
      borderRadius: imageSize / 2,
      borderWidth: 2,
      borderColor: text.primary,
    },
  });
