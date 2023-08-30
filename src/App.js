import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom'
import Main from './Main'
import Chat from './Chat'
import PDFExtract from './PDFExtract';

function App() {

  const baseurl = "http://localhost:8080";

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const login = useGoogleLogin({
    onSuccess: (response) => setUser(response),
    onError: (error) => console.log('Login Failed:', error),
  });

  useEffect(() => {
    if (profile) {
      axios
        .post(baseurl + "url", {
          email:profile.email
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => console.log(error));
    }
  }, [profile])

  useEffect(() => {
      if (user) {
        axios
          .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: 'application/json'
            }
          })
          .then((res) => {
            setProfile(res.data);
          })
          .catch((err) => console.log(err));
      }
    },
    [user]
  );

  // log out function to log the user out of google and set the profile array to null
  const logOut = () => {
    googleLogout();
    setProfile(null);
  };

  return (
    <div>
      {profile ? (
        // console.log('user', user),
        // console.log('profile', profile),
        <Routes>
          <Route exact path="/DongAJul_APP" element={<Main />} />
          <Route exact path="/chat" element={<Chat />} />
          <Route exact path="pdfextract" element={<PDFExtract />} />
        </Routes>
        // <div>
        //     <img src={profile.picture} alt="user image" />
        //     <h3>User Logged in</h3>
        //     <p>Name: {profile.name}</p>
        //     <p>Email Address: {profile.email}</p>
        //     <br />
        //     <br />
        //     <button onClick={logOut}>Log out</button>
        // </div>
      ) : (
        <button onClick={() => login()}>Sign in with Google</button>
      )}
    </div>
  );
}

export default App;