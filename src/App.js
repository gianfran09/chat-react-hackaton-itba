import React, {useEffect, useState,} from 'react';

// los componentes
import Channel from './Components/Channel';
import Button from  './Components/Button';



// Firebase dependen
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';



firebase.initializeApp({
 // config de la web app
  apiKey: "AIzaSyAYenu1_azbzQI7UVorO0iey6gKVLi7QWg",
  authDomain: "hackaton-chat-itba.firebaseapp.com",
  projectId: "hackaton-chat-itba",
  storageBucket: "hackaton-chat-itba.appspot.com",
  messagingSenderId: "837102621919",
  appId: "1:837102621919:web:1543ee849c0e9290a9c56a"
});

const auth = firebase.auth();
const db = firebase.firestore();

function App() {
  const [user, setUser] = useState(() => auth.currentUser); 
  const [initializing, setInitializing] = useState(true);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else{
          setUser(null);
      }
      if (initializing) {
          setInitializing(false);
      }
    });

    // Limpia subscripcion
    return unsubscribe;

  },[]);

  const signInWithGoogle = async () => {
    // Google provider object
    const provider = new firebase.auth.GoogleAuthProvider();
    // Lenguaje de preferencia de navegador
    auth.useDeviceLanguage();
    // Proceso de ingreso
    try{
      await auth.signInWithPopup(provider);
    } catch (error) {
      console.error(error);
    }
  };  

  const signOut = async () => {
    try {
      await firebase.auth().signOut();      
    } catch (error) {
      console.log(error.message);
    }
  };

  if (initializing) return 'Cargando..'; 

  return (
    <div>
      {user ? (
        <>
          <Button onClick={signOut}>Sign out</Button>
          <Channel user={user} db={db} />
          </>
      ) : (
        <Button onClick={signInWithGoogle}>Sign in with Google</Button>
        )}  
    </div>
  );

}

export default App;
