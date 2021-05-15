import { useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import classes from "./ProfileForm.module.css";

const ProfileForm = () => {
  const history = useHistory();
  const authCtx = useContext(AuthContext);
  const passwordInputRef = useRef();
  const submitHandler = async (event) => {
    event.preventDefault();
    const password = passwordInputRef.current.value;

    const url =
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAuPo9ISH1lppSVOqtlAlbmeClonSRVGCE";

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        idToken: authCtx.token,
        password,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    var data = await response.json();
    if (!response.ok) {
      console.log(data);
    }

    if (response.ok) {
      const expirationTime = new Date(new Date().getTime() + (+data.expiresIn * 1000));
      authCtx.login(data.idToken, expirationTime.toISOString());
      history.replace("/");
    }
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={passwordInputRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
