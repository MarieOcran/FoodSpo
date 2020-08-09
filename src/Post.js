import React, {useState, useEffect} from 'react'
import './App.css';
import { db, auth} from './firebase';
import Avatar from "@material-ui/core/Avatar";
import firebase from 'firebase';


function Post({postId, timestamp, user, username, caption, imageurl}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState([]);
    const [image, setImage] = useState([]);

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc)=> doc.data()));
                });
        }

        return () => {
            unsubscribe();
        };
    }, [postId]);

    

    const postComment = (event) => {
        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');

    }
    const deletePost = () => {
        db.collection("posts").doc(postId).delete().then(function() {
             alert("deleted")
         }).catch(function(error) {
             alert("Error removing document: ", error);
         });
   
     }


     return (

		<div class="post col-sm-6 container-fluid mb-5" >

            <div className="cardbox-heading my-2">
                <div className="media m-0">
                    
                    <div className="d-flex mr-3 my-2">
                        <Avatar
                            className="post_avatar"
                            alt={username}
                            src="/static/image/avatar/1.jpg"
                        />
                    </div>
                    
                    <div className="media-body">
                        <strong >{username}</strong>
                        <span><i className="icon ion-md-time"></i> {timestamp}</span>
                    </div>
              </div>
            </div>
                
            
            <div className="cardbox-item">
                <img  className="post-image" src={imageurl} alt="post"/>
               
          

            <div className="cardbox-base">
                <ul className="float-right">
                    <a>{user ?  (
                        <h2>
                        <svg width="1em" height="1em" onClick={deletePost} viewBox="0 0 16 16" class="bi bi-x text-danger" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"/>
                            <path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"/>
                        </svg>

                        </h2>): ( <p> </p>)}
                    </a>
                </ul> 
                <ul className="text-right">
                    
                    <li><h2> 
                        <svg width="1em" height="1em" onClick={deletePost} viewBox="0 0 16 16" class="bi bi-suit-heart" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M8 6.236l.894-1.789c.222-.443.607-1.08 1.152-1.595C10.582 2.345 11.224 2 12 2c1.676 0 3 1.326 3 2.92 0 1.211-.554 2.066-1.868 3.37-.337.334-.721.695-1.146 1.093C10.878 10.423 9.5 11.717 8 13.447c-1.5-1.73-2.878-3.024-3.986-4.064-.425-.398-.81-.76-1.146-1.093C1.554 6.986 1 6.131 1 4.92 1 3.326 2.324 2 4 2c.776 0 1.418.345 1.954.852.545.515.93 1.152 1.152 1.595L8 6.236zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.55 7.55 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z"/>
                        </svg>
                        </h2>
                        
                    </li>
        
                     
                    <li>
                        <h2 className="ml-5">
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-chat" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
                            </svg>
                        </h2>
                    </li>
                </ul>

                <p class="ml-3">
                 <strong>{username}</strong> {caption}
                </p>
                <div>
                    {comments.map((comment)=> (
                        <p>
                            <b>{comment.username}</b> {comment.text}
                            <small>{timestamp}</small>
                        </p>
                    ))}
                </div>
                {user &&(
                <form className="comment_box">
                    <input
                        className="post_input"
                        type="text"
                        placeholder="Add a comment"
                        value = {comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                        className="post-btn"
                        type="submit"
                        disabled={!comment}
                        onClick={postComment}>
                            Post
                    </button>
                </form>
                )}
            </div>
        
               </div>   
          <script async defer src="//assets.pinterest.com/js/pinit.js"></script>
        </div>
      
    )
}

export default Post

