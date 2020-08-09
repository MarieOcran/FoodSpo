import React, {useState, useEffect} from 'react';

import './App.css';
import './footer.css';
import Post from './Post';
import PostUpload from './PostUpload';
import { db, auth } from './firebase';
import { makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input} from '@material-ui/core';



function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  
  const [modalStyle] = useState(getModalStyle);
  const classes = useStyles();
  
  
  const [posts, setPosts] = useState ([]);
  const [open, setOpen] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState ('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);

  
 

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser){
        console.log(authUser);
        setUser(authUser);
    } else {
      setUser(null);
    }   
  })

  return () => {
    unsubscribe();
  } 
}, [user, username]);
  


  useEffect(() => {
    //new post update code
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      //this code runs
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      
      })));
    })
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email,password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName : username
      })
    })
    .catch((error) => alert(error.message));
    setOpen(false)
  }
  // sigin function
  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email,password)
      
      .catch((error) => alert(error.message))

    setOpenSignIn(false)
  }
  
  const handleOpen = () => {
    setOpenUpload(true);
  };

  const handleClose = () => {
    setOpenUpload(false);
  };
  
  
  return (

   
    <div className="App ">

     
      
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            className="bg-dark">
            <div style={modalStyle} className={classes.paper}>
            <form className="app_signup">
                
                <h1 className="logo text-center ">FoodSpo</h1>
                
                <div className="form-group">
                  
                    <Input 
                      type="text" 
                      placeholder="Username" 
                      value = {username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="form-control text-secondary btn-outline-light"
                      />
                
                  </div>

                  <div className="form-group">
                  
                    <Input 
                      type="email" 
                      placeholder="Enter Email" 
                      value = {email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control text-secondary btn-outline-light"/>
                    
                  </div>
                  
                  <div className="form-group">
                  
                    <Input 
                      type="Password" 
                      placeholder="Enter Password" 
                      value = {password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control text-secondary btn-outline-light"/>
                  </div>
                      
                      <Button onClick={signUp} className="btn  btn-block my-4 " >Sign Up</Button>
                  
                      </form>
                </div>
        </Modal>

        {/* sign in modal begins here!! */}
        <Modal
            open={openSignIn}
            onClose={() => setOpenSignIn(false)}
            className="bg-dark">
            <div style={modalStyle} className={classes.paper}>
            <form className="app_signup">
                
                <h1 className="logo text-center">FoodSpo</h1>
                
            
                  <div className="form-group">
        
                    <Input 
                      type="text" 
                      placeholder="Enter Email" 
                      value = {email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control text-secondary btn-outline-light"/>
                    
                  </div>
                  
                  <div className="form-group">
                  
                    <Input 
                      type="password" 
                      placeholder="Enter Password" 
                      value = {password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control text-secondary btn-outline-light"/>
                  </div>
                      
                      <Button onClick={signIn} className="btn  btn-block my-4 " >Sign In</Button>
                  
                      </form>
                </div>
        </Modal>
        
          
      {/* feed begins here */}
      <div className="app_header ">
        <div>
          <h1 className="logo d-inline-block ml-2  ">FoodSpo</h1>
        </div>
        <div className="">
        {user ? (
        
          <div className="">
          <Button onClick={() => auth.signOut()} className= "ml-3"> Log Out</Button>|
          <Button onClick={handleOpen} className= " "> Upload </Button>
        
          
          </div>
          
          ): (
          <div className=" ">
            <Button onClick={() => setOpenSignIn(true)} className= "ml-4">LogIn</Button>|
            <Button onClick={() => setOpen(true)} className= "mr-3">Sign Up</Button>
          </div>
        
      )}
        </div>
      </div>

      <div className='hero'>
        
        {
          posts.map(({id, post}) => (
            <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageurl={post.imageurl} className="post col-sm"/>
          ))
        }
  
      </div>

      <Modal
        open={openUpload}
        onClose={handleClose}
        className="bg-dark">
            <div style={modalStyle} className={classes.paper}>
              {user?.displayName ? (
              <PostUpload username={user.displayName} />
                ): (
                  <h3> Need to log in </h3>
                )}
            </div>
      </Modal>

      <nav class="footer fixed-bottom row">
     
        <div>
          <h1 className="logo1">FoodSpo</h1>
        </div>
         
              {user ? (
            
            <div className="ml-4">
            <Button onClick={() => auth.signOut()} className= "ml-5"> 
              <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-person-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M11 14s1 0 1-1-1-4-6-4-6 3-6 4 1 1 1 1h10zm-9.995-.944v-.002.002zM1.022 13h9.956a.274.274 0 0 0 .014-.002l.008-.002c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664a1.05 1.05 0 0 0 .022.004zm9.974.056v-.002.002zM6 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6.854.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
              </svg>
            </Button>
            <Button onClick={handleOpen} className= "">
              <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-upload" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M.5 8a.5.5 0 0 1 .5.5V12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8.5a.5.5 0 0 1 1 0V12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8.5A.5.5 0 0 1 .5 8zM5 4.854a.5.5 0 0 0 .707 0L8 2.56l2.293 2.293A.5.5 0 1 0 11 4.146L8.354 1.5a.5.5 0 0 0-.708 0L5 4.146a.5.5 0 0 0 0 .708z"/>
                <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0v-8A.5.5 0 0 1 8 2z"/>
              </svg>
            </Button>
          
            </div>
            
            ): (
            <div className="ml-4 text-center">
              <Button onClick={() => setOpenSignIn(true)} className= " " alt="login">
                <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-person-dash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M11 14s1 0 1-1-1-4-6-4-6 3-6 4 1 1 1 1h10zm-9.995-.944v-.002.002zM1.022 13h9.956a.274.274 0 0 0 .014-.002l.008-.002c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664a1.05 1.05 0 0 0 .022.004zm9.974.056v-.002.002zM6 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm2 2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z"/>
                </svg>
              </Button>
              
              <Button onClick={() => setOpen(true)} className= "">
                <svg width="1.5em" height="1.5em" viewBox="0 0 16 16"  class="bi bi-person-plus " fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M11 14s1 0 1-1-1-4-6-4-6 3-6 4 1 1 1 1h10zm-9.995-.944v-.002.002zM1.022 13h9.956a.274.274 0 0 0 .014-.002l.008-.002c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664a1.05 1.05 0 0 0 .022.004zm9.974.056v-.002.002zM6 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm4.5 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"/>
                <path fill-rule="evenodd" d="M13 7.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0v-2z"/>
              </svg>
              </Button>
            </div>
          
        )}

      </nav>
    </div>
  );
}

export default App;
