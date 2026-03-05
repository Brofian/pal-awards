import {useState} from "react";
import {translate} from "@/shared/translation/Translation.ts";
import Login from "@/client/pages/auth/Login.tsx";
import Register from "@/client/pages/auth/Register.tsx";

interface IProps {
}

export default function Auth(props: IProps) {
    const [isLoginView, setLoginView] = useState<boolean>(true);

    const switchView = () => setLoginView(!isLoginView);

    return (
        <div className="w-full p-8 flex justify-center">

            <div className={"max-w-full w-96"}>
                <h1 className="font-bold">
                    {translate(isLoginView ? 'auth.login.title' : 'auth.registration.title')}
                </h1>

                <div>
                    {isLoginView ? <Login /> : <Register />}
                </div>

                <div className={"text-right mt-4 text-sm"}>
                    <a className={""}
                       onClick={switchView}
                    >{translate(isLoginView ? 'auth.login.register_instead' : 'auth.registration.login_instead')}</a>
                </div>
            </div>

        </div>
    );
}