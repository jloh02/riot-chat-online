import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faTriangleExclamation
} from "@fortawesome/free-solid-svg-icons";
import "./App.css";
import Chat from "./pages/chat";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/chat" element={<Chat />} />
        <Route path="/" element={<LogIn />} />
      </Routes>
    </Router>
  );
}
function LogIn() {
  const [appState, setAppState] = useState("login");
  function getAppState(){

  }
  let invalidMessage;
  let fadeBox;
  let twoFAPopUp;


  /*Username box code */
  const [username, setUsername] = useState("");
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [usernameHasContent, setUsernameHasContent] = useState(false);
  const UsernameContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
    if (event.target.value !== "") {
      setUsernameHasContent(true);
    } else {
      setUsernameHasContent(false);
    }
  };
  const handleUsernameFocus = () => {
    setIsUsernameFocused(true);
  };

  const handleUsernameBlur = () => {
    setIsUsernameFocused(false);
  };
  const Usernamebox = (
    <div className="input-container">
      <input
        className="username-input"
        name="username-input"
        type="text"
        onFocus={handleUsernameFocus}
        onBlur={handleUsernameBlur}
        onChange={UsernameContent}
        value={username}
        disabled={appState == "validLogin"}
      />
      <label
        htmlfor="username-input"
        className={
          isUsernameFocused || usernameHasContent ? "up" : "inputlabel"
        }
      >
        Username
      </label>
    </div>
  );

  /*password box code*/
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
  };
  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
  };
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  const handleHasContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    if (event.target.value !== "") {
      setHasContent(true);
    } else {
      setHasContent(false);
    }
  };

  const PasswordBox = (
    <>
      <div className="container">
        <input
          className="username-input"
          name="password-input"
          type={showPassword ? "text" : "password"}
          onFocus={handlePasswordFocus}
          onBlur={handlePasswordBlur}
          value={password}
          onChange={handleHasContent}
          disabled={appState == "validLogin"}
        />
        <label
          htmlfor="password-input"
          className={
            isPasswordFocused || hasContent ? "up" : "inputlabel"
          }
        >
          Password
        </label>
        {(isPasswordFocused || hasContent) && (appState != "validLogin") ? <FontAwesomeIcon
          icon={showPassword ? faEye : faEyeSlash}
          onClick={handleTogglePassword}
        /> : (<></>)}

      </div>
    </>
  );




  const [OTP, setOTP] = useState("");
  /*On valid login*/
  if (appState == "validLogin") {

    let email = ""
    const handleOTPHasContent = (event: React.ChangeEvent<HTMLInputElement>) => {
      setOTP(event.target.value);
      if (event.target.value.length == 6) {
        window.location.href = "/chat"
      }
    };
    fadeBox = (
      <div
        style={{
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.6)",
          zIndex: 1,
        }}
      ></div>
    );
    twoFAPopUp = (
      <>
        <dialog open>
          <b><h1 style={{ margin: "0px", margintop: "26px" }}>2FA Authentication</h1></b>
          <p style={{ fontSize: "28px", margin: "0px", marginBottom: "40px" }}>A 6 digit code has been sent to {email}</p>
          <input
            type={"number"}
            value={OTP}
            onChange={handleOTPHasContent}
            placeholder="Enter Code"
          />
          <br></br>
          <button style={{ height: "48px", padding: "0px", fontsize: "16px" }}>submit</button>
        </dialog >
      </>
    );
  } else {
    fadeBox = <></>;
    twoFAPopUp = <></>;
  }

  /*Invalid message */
  if (appState == "invalidLogin") {
    invalidMessage = (
      <div className="container" style={{ margin: "0px" }}>
        <FontAwesomeIcon
          icon={faTriangleExclamation}
          style={{
            color: "#d6464b",
            left: "3px",
            top: "6px",
            style: "absolute",
            fontSize: "15px",
          }}
        />
        <p
          style={{
            color: "#d6464b",
            textAlign: "left",
            margin: "0px",
            marginLeft: "23px",
            style: "absolute",
          }}
        >
          Please enter a valid username and/or password
        </p>
      </div>
    );
  } else {
    invalidMessage = (
      <>
        <p></p>
      </>
    );
  }




  const handleSignIn = () => {
    // Here, you can access the values of the username and password states
    console.log("Username:", username);
    console.log("Password:", password);
    if (username === "correct" && password === "correct") {
      setAppState("validLogin");
    } else {
      setAppState("invalidLogin");
    }
    // Perform any necessary actions, such as sending a request to a server
  };

  return (
    <>
      <h1 id="header">Riot Chat Online</h1>
      {Usernamebox}

      <div className="container" style={{ opacity: "99%" }}>
        {PasswordBox}
        {invalidMessage}
        {/*
      <button id="media"><img src="src/assets/Facebook_Logo.png" alt="Facebook"></img></button>
      <button id="media"><img src="src/assets/google_logo.png" alt="Google"></img></button>
      <button id="media"><img src="src/assets/Apple_Logo.png" alt="Apple"></img></button>
      <button id="media"><img src="src/assets/xbox_logo.png" alt="Xbox"></img></button>
    */}
        <input id="SignIn" type="checkbox" disabled={appState == "validLogin"} />
        <label htmlFor="SignIn">Stay signed in</label>

        <br></br>
        <br></br>
        <button onClick={handleSignIn} disabled={appState == "validLogin"}>
          Sign in
        </button>
      </div>
      <div className="Footer">
        <p>
          Riot Chat Online was created under Riot Games' "Legal Jibber Jabber"
          policy using assets owned by Riot Games.
        </p>
        <p>Riot Games does not endorse or sponsor this project.</p>
        <a href="github.com/jloh02/repo/issues ">
          <p style={{ marginTop: "4px" }}>
            Report a bug or request a feature
          </p>
        </a>
        <a href="github.com/jloh02/repo/issues ">
          <img src="\src\assets\git.png" alt="View source or report issue" />
        </a>
      </div>
      <div
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: "#FFFFFF",
        }}
      ></div>
      {fadeBox}
      {twoFAPopUp}
    </>
  );

}


export default App;
