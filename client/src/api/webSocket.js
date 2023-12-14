const baseURL = '//127.0.0.1:300';

export const webSocket = (id, user) => {
    const websocket = new WebSocket(`ws:${baseURL}/ws/:${id}/:${user}`);
    return websocket;
};
