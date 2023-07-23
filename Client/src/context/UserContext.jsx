import React, { createContext, useEffect, useState } from 'react';
export const userContext = createContext();
import { BACKAPI } from '@env';

// console.log(BACKAPI);
export const UserContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userLoggedInId, setUserLoggedInId] = useState('');
  const [userLoggedIn, setUserLoggedIn] = useState(null);
  const [isDriver, setIsDriver] = useState(false);



  const GetUserName = (creatorId) => {
    try {
      if (!userLoggedIn) return "אין משתמש מחובר"
      return userLoggedIn.first_name + userLoggedIn.last_name ? userLoggedIn.first_name + " " + userLoggedIn.last_name : "אין שם ";
    } catch (error) {
      return "אין שם"
    }
  };
  const GetUserLoggedIn = () => {
    try {
      return userLoggedIn || " לא נמצא";
    } catch (error) {
      return "יוזר לא נמצא"
    }
  };
  const loginUser = async (userData) => {
    console.log(userData);
    try {
      const response = await fetch(`${BACKAPI}api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      console.log(JSON.stringify(response) + " response");
      let json = await response.json();
      if (response.status) {
        setUserLoggedInId(json.data.user._id)
        setUserLoggedIn(json.data);
        setIsLoggedIn(true);

        // console.log(json);
        // await fetchUsers();
        return json;
      } else {
        const errorResponse = await response.json();
        // console.error(errorResponse);
        return errorResponse.error;
      }
    } catch (error) {

      // console.error('שגיאה בהוספת משתמש', error);
      return { message: error };
    }
  };


  const UpdateLoggedInUser = async (updateDetailsJson) => {


    try {
      const response = await fetch(`${BACKAPI}api/users/update/${userLoggedIn.user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer \n' + userLoggedIn.token

        },
        body: JSON.stringify(updateDetailsJson)
      });
      if (response.ok) {

        setUserLoggedIn(prev => ({//copy the past and override the changes.
          ...prev,
          user: {
            ...prev.user,
            ...updateDetailsJson
          }
        }));

      } else {// When request is failed.
        console.log(response);


      }
    } catch (error) {// When had error calling the request.
      console.log(' שגיאה בעדכון משתמש' + error);
    }
  };


  


  // const formData = new FormData();
  // for (const key in updateDetailsJson) {
  //   formData.append(key, updateDetailsJson[key]);
  // }

  // console.log(file);
  // if (file) {
  //   formData.append("image_URL", {
  //     uri: file.assets[0].uri,
  //     type: file.assets[0].type,
  //     name: file.assets[0].fileName

  //   });
  // }
  // console.log(formData);

  // console.log("formData");
  const UpdateLoggedInUserImage = async (updateDetailsJson, file = null) => {
    // console.log("formData");
    const detailsToUpdate = { ...updateDetailsJson };

    if (file) {
      detailsToUpdate.image_URL = {
        uri: file.assets[0].uri,
        type: file.assets[0].type,
        name: file.assets[0].fileName,
      };
    }
    console.log(detailsToUpdate);
 
    try {
      const response = await fetch(`${BACKAPI}api/users/update-user-image/${userLoggedIn.user._id}`, {
        method: 'PUT',
        body: detailsToUpdate,

        headers: {
          'Authorization': 'Bearer ' + userLoggedIn.token,
          // 'Content-Type': 'multipart/form-data; ',
          'Content-Type': 'application/json',

        },
      });

      console.log("response", response);
      console.log(await response.json());

      if (response.ok) {
        setUserLoggedIn(prev => ({
          ...prev,
          user: {
            ...prev.user,
            ...updateDetailsJson
          }
        }));
      } else {
        const responseBody = await response.json();
        console.log(responseBody?.error?.message || "error");
      }
    } catch (error) {
      console.log('Error in updating user: ' + error);
    }

  };

  const InsertOne = async (userData) => {
    try {
      const response = await fetch(`${BACKAPI}api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      if (response.ok) {
        // await fetchUsers();
        return await response.json();
      } else {
        const errorResponse = await response.json();
        return errorResponse;
      }
    } catch (error) {
      return error;
    }
  };


  const getUserById = async (id) => {
    try {
      const response = await fetch(`${BACKAPI}api/users/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer \n' + userLoggedIn.token

        },
      });
      if (response.ok) {
        let json = await response.json();
        // await fetchUsers();
        // console.log(json);
        return json;
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse)

        // console.error(errorResponse);
        return errorResponse.error;
      }
    } catch (error) {
      console.error(error)
      console.log("3");

      // console.error('שגיאה בהוספת משתמש', error);
      return error;
    }
  };











  const setUserToken = async (token) => {
    try {
      const response = await fetch(`${BACKAPI}api/users/updateToken/${userLoggedInId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: token.toString() })
      });
      if (response.ok) {
        await fetchUsers();
      } else {
        console.error(response);
        // Handle the case where the request was not successful
      }
    } catch (error) {
      console.error('שגיאה בהוספת משתמש', error);
    }
  };



  return (
    <userContext.Provider value={{ UpdateLoggedInUserImage, loginUser, isLoggedIn, setIsLoggedIn, setUserLoggedInId, userLoggedInId, setUserToken, GetUserName, GetUserLoggedIn, InsertOne, userLoggedIn, UpdateLoggedInUser, getUserById, isDriver, setIsDriver, setUserLoggedIn }}>
      {children}
    </userContext.Provider>
  );
};
