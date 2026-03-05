import "./index.css";
import Home from "@/client/pages/home/Home.tsx";
import useSocketConnection from "@/client/hooks/useSocketConnection.ts";
import useEvent from "@/client/hooks/useEvent.ts";
import clientDataContainer from "@/client/util/ClientDataContainer.ts";
import Auth from "@/client/pages/auth/Auth.tsx";
import "./styles/styles.ts";

export function App() {
    const isConnected = useSocketConnection();
    const auth = useEvent(clientDataContainer, 'authChanged', {
        isAuthenticated: false,
        isVerified: false,
        currentUsername: undefined,
    });

    // TODO: Implement routing on this level
    return auth.isAuthenticated ? (
        <Home isConnected={isConnected}></Home>
    ) : (
        <Auth />
    );
}

export default App;
