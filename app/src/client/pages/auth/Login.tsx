import useEvent from "@/client/hooks/useEvent.ts";
import {type MouseEvent, useCallback, useState} from "react";
import clientSocket from "@/client/util/ClientSocket.ts";
import {translate, type TranslationKey} from "@/shared/translation/Translation.ts";

interface IProps {
}

export default function Login(props: IProps) {
    const [usernameField, setUsernameField] = useState<string>('');
    const [passwordField, setPasswordField] = useState<string>('');
    const [isLoading, setLoading] = useState<boolean>(false);

    const loginResponse = useEvent(clientSocket, 'received-loginResponse', undefined,
        () => setLoading(false));


    const triggerErrorResponse = useCallback((error: TranslationKey) => {
        clientSocket.dispatch('received-loginResponse', {success: false, error });
    }, []);

    const onSubmit = (e: MouseEvent<HTMLButtonElement>) => {
        if (usernameField.length === 0) {
            triggerErrorResponse('auth.login.error.username_empty');
            return
        }
        if (passwordField.length === 0) {
            triggerErrorResponse('auth.login.error.password_empty');
            return
        }

        setLoading(true);
        clientSocket.sendPacket('login', {
            password: passwordField,
            usernameOrEmail: usernameField
        });
        e.preventDefault();
    };

    return (
        <>
            {loginResponse && !loginResponse.success && loginResponse.error &&
                <div className={"text-red-500 mb-4"}>
                    {translate(loginResponse.error)}
                </div>
            }

            <form className={"flex flex-col gap-4"}>
                <div className={"flex flex-col"}>
                    <label htmlFor={"authLoginUsername"}>
                        {translate("auth.login.fields.username_label")}
                    </label>
                    <input id={"authLoginUsername"}
                           placeholder={translate("auth.login.fields.username_placeholder")}
                           value={usernameField}
                           disabled={isLoading}
                           type={"text"}
                           onChange={e => setUsernameField(e.target.value)}/>
                </div>

                <div className={"flex flex-col"}>
                    <label htmlFor={"authLoginPassword"}>
                        {translate("auth.login.fields.password_label")}
                    </label>
                    <input id={"authLoginPassword"}
                           placeholder={translate("auth.login.fields.password_placeholder")}
                           value={passwordField}
                           disabled={isLoading}
                           type={"password"}
                           onChange={e => setPasswordField(e.target.value)}/>
                </div>

                <button type={"submit"}
                        className={"primary-btn mt-4"}
                        onClick={onSubmit}
                        disabled={isLoading}
                >{translate("auth.login.fields.submit_text")}</button>
            </form>
        </>
    );
}