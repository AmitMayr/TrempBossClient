import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React, { useState, useContext } from 'react'
import { TranslationContext } from '../styles/Languages/Languages';
import ImageComp from './ImageComp';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface language {
    id: number,
    value: string,
    name: String,

}


export default function DropDown({
    currentLanguage = useContext(TranslationContext).currentLanguage,
    isDarrkMode = useColorScheme() == 'dark',
    languagesOptions = [
        {
            "id": 0,
            "value": "",
            "name": ""
        }
    ],
    onSelect = (val: language) => { }
}) {
    const [showOptions, setShowOptions] = useState(false)
    const onSelectedItem = (val: language) => {
        setShowOptions(false);
        onSelect(val)
        AsyncStorage.setItem('language', val.value);


    }

    return (
        <View style={styles.container}>

            <TouchableOpacity

                onPress={() => setShowOptions(prev => !prev)}>
                <ImageComp
                    source={isDarrkMode ? require('../asserts/images/earthwhite.png') : require('../asserts/images/earthblack.png')}

                />
            </TouchableOpacity>
            {showOptions && (<View style={{ justifyContent: 'center' }} >

                {languagesOptions.map((val: language, i: number) => {
                    const selectedValue = val.value;

                    return (
                        <TouchableOpacity style={styles.eachOption} onPress={() => onSelectedItem(val)} key={String(i)} >
                            {selectedValue == currentLanguage ? <Text style={{ alignSelf: 'center', color: 'green' }}>{val.name}</Text>
                                : <Text style={{ alignSelf: 'center' }}>{val.name}</Text>
                            }
                        </TouchableOpacity>
                    )
                })}
            </View>)}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        alignItems: 'center', minHeight: 80,
        width: 80,
        marginTop:15

    },
    // earth: {
    //      height: 25, width: 25,
    // },
    eachOption: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        marginBottom: 5

    },

});