import "./index.css";
import Home from "@/client/pages/home/Home.tsx";
import useSocketConnection from "@/client/hooks/useSocketConnection.ts";

export function App() {
    const isConnected = useSocketConnection();

    // TODO: Implement routing on this level
    return (
        <Home isConnected={isConnected}></Home>
    );
}

export default App;
