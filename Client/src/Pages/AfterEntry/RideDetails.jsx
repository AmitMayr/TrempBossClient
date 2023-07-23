import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { ThemeContext } from '../../styles/Themes/ThemeContext';
import { userContext } from '../../context/UserContext';
import FlexDirectionStyle from '../../comp/FlexDirection';
import { TranslationContext } from '../../styles/Languages/Languages';

export default function RideDetails({ route }) {
    const { userLoggedIn, getUserById, isDriver, setIsDriver } = useContext(userContext);
    const { currentLanguage, setLanguage, GetDictByLangAndKey, LanguageWords } = useContext(TranslationContext);

    const { theme } = useContext(ThemeContext);
    const styles = createStyles(theme.colors,FlexDirectionStyle());
    console.log(FlexDirectionStyle());
    const generalWords = LanguageWords().general
    const [usersInTremp, setUsersInTremp] = useState('')
    const { ride } = route.params;
    useEffect(() => {
        getUsersInTremp();



    }, [])
    const formatDateTime = (dateTime) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric', weekday: 'long' };
        let formattedDate;
        if(currentLanguage=='heb'){
           formattedDate = new Date(dateTime).toLocaleString('he-IL', options);
      
        }
        else{
          formattedDate = new Date(dateTime).toLocaleString('en-IE', options);
      
        }
        return formattedDate;
    }

    const getUsersInTremp = async () => {
        setUsersInTremp( [])

        if (!ride.users_in_tremp)
            return []
        let array = []
        for (let i = 0; i < ride.users_in_tremp.length; i++) {
            const element = ride.users_in_tremp[i];
            const userInfo = await getUserById(element.user_id);
            array.push(userInfo)

        }


        setUsersInTremp((prev) => [...prev, ...array]);
    }
    let content = ''
    if (usersInTremp) {
        content = usersInTremp.map((user,index) => {
            console.log(index);

            console.log(user);
            return (
                <Text style={styles.text} key={index}>{user?.first_name || "none"}</Text>
            )
        })
    }


    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                {/* <Card.Title title="Ride Details" /> */}
                <Card.Content>
                    <Image source={{ uri: ride?.creator?.photo_URL||"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}} style={styles.image} />
                    {/* <Text style={styles.text}>Creator: {ride.creator_id}</Text> */}
                    <Text style={styles.text}>{generalWords?.trempType}: {ride?.tremp_type}</Text>
                    <Text style={styles.text}>{generalWords?.createdDate}: {formatDateTime(ride.create_date)}</Text>
                    <Text style={styles.text}>{generalWords?.rideTime}: {formatDateTime(ride.tremp_time)}</Text>
                    <Text style={styles.text}>{generalWords?.from}: {ride?.from_root?.name}</Text>
                    <Text style={styles.text}>{generalWords?.to}: {ride?.to_root?.name}</Text>
                    <Text style={styles.text}>{generalWords?.note}: {ride?.note}</Text>
                    <Text style={styles.text}>{generalWords?.seats}: {ride?.seats_amount}</Text>
                    <Text style={styles.text}>Is Full: {ride?.is_full ? 'Yes' : 'No'}</Text>
                    {usersInTremp && content}
                </Card.Content>
            </Card>
        </View>
    );
}

const createStyles = (colors,directions) =>
    StyleSheet.create({
        container: {
            flex: 1,
            padding: 16,
            backgroundColor: colors.background,
        },
        card: {
            marginBottom: 16,
            backgroundColor: colors.secondary,
        },
        text: {
            textAlign:directions.textAlign,
            color: colors.text.primary,
            marginVertical: 8,
        },
        image: {
            width: 200,
            height: 200,
            borderRadius: 100,
            alignSelf:'center'
        },
    });
