const baseURL = '//127.0.0.1:8000';

export const webSocket = () => {
    const websocket = new WebSocket(`ws:${baseURL}/chat/websocket`);
    return websocket;
};