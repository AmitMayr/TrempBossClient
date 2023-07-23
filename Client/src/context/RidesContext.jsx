import React, { createContext, useEffect, useState } from 'react';
export const rideContext = createContext();
import { BACKAPI } from '@env';


export const RidesContextProvider = ({ children }) => {
  const [rides, setRides] = useState([]);
  useEffect(() => {
    // fetchRides();
    return () => {
    }
  }, [])

  // const fetchRides = async () => {
  //     try {
  //         const response = await fetch(`${BACKAPI}/api/tremps/all`); // Replace with your actual URL
  //         const rides = await response.json();
  //         setRides(rides||[]);
  //     } catch (error) {
  //         console.error('שגיאה נסיעות ', error);
  //     }
  // };

  const addRide = async (newRide, token) => {
    // console.log(newRide);
    // console.log(newRide.creator_id);
    try {
      console.log(JSON.stringify(newRide));
      const response = await fetch(`${BACKAPI}/api/tremps/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer \n' + token

        },
        body: JSON.stringify(newRide)
      });
      if (response.ok) {
        // console.log("11");
        return await response.json();
      } else {
        // console.log("2");
        const errorResponse = await response.json();
        return errorResponse
      }
    } catch (error) {
      return error;
    }
  }
  const userRides = async (token, filters) => {
    try {
      // console.log(JSON.stringify(filters));
      const response = await fetch(`${BACKAPI}/api/tremps/user-tremps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer \n' + token

        },
        body: JSON.stringify(filters)
      });
      const responseData = await response.json();

      return responseData;
      // console.log(wtf.status);
      // if (response.ok) {
      //   const responseData = await response.json();

      //   return responseData;
      // } else {

      //   const errorResponse = await response.json();
      //   console.log(errorResponse);
      //   return -9;
      // }
    } catch (error) {
      return {status:false};
    }

  }

  const trempsByFilters = async (token, filters) => {
    try {
      // console.log(JSON.stringify(filters));
      const response = await fetch(`${BACKAPI}/api/tremps/trempsByFilters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer \n' + token

        },
        body: JSON.stringify(filters)
      });
      if (response.ok) {
        const responseData = await response.json();

        return responseData;
      } else {

        const errorResponse = await response.json();
        console.log(errorResponse);
        return -9;
      }
    } catch (error) {
      console.error('שגיאה בשליפת נסיעות', error);
      return -8;
    }

  }

  const joinRide = async (tremp_id,user_id, token) => {
    // console.log(newRide);
    // console.log(newRide.creator_id);
    try {
      const response = await fetch(`${BACKAPI}/api/tremps/join-ride`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer \n' + token

        },
        body: JSON.stringify({tremp_id,user_id})
      });
      if (response.ok) {
        console.log("success");
        return 1;
      } else {
        // console.log("2");
        const errorResponse = await response.json();
        console.error(errorResponse);
        console.log("err");

        return -9;
      }
    } catch (error) {
      console.log("errr-8");
      console.error('שגיאה בהוספת בקשה', error);
      return -8;
    }
  }



  const UpdateApproveStatus = async (bodyInfoJson, token) => {
    // console.log(newRide);
    // console.log(newRide.creator_id);
    try {
      const response = await fetch(`${BACKAPI}/api/tremps/approveUserInTremp`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer \n' + token

        },
        body: JSON.stringify(bodyInfoJson)
      });
      if (response.ok) {
        return await response?.json();
      } else {
        // console.log("2");
        const errorResponse = await response.json();
        console.log("err");

        return errorResponse?.error?.message;
      }
    } catch (error) {
      return error?.message;
    }
  }

  const DeleteRide = async (bodyInfoJson, token) => {
    // tremp_id, user_id
    // console.log(newRide);
    // console.log(newRide.creator_id);
    try {
      const response = await fetch(`${BACKAPI}/api/tremps/delete-tremp`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer \n' + token

        },
        body: JSON.stringify(bodyInfoJson)
      });
      if (response.ok) {
        return await response?.json();
      } else {
        // console.log("2");
        const errorResponse = await response.json();
        console.log("err");

        return errorResponse?.error?.message;
      }
    } catch (error) {
      return error?.message;
    }
  }




  return (
    <rideContext.Provider value={{ rides, addRide ,trempsByFilters,joinRide,userRides,UpdateApproveStatus,DeleteRide}}>
      {children}
    </rideContext.Provider>
  );
};
