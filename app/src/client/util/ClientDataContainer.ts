import clientSocket from "@/client/util/ClientSocket.ts";
import type {ServerToClientPackets} from "@/shared/socket/packets/ServerToClientPackets.ts";
import {getCookie, setCookie} from "typescript-cookie";
import {AUTH_COOKIE_NAME} from "@/shared/socket/Cookies.ts";
import SimpleEventTarget from "@/shared/events/SimpleEventTarget.ts";

type ClientDataEvents = {
    "authChanged": {
        isAuthenticated: boolean,
        isVerified: boolean,
        currentUsername?: string
    }
}

/**
 * A place to store and access long living client information that was received from the server
 */
class ClientDataContainer extends SimpleEventTarget<ClientDataEvents>{
    public isAuthenticated: boolean = false;
    public isVerified: boolean = false;
    public currentUsername?: string = undefined;

    constructor() {
        super();
        clientSocket.on('received-authenticationChanged', this.onAuthenticationChanged.bind(this));
    }

    private onAuthenticationChanged(event: CustomEventInit<ServerToClientPackets['authenticationChanged']>): void {
        if (!event.detail) return;

        this.isAuthenticated = event.detail.authenticated;
        if (event.detail.authenticated) {
            const authToken = event.detail.authToken;
            const authTokenTTL = event.detail.authTokenTTL || 0;
            if (authTokenTTL && getCookie(AUTH_COOKIE_NAME) !== authToken) {
                const authCookieExpiration = new Date(new Date().getTime() + authTokenTTL)
                setCookie(AUTH_COOKIE_NAME, authToken, {
                    expires: authCookieExpiration,
                    sameSite: "strict",
                    path: "/",
                });
            }
            this.currentUsername = event.detail.username;
            this.isVerified = event.detail.verified;
        }
        else {
            this.currentUsername = undefined;
            this.isVerified = false;
        }

        this.dispatch('authChanged', {
            isAuthenticated: this.isAuthenticated,
            isVerified: this.isVerified,
            currentUsername: this.currentUsername
        });
    }


}

const clientDataContainer = new ClientDataContainer();
export default clientDataContainer;