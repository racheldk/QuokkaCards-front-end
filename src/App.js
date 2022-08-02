import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/pages/homePage/HomePage";
import NewCard from "./components/pages/newCardPage/NewCardPage";
import MyCards from "./components/pages/myCardsPage/MyCardsPage";
import Explore from "./components/pages/explorePage/ExplorePage";
import EditCard from "./components/EditCard"
import UserCards from "./components/pages/userCardsPage/UserCardsPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LogIn from "./components/pages/logInPage/LogInPage";
import "bulma/css/bulma.min.css";
import useLocalStorageState from "use-local-storage-state";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [token, setToken] = useLocalStorageState("quokkaToken", null);
  const [username, setUsername] = useLocalStorageState("quokkaUsername", "");
  const [myCardList, setMyCardList] = useState([]);
  const [followCardList, setFollowCardList] = useState([]);
  const [allCardList, setAllCardList] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const setAuth = (username, token) => {
    setUsername(username);
    setToken(token);
  };

  useEffect(() => {
    axios
      .get("https://quokka-cards.herokuapp.com/profile", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setMyCardList(res.data);
      });
  }, [token, setMyCardList]);
  
  // FollowCardList endpoint isn't available yet. 
  useEffect(() => {
    setFollowCardList([{"message": "endpoint not available yet"}])
    // axios
    //   .get("https://quokka-cards.herokuapp.com/cards/timeline", {
    //     headers: {
    //       Authorization: `Token ${token}`,
    //     },
    //   })
    //   .then((res) => {
    //     console.log(res.data);
    //     setFollowCardList(res.data);
    //   });
  }, [token, setFollowCardList]);
    
  useEffect(() => {
    axios
        .get('https://quokka-cards.herokuapp.com/cards', {
        })
        .then((res) => {
            // console.log(res.data)
            setAllCardList(res.data)
        })
},[setAllCardList])

  useEffect(() => {
    axios
      .get("https://quokka-cards.herokuapp.com/following/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setFollowing(res.data);
      });
  }, [token, setFollowing]);

  useEffect(() => {
    axios
      .get("https://quokka-cards.herokuapp.com/followers/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setFollowers(res.data);
      });
  }, [token, setFollowers]);

  useEffect(() =>{
    axios   
        .get('https://quokka-cards.herokuapp.com/users/', {
        })
        .then((res) => {
            // console.log('user results' + res.data)
            setAllUsers(res.data)
        })
}, [setAllUsers])

  const handleLogout = () => {
    // send request to log out on the server
    console.log(token, username);
    axios
      .post(
        "https://quokka-cards.herokuapp.com/api/auth/token/logout",
        {},
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )
      .then(() =>
        // log out in React
        setAuth("", null)
      );
  };

  if (!token) {
    return <LogIn setToken={setToken} setAuth={setAuth} />;
  }

  return (
    <BrowserRouter>
      <Navbar handleLogout={handleLogout} />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              followCardList={followCardList}
              following={following}
            />
          }
        />
        <Route path="/newcard" element={<NewCard token={token} />} />
        <Route
          path="/mycards"
          element={
            <MyCards
              token={token}
              myCardList={myCardList}
              followers={followers}
            />
          }
        />
        <Route
          path="/explore"
          element={
            <Explore
              allCardList={allCardList}
              allUsers={allUsers}
            />
          }
          />
        <Route path="/edit/">
        <Route
          path=":id"
          element={
            <EditCard
              token={token}
        
            />
          }
        />
        </Route>
        <Route path="/user/">
          <Route
            path=":id"
            element={
              <UserCards
                // Are we going to need a separate API request here? since we won't have the right primary key to add to the profile until the user's name is clicked? 
                token={token}
              />
            }
          />
        </Route>
        <Route path="*" element={<div>404 Not Found! Invalid URL!</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
