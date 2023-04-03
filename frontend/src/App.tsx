import { useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye,faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <LogIn />
    </>
  );
}
function LogIn(){
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
  };
  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
  };
let PasswordBox;
const NoTopPadding = {
  paddingTop: '0px'
}
if (isPasswordFocused){
PasswordBox =
<>

<input
type={showPassword ? "text" : "password"}
placeholder="Password"
onFocus={handlePasswordFocus}
onBlur={handlePasswordBlur}
style={NoTopPadding}
value={password}
onChange={(e) => setPassword(e.target.value)}

/>
<FontAwesomeIcon
  icon={showPassword ? faEye : faEyeSlash}
 onClick={handleTogglePassword}/>
 
</>
 }else{
  PasswordBox =
<>

<input
type={showPassword ? "text" : "password"}
placeholder="Password"
onFocus={handlePasswordFocus}
onBlur={handlePasswordBlur}
value={password}
onChange={(e) => setPassword(e.target.value)}
/>
<FontAwesomeIcon
  icon={showPassword ? faEye : faEyeSlash}
 onClick={handleTogglePassword}/>
</>
 }
 const handleSignIn = () => {
  // Here, you can access the values of the username and password states
  console.log("Username:", username);
  console.log("Password:", password);
  // Perform any necessary actions, such as sending a request to a server
};


  return (
    <>
      <h1 id="header">Riot Chat Online</h1>
      
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
        <div className="container">
      <div className="container">
      
        {PasswordBox}
      </div>
      {/*
      <button id="media"><img src="src/assets/Facebook_Logo.png" alt="Facebook"></img></button>
      <button id="media"><img src="src/assets/google_logo.png" alt="Google"></img></button>
      <button id="media"><img src="src/assets/Apple_Logo.png" alt="Apple"></img></button>
      <button id="media"><img src="src/assets/xbox_logo.png" alt="Xbox"></img></button>
    */}
      <input id="SignIn" type="checkbox" /><label htmlFor="SignIn">Stay signed in</label>
      
      <br></br>
      <br></br>
      <button onClick={handleSignIn}>Sign in</button>
      </div>
      <div className="Footer">
        <p>Riot Chat Online was created under Riot Games' "Legal Jibber Jabber" policy using assets owned by Riot Games. </p>
        <p>Riot Games does not endorse or sponsor this project.</p>
        <a href=""><p>Report a bug or request a feature</p></a>
        <img src="src/assets/git.png" alt="Github" />

      </div>
      
    </>
  );

}
export default App
