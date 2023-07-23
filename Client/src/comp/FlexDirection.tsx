import { useContext, useState } from 'react';
import { TranslationContext } from '../styles/Languages/Languages';
import { I18nManager } from 'react-native';

const FlexDirection = () => {
    // Check if the device is set to RTL (Right-to-Left) direction, defaulting to true if the check fails
    const isRTL = I18nManager.isRTL ?? true;

    // Access the GetDictByLangAndKey function from the TranslationContext using useContext hook
    const { GetDictByLangAndKey } = useContext(TranslationContext);

    // Specify the key for the desired words dictionary
    const wordsKey = "login";

    // Retrieve the general words dictionary based on the selected language
    const generalWords = GetDictByLangAndKey("general");

    // Determine whether the alignment should be set to right based on the value in the generalWords dictionary
    const isLangaugeRTL = generalWords['align'] == 'right';

    const textAlign = generalWords['align'];
    // Determine the value of the flexDirection property based on RTL settings and language direction
    const flexDirection = !isRTL
        ? isLangaugeRTL
            ? 'row-reverse'
            : 'row'
        : isLangaugeRTL
            ? 'row'
            : 'row-reverse';
    const alignItems = !isRTL
        ? isLangaugeRTL
            ? 'flex-end'
            : 'flex-start'
        : isLangaugeRTL
            ? 'flex-start'
            : 'flex-end';

    return { flexDirection, isLangaugeRTL, isRTL, textAlign,alignItems };
}

export default FlexDirection;
