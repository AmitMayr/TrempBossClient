import React, { createContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ColorScheme} from '../../types/types'
// import { useColorScheme } from 'react-native';
export interface Theme {
  colors:
  {
    primary: string;
    secondary: string;
    twist: string;
    background: string;
    headerBackground: string,
    screenActive:string,
    text: {
      primary: string;
      secondary: string;
    }
    input: {
      border: string;
      text: string;
      placeholder: string,

    }
    btn: {
      background: string,
    },
  },
  fonts:
  {
    regular: string;
    bold: string;
  },

}


// Create the theme context
interface ThemeContextType {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  lightTheme: Theme;
  darkTheme: Theme;

}
export const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);
// Create the theme provider component
function ThemeContextProvider({ children }: { children: ReactNode; }) {

  // Define the initial light mode theme
  const lightTheme: Theme = {
    colors: {
      primary: '#000000',
      secondary: '#c4c4c4',
      twist: '#cbcbcb',
      screenActive: '#6e6e6d',
      text: {
        primary: '#000000',
        secondary: '#333333',
      },
      input: {
        border: '#c4c4c4',
        text: '#000000',
        placeholder: '#a4a4a4',
      },
      btn: {
        background: '#e8e8e8',
      },
      headerBackground: '#ffffff',
      background: '#fafafa',
    },
    fonts: {
      regular: 'Roboto-Regular',
      bold: 'Roboto-Bold',
    },

  };

  // Define the dark mode theme
  const darkTheme: Theme = {
    colors: {
      primary: '#808080',
      secondary: '#161716',
      twist: '#2e2e2e',
      screenActive: '#636362',
      text: {
        primary: '#ffffff',
        secondary: '#cccccc',
      },
      input: {
        border: '#3e3e3a',
        text: '#ffffff',
        placeholder: '#939393',
      },
      btn: {
        background: '#171717',
      },
      headerBackground: '#171717',
      background: '#222222',
    },
    fonts: {
      regular: 'Roboto-Regular',
      bold: 'Roboto-Bold',
    },
  };


  const [theme, setTheme] = useState(lightTheme);

  const setColorScheme = async (colorScheme: ColorScheme) => {
  }
  const saveColorSchemePreference = async (colorScheme: string) => {
    try {
      await AsyncStorage.setItem('colorScheme', colorScheme);
    } catch (error) {
      // Handle the error
      console.log('Error saving color scheme preference:', error);
    }
  };
  const getColorSchemePreference = async () => {
    try {
      const colorScheme: string | null = await AsyncStorage.getItem('colorScheme');
      return colorScheme;
    } catch (error) {
      // Handle the error
      return null;
      console.log('Error retrieving color scheme preference:', error);
    }
  };

  const value: ThemeContextType = {
    theme,
    setTheme,
    lightTheme,
    darkTheme,
  };
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
export default ThemeContextProvider;