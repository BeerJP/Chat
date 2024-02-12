package models

import (
	"github.com/gofiber/contrib/websocket"
)

type Member struct {
	Id         string
	Name       string
	Connection *websocket.Conn
}

type Room struct {
	Members map[*websocket.Conn]*Member
}

type ChatWebsocket struct {
	Rooms map[string]*Room
}
