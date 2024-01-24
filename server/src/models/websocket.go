package models

import (
	"github.com/gofiber/contrib/websocket"
)

type Member struct {
	Name       string
	Connection *websocket.Conn
}

type Room struct {
	Members map[string]*Member
}

type ChatWebsocket struct {
	Rooms map[string]*Room
}
