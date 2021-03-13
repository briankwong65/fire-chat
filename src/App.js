import React from 'react';
import './App.css';
import _ from 'lodash';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyDhW1eBzXFfRbj5UMBd7BkAiBlVvMVJ7r0',
    authDomain: 'quick-chat-2a210.firebaseapp.com',
    projectId: 'quick-chat-2a210',
    storageBucket: 'quick-chat-2a210.appspot.com',
    messagingSenderId: '958632476247',
    appId: '1:958632476247:web:346bd06e8c92fc772c2d12',
    measurementId: 'G-7CMCER6ENC',
  });
} else {
  firebase.app(); // if already initialized, use that one
}

const auth = firebase.auth();
const firestore = firebase.firestore();

const App = () => {
  const [user] = useAuthState(auth);

  return (
    <div className='App'>
      <header></header>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
};

const SignIn = () => {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };
  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
};

const SignOut = () => {
  return (
    auth.currentUSer && <button onClick={() => auth.signOut()}>Sign Out</button>
  );
};

const ChatRoom = () => {
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query, { idField: 'id' });

  return (
    <>
      <p>hello world</p>
      <div>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
      </div>
    </>
  );
};

const ChatMessage = (props) => {
  const { text, uid } = props.message;
  return <p>{text}</p>;
};

export default App;
