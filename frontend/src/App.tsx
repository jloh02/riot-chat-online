import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { TextField, Typography } from "@mui/material";
import "@material/textfield/dist/mdc.textfield.min.css";
import { MuiOtpInput } from "mui-one-time-password-input";

import "./App.css";
var state = "login";
const textFieldElement = document.querySelector(".mdc-text-field");
if (textFieldElement) {
  const textField = new MDCTextField(textFieldElement);
}

function App() {
  if (state === "login") {
    return (
      <>
        <LogIn />
      </>
    );
  }
}
function LogIn() {
  const [appState, setAppState] = useState("login");
  useEffect(() => {
    const textFieldElement = document.querySelector(".mdc-text-field");
    if (textFieldElement) {
      const textField = new MDCTextField(textFieldElement);
    }
  }, []);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [OTP, setOTP] = useState("");
  const OTPChange = (newValue) => {
    setOTP(newValue);
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

  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
  };
  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
  };
  useEffect(() => {
    const textFieldElement = document.querySelector(".mdc-1");
    const textFieldElement2 = document.querySelector(".mdc-2");
    if (textFieldElement) {
      const textField = new MDCTextField(textFieldElement);
      const textField2 = new MDCTextField(textFieldElement2);
    }
  }, []);
  let passwordBox;
  let invalidMessage;
  if (isPasswordFocused || hasContent) {
    if (appState == "validLogin") {
      passwordBox = (
        <>
          <div className="container">
            <TextField
              id="outlined-basic"
              label="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
              value={password}
              onChange={handleHasContent}
              disabled
            />
          </div>
        </>
      );
    } else {
      passwordBox = (
        <>
          <div className="container">
            <TextField
              id="outlined-basic"
              label="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
              value={password}
              onChange={handleHasContent}
            />
            <FontAwesomeIcon
              icon={showPassword ? faEye : faEyeSlash}
              onClick={handleTogglePassword}
            />
          </div>
        </>
      );
    }
  } else {
    passwordBox = (
      <>
        <div className="container">
          <TextField
            id="outlined-basic"
            label="Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            onFocus={handlePasswordFocus}
            onBlur={handlePasswordBlur}
            value={password}
            onChange={handleHasContent}
          />
        </div>
      </>
    );
  }
  if (appState == "invalidLogin") {
    console.log("incorrect");
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
      console.log("correct");
      setAppState("validLogin");
    } else {
      setAppState("invalidLogin");
      console.log(appState);
    }
    // Perform any necessary actions, such as sending a request to a server
  };
  if (appState == "validLogin") {
    return (
      <>
        <h1 id="header">Riot Chat Online</h1>
        <TextField
          id="outlined-basic"
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ opacity: "99%" }}
          disabled
        />

        <div className="container" style={{ opacity: "99%" }}>
          {passwordBox}
          {invalidMessage}
          {/*
      <button id="media"><img src="src/assets/Facebook_Logo.png" alt="Facebook"></img></button>
      <button id="media"><img src="src/assets/google_logo.png" alt="Google"></img></button>
      <button id="media"><img src="src/assets/Apple_Logo.png" alt="Apple"></img></button>
      <button id="media"><img src="src/assets/xbox_logo.png" alt="Xbox"></img></button>
    */}
          <input id="SignIn" type="checkbox" disabled />
          <label htmlFor="SignIn">Stay signed in</label>

          <br></br>
          <br></br>
          <button onClick={handleSignIn} disabled>
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
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            height: "38%",
            width: "38%",
            left: "30%",
            top: "30%",
            backgroundColor: "white",
            padding: "1%",
          }}
        >
          <h1>2FA Authentication</h1>
          <MuiOtpInput
            style={{ padding: "0", marginleft: "10%" }}
            length={6}
            value={OTP}
            onChange={
              OTPChange
            } /*Do the oncomplete, no padding, smaller width and center it */
          />
        </div>
      </>
    );
  } else {
    return (
      <>
        <h1 id="header">Riot Chat Online</h1>
        <TextField
          id="outlined-basic"
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div className="container">
          {passwordBox}
          {invalidMessage}
          {/*
      <button id="media"><img src="src/assets/Facebook_Logo.png" alt="Facebook"></img></button>
      <button id="media"><img src="src/assets/google_logo.png" alt="Google"></img></button>
      <button id="media"><img src="src/assets/Apple_Logo.png" alt="Apple"></img></button>
      <button id="media"><img src="src/assets/xbox_logo.png" alt="Xbox"></img></button>
    */}
          <input id="SignIn" type="checkbox" />
          <label htmlFor="SignIn">Stay signed in</label>

          <br></br>
          <br></br>
          <button onClick={handleSignIn}>Sign In</button>
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
            <img src="/src/assets/git.png" alt="View source or report issue" />
          </a>
        </div>
      </>
    );
  }
}

export default App;
