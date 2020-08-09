import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import firebase from "firebase";
import { db, storage} from './firebase';




function PostUpload({username}) {



    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                console.log(error);
                alert(error.message);
            },
            () => {
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageurl: url,
                            username: username

                        });
                        setProgress(0);
                        setCaption("");
                        setImage(null);
                });
            }
        )

    }

    return (
        <form>
        
        
                <textarea 
                type="text" 
                placeholder="What inspired this dish?" 
                
                onChange={event => setCaption(event.target.value)}
                value = {caption}
                row="5"
                className="form-control text-secondary upload-ipt"/>
                
        
             
                <progress class="w3-container w3-blue w3-round-xlarge"  value={progress} max="100"></progress>
                <input 
                    type="file"  
                    onChange = {handleChange}
                    className="form-control text-secondary btn-outline-light"/>
                    <div class="w3-light-grey w3-round-xlarge">
                </div>
                
            
             
                <Button
                    onClick = {handleUpload}
                    className="float-right upload-btn text-primary">
                        <svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-arrow-up-square-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 8.354a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 6.207V11a.5.5 0 0 1-1 0V6.207L5.354 8.354z"/>
                        </svg>
                </Button>
            
            
        </form>
    )
}

export default PostUpload
