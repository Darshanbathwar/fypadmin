import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { collection, getDocs, getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";


function Header() {
  const [currentUser, setCurrentUser] = useState(null);
  const [documentCount, setDocumentCount] = useState(0);
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);

  const auth = getAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (auth.currentUser) {
          const userDocRef = doc(getFirestore(), "users", auth.currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setCurrentUser(userDocSnap.data());
            console.log(currentUser.photoURL);

          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);

      }
    };

    const fetchDocumentCount = async () => {
      try {
        const db = getFirestore();
        const collectionRef = collection(db, "cards");
        const querySnapshot = await getDocs(collectionRef);
        setDocumentCount(querySnapshot.size);
      } catch (error) {
        console.error("Error fetching document count:", error);
      }
    };

    fetchUserData();
    fetchDocumentCount();

  }, [auth.currentUser]);

  const handleUserInfoClick = () => {
    setIsUserInfoOpen(!isUserInfoOpen);
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <>
      <div className=" bg-gray-800 pl-5 text-white pt-3 flex h-[8vh] justify-between ">
        <div className="events flex justify-around gap-1">
          <h2 className="text-xl font-bold ">Events</h2>
          <div className="counter bg-gray-700 gap-52 text-gray-200 rounded-full w-8 h-8 flex items-center justify-center">
            <p>{documentCount}</p>
          </div>
        </div>
        <div className="right-part flex justify-around gap-20">
          <div className="add-button">
            <NavLink to={'/CreateEvent'}>
              <button className="bg-[#000000] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
                <FaPlus className="mr-2" />
                <p>Add Event</p>
              </button>
            </NavLink>
          </div>
          <div className="user-section relative" onClick={handleUserInfoClick}>
  {currentUser && currentUser.displayName ? (
    <div className="user-info flex items-center space-x-2">
      <div className="username text-sm">{currentUser.displayName}</div>
      <img src={currentUser.photoURL} alt={currentUser.displayName} className="user-img w-8 h-8 rounded-full" />
    </div>
  ) : (
    <div className="user-info flex items-center space-x-2">
      <img src="/default-user-image.png" alt="Default User" className="user-img w-8 h-8 rounded-full" />
      <div className="username text-sm">User Name Unavailable</div>
    </div>
  )}
  {isUserInfoOpen && (
    <div className="user-dropdown absolute right-0 mt-2 bg-white border rounded shadow-lg">
      <button className="logout-btn block w-full px-4 py-2 text-gray-800 hover:bg-gray-200 text-sm" onClick={logout}>Logout</button>
    </div>
  )}
</div>

        </div>
      </div>
    </>
  );
}

export default Header;
