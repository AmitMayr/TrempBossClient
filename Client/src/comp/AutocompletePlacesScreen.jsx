import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity } from 'react-native';

const AutocompletePlacesScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [fromLocation, setFromLocation] = useState(null);


    const handleSearch = async (query) => {
        try {
            const response = await fetch(
                `http://api.positionstack.com/v1/forward?access_key=8f382e0efabfc0540255ee97701aaad0&query=${query}`
            );

            const data = await response.json();
            setSuggestions(data.data);
        } catch (error) {
            console.error('Error fetching autocomplete suggestions:', error);
        }
    };

    const handleSelectPlace = (place) => {
        // Do something with the selected place
        console.log('Selected place:', place);
    };

    const renderSuggestionItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleSelectPlace(item)}>
            <Text>{item.label}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1 }}>
            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                onChangeText={(text) => {
                    setSearchQuery(text);
                    handleSearch(text);
                }}
                value={searchQuery}
                placeholder="Search places"
            />

            <FlatList
                data={suggestions}
                renderItem={renderSuggestionItem}
                keyExtractor={(item) => {item ? item.name : ''}}
            />
        </View>
    );
};

export default AutocompletePlacesScreen;
