const baseURL = '//127.0.0.1:300';

export const webSocket = (room, id) => {
    const websocket = new WebSocket(`ws:${baseURL}/ws/:${room}/:${id}`);
    return websocket;
};