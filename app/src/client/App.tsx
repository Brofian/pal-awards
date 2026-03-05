import "./index.css";
import Home from "@/client/pages/home/Home.tsx";
import useSocketConnection from "@/client/hooks/useSocketConnection.ts";
import useEvent from "@/client/hooks/useEvent.ts";
import clientDataContainer from "@/client/util/ClientDataContainer.ts";
import Auth from "@/client/pages/auth/Auth.tsx";
import "./styles/styles.ts";
import Load from "@/client/pages/load/Load.tsx";

export function App() {
    const isConnected = useSocketConnection();
    const auth = useEvent(clientDataContainer, 'authChanged');

    // show the loading screen, until authentication is ready
    if (undefined === auth) {
        return <Load />
    }

    return auth.isAuthenticated ? (
        // TODO: Implement routing on this level
        <Home isConnected={isConnected}></Home>
    ) : (
        <Auth />
    );
}

export default App;
