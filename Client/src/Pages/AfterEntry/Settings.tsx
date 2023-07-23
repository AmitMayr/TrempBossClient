import { View, StyleSheet, TextStyle, useColorScheme, TouchableOpacity, Modal } from 'react-native'
import React, { useState, useContext } from 'react';
import { Text } from 'react-native-paper'
import { InputObject, TextObject } from '../../types/types'
import DropDown from '../../comp/DropDown';
import { TranslationContext } from '../../styles/Languages/Languages';
import languagesOptions from '../../styles/Languages/languageOptions.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import FlexDirectionStyle from '../../comp/FlexDirection';


interface language {
    id: number,
    value: string,
    name: String,

}

export default function Settings(props: any) {
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const directions = FlexDirectionStyle();
    const alignItems:string = directions.alignItems;
    const { setLanguage, currentLanguage } = useContext(TranslationContext);
    const onSelect = (item: any) => {
        setLanguage(item.value)
        AsyncStorage.setItem('language', item.value);


    }

    const styles = createStyles(props.Theme.colors.primary, props.Theme.colors.secondary, props.Theme.colors.text, props.Theme.colors.background, props.Theme.colors.input, props.GeneralWords.align, isDialogVisible)


    const onSelectedItem = (val: language) => {
        setIsDialogVisible(false);
        onSelect(val)
        // AsyncStorage.setItem('language', val.value);


    }
    return (
        <View style={styles.container}>
            {/* 1{props.LanguageWords.greeting} */}
            <Text style={styles.title}>{props?.PageWords?.title||"settings"}</Text>
            <View style={styles.language}>
                <TouchableOpacity style={{ flex: 1, alignItems:  alignItems || "flex-end", borderWidth: 1 }}
                    onPress={() => setIsDialogVisible(true)}
                >

                    <Text style={styles.title}>{props.GeneralWords.CurrentLanguage || "Language"}</Text>
                </TouchableOpacity>
                {/* <DropDown
                    onSelect={onSelect}
                    languagesOptions={languagesOptions} /> */}

            </View>
            <Modal
                visible={isDialogVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsDialogVisible(false)}
            >
                <View style={styles.modalContainer}>
                    {/* Content of the dialog */}
                    {/* You can add any components and styles you need for the dialog */}
                    <View style={styles.modalInner}>

                        <Text style={{ color: props.Theme.colors.text.secondary, textAlign: props.GeneralWords.align }}>{props.GeneralWords.CurrentLanguage}:</Text>




                        {languagesOptions.map((val: language, i: number) => {
                            const selectedValue = val.value;

                            return (
                                <View key={String(i)} style={{ flexDirection: props.GeneralWords.align == 'right' ? 'row' : 'row-reverse', alignItems: 'center', justifyContent: 'flex-end' }}>
                                    <TouchableOpacity style={{}} onPress={() => onSelectedItem(val)} key={String(i)} >
                                        {selectedValue == currentLanguage ? <Text style={{ alignSelf: 'center', color: 'green' }}>{val.name}</Text>
                                            : <Text style={{ alignSelf: 'center', color: props.Theme.colors.text.secondary }}>{val.name}</Text>
                                        }
                                    </TouchableOpacity>
                                    <CheckBox style={{}} value={selectedValue == currentLanguage ? true : false} onValueChange={() => onSelectedItem(val)}></CheckBox>
                                </View>

                            )
                        })}
                        <View style={styles.hr} />
                        <TouchableOpacity onPress={() => setIsDialogVisible(false)}>
                            <Text style={{ color: props.Theme.colors.text.secondary }}>{props.PageWords.cancel}</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>
        </View>
    )
}





const createStyles = (
    primary: string,
    secondary: string,
    text: TextObject,
    background: string,
    input: InputObject,
    align: string,
    isModalVisible: boolean,
) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isModalVisible ? 'gray' : background,

        },
        text: {
            color: text.primary,
            textAlign: align as TextStyle['textAlign'],
        },
        title: {
            textAlign: 'center',
            color: text.primary,
        },

        language: {
            flexDirection: align === 'left' ? 'row' : 'row-reverse',
            
        },
        modalContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,

        },
        modalInner: {
            width: '80%',
            margin: 20,
            padding: 20,
            borderRadius: 10,
            backgroundColor: background,
        },
        hr: {
            borderBottomColor: text.secondary,
            borderBottomWidth: 1,
        },
        circle: {
            width: 24,
            height: 24,
            borderRadius: 12,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
        }
    });
};
