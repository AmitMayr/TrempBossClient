import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'

export default function ImageComp(props: any) {


    const styles = createStyles(props.border, props.isPlusbtn, props.isDriver, props.isCurrentScreen, props.activeScreenColor)

    return (
        <View style={[props.border ? styles.container : [], props.isPlusbtn ? styles.plus : []]}
            onStartShouldSetResponder={props.onPress}

        >
            <Image
                style={[styles.img, props.isCurrentScreen ? styles.imgActive : null]}

                source={props.source}
            />
        </View>

    )
}

const createStyles = (isWithBorder: boolean, isPlus: boolean, isDriver: boolean, isCurrentScreen: boolean, activeScreenColor: string) => StyleSheet.create({
    container: {
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 999999,
        padding: 4, // Add padding to create a gap
    },
    img: {
        maxHeight: 25, aspectRatio: '1/1', alignSelf: 'center'
    },
    imgActive: isCurrentScreen ? {
        tintColor: activeScreenColor || 'gray',
    } : {},
    border: {
        // borderColor: 'white', borderWidth: 2, borderRadius: 15
    },

    plus: isPlus ? {
        position: 'absolute',
        top: -80,
        left: 0,
        right: 0,
        bottom: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        borderTopEndRadius: 90000000000,
        borderTopStartRadius: 90000000000,

        borderTopWidth: 5,
        borderLeftWidth: 5,
        borderRightWidth: 5,

        borderRightColor: isDriver ? 'red' : 'black',

        borderLeftColor: !isDriver ? '#81b0ff' : 'black',



    } : {},
});

