import React, { useRef, useState } from 'react';
import * as styles from './styles.module.scss';

import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import ChatMessage from '../ChatMessage';

const ChatRoom = (props) => {
    const { firestore, auth } = props;

    const messagesRef = firestore.collection('messages');
    const query = messagesRef.orderBy('createdAt').limit(25);
    const [messages] = useCollectionData(query, { idField: 'id' });

    const [formValue, setFormValue] = useState('');

    const buttomView = useRef();

    const handleSubmit = (event) =>{
        setFormValue(event.target.value);
    }

    const sendMessage = async(event) => {
        event.preventDefault();
        const { uid, photoURL } = auth.currentUser;

        await messagesRef.add({
            text: formValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            photoURL
        });

        setFormValue('');

        buttomView.current.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <>
            <main>
                {messages &&
                messages.map((msg) => <ChatMessage key={msg.id} message={msg} auth={auth}/>)}
                <span ref={buttomView}></span>
            </main>
            <form onSubmit={sendMessage}>
                <input value={formValue} onChange={handleSubmit} placeholder="Say something💬"/>
                <button type='submit' disabled={!formValue}>👾</button>
            </form>
        </>
    );
};

export default ChatRoom;