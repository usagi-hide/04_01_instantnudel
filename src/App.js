import React, { useState, useEffect} from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';

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
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  
  // 状態を持たせる useStateの([])の中にPostの配列が入る
  const [posts, setPosts] = useState([]);

  //login時の状態
  const [openSignIn, setOpenSignIn] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user がログインしたら
        console.log(authUser);
        setUser(authUser);
        
      } else {
        //user がログアウトしたら
        setUser(null);
      }
    })

    return () => {
      unsubscribe();
    }
  }, [user, username]);

  useEffect(() => {
    //空の配列を渡すと読み込み時に情報取得が実行される（一回のみ）
    db.collection('posts').onSnapshot(snspshot => {
      setPosts(snspshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

  const signUp = (e) => {
    e.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
      return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    
    setOpen(false);
  }

  const signIn = (e) => {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))
    
    setOpenSignIn(false);
  }


  return (
    <div className="app">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
                <img className="app_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png" alt="" />
              
            </center>
              <Input
                placeholder="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signUp}>Sign Up</Button>
            </form>
          </div>
      </Modal>
      
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
                <img className="app_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png" alt="" />
              
            </center>
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signIn}>Sign In</Button>
            </form>
          </div>
          </Modal>
        

      <div className="app_header">
        <img className="app_headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png" alt=""/>
      </div>

      {user ? (
        <Button onClick={() => auth.signOut()}>Logout</Button>
      ) : (
          <div className="app_loginContainer">
            <Button onClick={() => setOpen(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
      )}

      {
        //投稿のループ処理
        posts.map(({id, post}) => (
          <Post key={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
        ))
      }
    
    </div>
  );
}

export default App;
