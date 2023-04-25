import { useEffect } from 'react';
import { config } from '../config/config';
import { StockData } from '../interfaces/StockData';

function getSocket(key: string, onMessage: Function): WebSocket {
    const url = `wss://wstest.fxempire.com?token=${config.webSocketToken}`;
    const webSocket = new WebSocket(url);
    webSocket.onopen = e => webSocket.send(JSON.stringify({ type: "SUBSCRIBE", instruments: [key] }));
    webSocket.onmessage = e => onMessage(JSON.parse(e.data)[key] as StockData);
    return webSocket;
}

export function GetSocketEffect(key: string, handler: Function) {
    useEffect(() => {
        const socket = getSocket(key, (ev: any) => handler(ev));
        return () => {
            if (socket.readyState === WebSocket.OPEN)
                socket.close();
        }
    }, [])
}