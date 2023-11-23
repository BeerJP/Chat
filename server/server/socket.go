package server

import (
	"github.com/gofiber/websocket/v2"
)

type Websocket struct {
	Room map[*websocket.Conn]bool
}

func NewSocket() *Websocket {
	return &Websocket{
		Room: make(map[*websocket.Conn]bool),
	}
}
