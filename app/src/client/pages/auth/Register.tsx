import useEvent from "@/client/hooks/useEvent.ts";
import {type MouseEvent, useCallback, useState} from "react";
import clientSocket from "@/client/util/ClientSocket.ts";
import {translate, type TranslationKey} from "@/shared/translation/Translation.ts";

interface IProps {
}

export default function Register(props: IProps) {
    const [usernameField, setUsernameField] = useState<string>('');
    const [emailField, setEmailField] = useState<string>('');
    const [passwordField, setPasswordField] = useState<string>('');
    const [isLoading, setLoading] = useState<boolean>(false);

    const registrationResponse = useEvent(clientSocket, 'received-registrationResponse', undefined,
        () => setLoading(false));

    const triggerErrorResponse = useCallback((error: TranslationKey) => {
        clientSocket.dispatch('received-registrationResponse', { success: false, error });
    }, []);

    const validatePassword = (): boolean => {
        if (passwordField.length < 3) {
            return false;
        }
        return true;
    }

    const onSubmit = (e: MouseEvent<HTMLButtonElement>) => {
        if (usernameField.length === 0) {
            triggerErrorResponse('auth.registration.error.username_empty');
            return
        }
        if (emailField.length === 0) {
            triggerErrorResponse('auth.registration.error.email_empty');
            return
        }
        if (passwordField.length === 0) {
            triggerErrorResponse('auth.registration.error.password_empty');
            return
        }
        if (!validatePassword()) {
            triggerErrorResponse("auth.registration.error.password_malformed");
            return;
        }

        setLoading(true);
        clientSocket.sendPacket('register', {
            password: passwordField,
            email: emailField,
            username: usernameField
        });
        e.preventDefault();
    };

    return (
        <>
            {registrationResponse && !registrationResponse.success && registrationResponse.error &&
                <div className={"text-red-500 mb-4"}>
                    {translate(registrationResponse.error)}
                </div>
            }

            <form className={"flex flex-col gap-4"}>

                <div className={"flex flex-col"}>
                    <label htmlFor={"authRegisterEmail"}>
                        {translate("auth.registration.fields.email_label")}
                    </label>
                    <input id={"authRegisterEmail"}
                           placeholder={translate("auth.registration.fields.email_placeholder")}
                           value={emailField}
                           disabled={isLoading}
                           type={"text"}
                           onChange={e => setEmailField(e.target.value)}/>
                </div>

                <div className={"flex flex-col"}>
                    <label htmlFor={"authRegisterUsername"}>
                        {translate("auth.registration.fields.username_label")}
                    </label>
                    <input id={"authRegisterUsername"}
                           placeholder={translate("auth.registration.fields.username_placeholder")}
                           value={usernameField}
                           disabled={isLoading}
                           type={"text"}
                           onChange={e => setUsernameField(e.target.value)}/>
                </div>


                <div className={"flex flex-col"}>
                    <label htmlFor={"authRegisterPassword"}>
                        {translate("auth.registration.fields.password_label")}
                    </label>
                    <input id={"authRegisterPassword"}
                           placeholder={translate("auth.registration.fields.password_placeholder")}
                           value={passwordField}
                           disabled={isLoading}
                           type={"password"}
                           onChange={e => setPasswordField(e.target.value)}
                           onBlur={_ => {
                               if (!validatePassword()) {
                                   triggerErrorResponse("auth.registration.error.password_malformed");
                               }
                           }}
                    />
                </div>

                <button type={"submit"}
                        className={"primary-btn mt-4"}
                        onClick={onSubmit}
                        disabled={isLoading}
                >{translate("auth.registration.fields.submit_text")}</button>
            </form>
        </>
    );
}