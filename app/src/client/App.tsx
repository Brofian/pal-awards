import "./index.css";
import useEvent from "@/client/hooks/useEvent.ts";
import clientSocket from "@/client/util/ClientSocket.ts";
import {translate} from "@/shared/translation/Translation.ts";

export function App() {
    const lastConnectionUpdate = useEvent(clientSocket, 'connection-changed');

    return (
        <div className="max-w-7xl mx-auto p-8 text-center relative z-10">
            <h1 className="text-5xl font-bold my-4 leading-tight">{translate("title")}</h1>
            <p>
                {translate("debug.websocket")}:
                <code className="bg-[#1a1a1a] px-2 py-1 rounded font-mono">
                    {translate(lastConnectionUpdate?.isOpen ? 'debug.connected' : 'debug.disconnected')}
                </code>
            </p>
        </div>
    );
}

export default App;
