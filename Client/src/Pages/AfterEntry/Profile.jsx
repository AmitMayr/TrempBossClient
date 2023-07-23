import { View, StyleSheet, TouchableOpacity, ScrollView, Alert, Image, Dimensions } from 'react-native';
import React, { useContext, useState } from 'react';
import { Text, TextInput, Button } from 'react-native-paper';
import { userContext } from '../../context/UserContext';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

const { width } = Dimensions.get('window');
const imageSize = width * 0.5;

export default function Profile(props) {
  const { userLoggedIn, UpdateLoggedInUser, UpdateLoggedInUserImage } = useContext(userContext);
  const [firstName, setFirstName] = useState(userLoggedIn.user.first_name);
  const [lastName, setLastName] = useState(userLoggedIn.user.last_name);
  const [phoneNumber, setPhoneNumber] = useState(userLoggedIn.user.phone_number);
  const [email, setEmail] = useState(userLoggedIn.user.user_email);
  const [gender, setGender] = useState(userLoggedIn.user.gender);
  const [image, setImage] = useState(null);

  const styles = createStyles(
    props.Theme.colors.primary,
    props.Theme.colors.secondary,
    props.Theme.colors.text,
    props.Theme.colors.background,
    props.IsHamburgerOpen
  );

  const UpdateUser = async () => {
    let updateInfoJson = {};

    if (firstName !== userLoggedIn.user.first_name) {
      updateInfoJson.first_name = firstName;
    }

    if (lastName !== userLoggedIn.user.last_name) {
      updateInfoJson.last_name = lastName;
    }

    if (phoneNumber !== userLoggedIn.user.phone_number) {
      updateInfoJson.phone_number = phoneNumber;
    }

    if (email !== userLoggedIn.user.user_email) {
      updateInfoJson.user_email = email;
    }

    if (gender !== userLoggedIn.user.gender) {
      updateInfoJson.gender = gender;
    }

    if (Object.keys(updateInfoJson).length === 0 && !image) {
      Alert.alert("Message", "Nothing changed");
      return;
    }

    await UpdateLoggedInUser(updateInfoJson);
    Alert.alert("Message", "Changed successfully");

    // console.log(image);

    return;

    const formData = new FormData();
    await formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg', // Adjust the file type if needed
      name: 'image.jpg', // Adjust the file name if needed
    });

  };

  const handleImagePress = () => {
    Alert.alert(
      'Select Image Source',
      'Choose the image source',
      [
        {
          text: 'Camera',
          onPress: () => launchCamera({ mediaType: 'photo' }, handleImageResponse),
        },
        {
          text: 'Gallery',
          onPress: () => launchImageLibrary({ mediaType: 'photo' }, handleImageResponse),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };








  const handleImageResponse = async (response) => {
    if (!response.didCancel && !response.error) {
      // const imageUri = response.assets[0].uri;
      // const formData = new FormData();
      setImage(response)
      // Append the image file to the FormData object
      // await formData.append('image', {
      //   uri: imageUri,
      //   type: 'image/jpeg', // Adjust the file type if needed
      //   name: 'image.jpg', // Adjust the file name if needed
      // });
      // if(response?.assets[0]){
      //   console.log(response);
      //   await UpdateLoggedInUserImage({photo_URL:response.assets[0].uri});
      // }

      // console.log(JSON.stringify(formData));
      // await UpdateLoggedInUser(updateInfoJson);

    }
  };


  return (
    <View style={styles.container}>
      <ScrollView style={{ marginBottom: 120 }}>
        <Text style={styles.textColor}>{props.LanguageWords.profile}</Text>
        <TouchableOpacity onPress={handleImagePress}>
          {userLoggedIn?.user?.photo_URL ? <Image
            source={{ uri: userLoggedIn?.user?.photo_URL }}
            style={styles.image}
            resizeMode="cover"
          /> :
            <Button>+</Button>
          }
        </TouchableOpacity>
        <View>
          <TextInput
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
            textColor={props.Theme.colors.text.primary}
          />
          <TextInput
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
            textColor={props.Theme.colors.text.primary}
          />
          <TextInput
            label="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={styles.input}
            textColor={props.Theme.colors.text.primary}
          />
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            textColor={props.Theme.colors.text.primary}
          />
          <TextInput
            label="Gender"
            value={gender}
            onChangeText={setGender}
            style={styles.input}
            textColor={props.Theme.colors.text.primary}
          />
          <Button mode="contained" onPress={UpdateUser}>
            Save
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (primary, secondary, text, background, IsHamburgerOpen) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: background,
      opacity: IsHamburgerOpen ? 0.7 : 1,
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
