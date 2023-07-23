import { Swipeable } from 'react-native-gesture-handler';
import { View, Text, TouchableOpacity, Animated, Alert, TouchableWithoutFeedback, StyleSheet } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import FlexDirectionStyle from '../comp/FlexDirection';

export default function SwipeableComp(props) {
  const directions = FlexDirectionStyle();
  console.log("saaaaaaaaaaaaaaaaaaaaaaaa");
  console.log(props?.ride);

  console.log("saaaaaaaaaaaaaaaaaaaaaaaa");

  console.log(directions.isRTL);

  const navigation = useNavigation(); // Access the navigation prop
  const styles = createStyles(
    props.Theme.colors.primary,
    props.Theme.colors.secondary,
    props.Theme.colors.text,
    props.Theme.colors.background,
    props.LanguageWords.align,
    props.leftIcon.background,
    props?.secondLeft?.background,
    props?.rightIcon?.background,
    directions,

  );
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



  const renderLeftActions = (progress, dragX) => {
    // Define the left swipe actions
    const trans = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    return (
      <View style={{ flexDirection: 'row' }}>

        {props?.secondLeft && <TouchableOpacity style={[styles.secondLeftActionsContainer, { backgroundColor: props?.secondLeft?.background }]} onPress={() => props.handleSecondLeftPress()}>
          <Animated.View style={[styles.actionContainer, { transform: [{ scale: trans }] }]}>
            <Icon name={props?.secondLeft?.name} size={35} color={props?.Theme?.colors?.text?.primary || "white"} />
          </Animated.View>
        </TouchableOpacity>}
        <TouchableOpacity style={directions.isRTL ? styles.leftActionsContainer : styles.leftActionsContainerIfNotRTL} onPress={() => props.handleLeftPress(props?.ride?._id)}>
          <Animated.View style={[styles.actionContainer, { transform: [{ scale: trans }] }]}>
            <Icon name={props?.leftIcon?.name} size={35} color={props?.Theme?.colors?.text?.primary || "white"} />
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderRightActions = (progress, dragX, ride) => {
    // Define the right swipe actions
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity style={directions.isRTL ? styles.rightActionsContainer : styles.rightActionsContainerIfNotRTL} onPress={() => props.handleRightPress(ride)}>
        <Animated.View style={[styles.actionContainer, { transform: [{ scale: trans }] }]}>
          <Icon name={props?.rightIcon?.name} size={35} color={props?.Theme?.colors?.text?.primary || "white"} />
          {/* <Text style={styles.actionText}>Info</Text> */}
        </Animated.View>
      </TouchableOpacity>
    );
  };
  console.log(props.ride);
  return (
    <TouchableWithoutFeedback  >

      <Swipeable renderLeftActions={renderLeftActions}
        renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, props.ride)}
      >
        {!props?.hideRideInfo ? <View style={styles.card}>
          {(props.ride?.creator?.first_name || props.ride?.creator?.last_name) && <Text style={styles.text}>{`${props?.LanguageWords?.creatorName}: ` + props.ride?.creator?.first_name + " " + props.ride?.creator?.last_name}</Text>}
          {/* <Text style={styles.text}>Group ID: {ride.group_id}</Text> */}
          {/* <Text style={styles.text}>Tremp Type: {ride.tremp_type}</Text> */}
          {/* <Text style={styles.text}>Create Date: {formatDateTime(ride.create_date)}</Text> */}

          <Text style={styles.text}>{formatDateTime(props.ride?.tremp_time)}</Text>
          <Text style={styles.text}>{props?.LanguageWords?.from}: {props.ride?.from_root?.name}</Text>
          <Text style={styles.text}>{props?.LanguageWords?.to}: {props.ride?.to_root?.name}</Text>
          <Text style={styles.text}>{props?.LanguageWords?.seats}: {props.ride?.seats_amount}</Text>
          {props?.userRides && <Text style={styles.text}>{props?.LanguageWords?.requestsAmount}: {props?.ride?.users_in_tremp?.length || 0}</Text>}
          <Text style={styles.text}>{props?.ride?.approvalStatus}</Text>

          {/* <Text style={styles.text}>Users in Tremp: {JSON.stringify(ride.users_in_tremp)}</Text> */}
          {/* <Text style={styles.text}>Is Full: {ride.is_full ? 'Yes' : 'No'}</Text> */}
        </View> : <View style={[styles.card, 
            props?.userRequest?.is_approved === 'approved'
            ? styles.requestApproved
            : null,
          props?.userRequest?.is_approved === 'denied'
            ? styles.requestDenied
            : null,
          ]}>
          <Text
            style={styles.text}
          >
            {props?.userRequest?.user_id}
          </Text>
          <Text style={styles.text}>{props?.userRequest?.is_approved}</Text>



        </View>
        }
      </Swipeable>
    </TouchableWithoutFeedback>

  )
}




const createStyles = (primary, secondary, text, background, align, leftBG, secondLeftBG, rightBG, directionStyle) =>
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
      alignItems: directionStyle.alignItems,
      borderRadius: 8,
      padding: 15,
      elevation: 1,
      // Change the shadow color (for iOS shadow)

    },
    text: {
      color: text.primary,
      textAlign: align,
    },
    leftActionsContainer: {
      justifyContent: 'center',
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      backgroundColor: leftBG,
      borderWidth: 2,
      borderColor: text.primary



    },
    leftActionsContainerIfNotRTL: {
      justifyContent: 'center',
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
      backgroundColor: leftBG,
      borderWidth: 2,
      borderColor: text.primary



    },
    secondLeftActionsContainer: {
      justifyContent: 'center',
      backgroundColor: secondLeftBG,
      borderWidth: 2,
      borderColor: text.primary
    },
    rightActionsContainer: {
      justifyContent: 'center',
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
      backgroundColor: rightBG,
      borderWidth: 2,
      borderColor: text.primary


    },
    rightActionsContainerIfNotRTL: {
      justifyContent: 'center',
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      backgroundColor: rightBG,
      borderWidth: 2,
      borderColor: text.primary
    },
    swipeActionContainer: {
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    actionText: {
      color: 'white',
    },

    actionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    requestApproved: {
      shadowColor: 'green', 

    },
    requestDenied: {
      shadowColor: 'red', 

    },



  });
