import { GoogleLogin } from "react-google-login";

export default function Login() {

    async function onSuccess(res) {
        console.log("Login successful", res.profileObj)
        fetch("http://localhost:3001", {
            method: "POST",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(res.profileObj)
        });
    }

    function onFaliure(res) {
        console.log("Login unsuccessful", res);
    }

    return (
        <>
            <h1>Login</h1>
            <GoogleLogin
                clientId="179923541658-kfl4lp6lgd1nur0pk5vnqsb3d2hg49e6.apps.googleusercontent.com"
                buttonText="Login"
                onSuccess={onSuccess}
                onFailure={onFaliure}
                cookiePolicy={'single_host_origin'}
            />
        </>
    )
}
