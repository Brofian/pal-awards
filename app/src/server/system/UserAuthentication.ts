import authentication from "@/server/authentication/Authentication.ts";
import serverSocketHandler from "@/server/util/ServerSocketHandler.ts";
import mailer from "@/server/mail/Mailer.ts";
import {translate} from "@/shared/translation/Translation.ts";
import {createLocalUrl} from "@/server/util/LinkHelper.ts";
import {AUTH_COOKIE_NAME} from "@/shared/socket/Cookies.ts";
import Logger from "@/server/util/Logger.ts";

export function userAuthenticationHandler(): void {

    // authentication on connection
    serverSocketHandler.on("connectionSetup", async (connectionEvent) => {
        if (!connectionEvent.detail) return;
        const {ws} = connectionEvent.detail;

        const cookies = ws.data.requestCookies;
        const authToken = cookies.get(AUTH_COOKIE_NAME);
        if (authToken) {
            const result = await authentication.authenticateToken(authToken);
            if (result.authenticated) {
                Logger.debug(`${ws.data.connectionUUID} authenticated as ${result.username}`);
            }
            else {
                Logger.debug(`${ws.data.connectionUUID} failed token authentication`);
            }

            ws.data.authenticationData = result;
            // notify the client
            serverSocketHandler.sendPacketToSocket(ws, 'authenticationChanged', result.authenticated ? {
                authenticated: true,
                verified: result.verified,
                username: result.username,
                authToken: authToken,
            } : {
                authenticated: false
            });

            if (ws.data.authenticationData.authenticated) {
                serverSocketHandler.dispatch('userAuthenticated', {ws: ws});
            }
        }
    });

    // login
    serverSocketHandler.on('received-login', async (loginEvent) => {
        if (!loginEvent.detail) return;
        const {ws, data} = loginEvent.detail;

        if (ws.data.authenticationData.authenticated) {
            return;
        }

        const loginResult = await authentication.attemptUserLogin(data.usernameOrEmail, data.password);
        const success = undefined !== loginResult?.user;
        if (success) {
            Logger.debug(`${ws.data.connectionUUID} logged in as ${data.usernameOrEmail}`);
        }

        serverSocketHandler.sendPacketToSocket(ws, 'loginResponse', success ? {
            success: true,
        } : {
            success: false,
            error: 'auth.login.error.failed'
        });

        if (success && loginResult) {
            serverSocketHandler.sendPacketToSocket(ws, 'authenticationChanged', {
                authenticated: true,
                verified: loginResult.user.verified,
                username: loginResult.user.username,
                authToken: loginResult.token,
                authTokenTTL: loginResult.tokenTTL
            });

            if (ws.data.authenticationData.authenticated) {
                serverSocketHandler.dispatch('userAuthenticated', {ws: ws});
            }
        }
    });

    // registration
    serverSocketHandler.on('received-register', async (registerEvent) => {
        if (!registerEvent.detail) return;
        const {ws, data} = registerEvent.detail;

        if (ws.data.authenticationData.authenticated) {
            return;
        }

        const registrationResult = await authentication.attemptRegistration(
            data.email,
            data.username,
            data.password,
        );

        if (registrationResult.success) {
            serverSocketHandler.sendPacketToSocket(ws, 'registrationResponse', {
                success: true,
            });

            serverSocketHandler.sendPacketToSocket(ws, 'authenticationChanged', {
                authenticated: true,
                verified: registrationResult.user.verified,
                username: registrationResult.user.username,
                authToken: registrationResult.authToken,
                authTokenTTL: registrationResult.authTokenTTL
            });

            if (ws.data.authenticationData.authenticated) {
                serverSocketHandler.dispatch('userAuthenticated', {ws: ws});
            }

            const mailTranslationData = {
                username: data.username,
                verificationLink: createLocalUrl(`/verification/${registrationResult.verificationToken}`),
            }

            mailer.sendMail({
                receiver: data.email,
                subject: translate('mail.verification.subject', mailTranslationData),
                contentText: translate('mail.verification.contentPlain', mailTranslationData),
                contentHTML: translate('mail.verification.contentHTML', mailTranslationData),
            });

            Logger.debug(`${ws.data.connectionUUID} registered as ${data.username}`);
        } else {
            serverSocketHandler.sendPacketToSocket(ws, 'registrationResponse', {
                success: false,
                error: registrationResult.error
            });
        }
    });
}