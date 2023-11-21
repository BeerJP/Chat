const baseURL = '//127.0.0.1:8000';

export const webSocket = (id) => {
    const websocket = new WebSocket(`ws:${baseURL}/ws/:${id}`);
    return websocket;
};