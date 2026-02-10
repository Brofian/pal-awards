import {translate} from "@/shared/translation/Translation.ts";
import useSocketFetch from "@/client/hooks/useSocketFetch.ts";

interface IProps {
    isConnected: boolean
}

export default function Home(props: IProps) {
    // request some data from the server
    const lastPong = useSocketFetch("ping", {num: 42}, "pong", {
        num: -1
    });

    return (
        <div className="max-w-7xl mx-auto p-8 text-center relative z-10">
            <h1 className="text-5xl font-bold my-4 leading-tight">{translate("title")}</h1>
            <p>
                {translate("debug.websocket")}:
                <code className="bg-[#1a1a1a] px-2 py-1 rounded font-mono">
                    {translate(props.isConnected ? 'debug.connected' : 'debug.disconnected')}
                </code>
            </p>
            <p>
                Last Pong value: {lastPong.num}
            </p>
        </div>
    );
}