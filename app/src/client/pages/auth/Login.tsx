import useEvent from "@/client/hooks/useEvent.ts";
import clientDataContainer from "@/client/util/ClientDataContainer.ts";
import {useState, type MouseEvent} from "react";
import clientSocket from "@/client/util/ClientSocket.ts";
import {translate} from "@/shared/translation/Translation.ts";

interface IProps {
}

export default function Login(props: IProps) {
    const auth = useEvent(clientDataContainer, 'authChanged');
    const loginResponse = useEvent(clientSocket, 'received-loginResponse');

    const [usernameField, setUsernameField] = useState<string>('');
    const [passwordField, setPasswordField] = useState<string>('');

    const onSubmit = (e: MouseEvent<HTMLButtonElement>) => {
        clientSocket.sendPacket('login', {
            password: passwordField,
            usernameOrEmail: usernameField
        });
        e.preventDefault();
    };

    return (
        <div className="max-w-7xl mx-auto p-8 text-center relative z-10">
            <h1 className="text-5xl font-bold my-4 leading-tight">Login</h1>
            <p>
                Status: {(auth === undefined) ? 'not changed' : auth.currentUsername}
            </p>
            <div>
                {loginResponse && !loginResponse.success && loginResponse.error &&
                    <div className={"text-red-500"}>
                        {translate(loginResponse.error)}
                    </div>
                }

                <form>
                    <label>
                        <input className={"bg-neutral-700"}
                               placeholder={"Username"}
                               value={usernameField}
                               onChange={e => setUsernameField(e.target.value)} />
                    </label>
                    <br />
                    <label>
                        <input className={"bg-neutral-700"}
                               placeholder={"Passwort"}
                               value={passwordField}
                               onChange={e => setPasswordField(e.target.value)} />
                    </label>
                    <br />
                    <button type={"submit"} onClick={onSubmit}>Login</button>
                </form>
            </div>
        </div>
    );
}