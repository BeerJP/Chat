package server

import (
	"github.com/gofiber/websocket/v2"
)

type Room struct {
	Name    string
	Members map[*websocket.Conn]bool
}

type Websocket struct {
	Rooms map[string]*Room
}

func NewSocket() *Websocket {
	return &Websocket{
		Rooms: make(map[string]*Room),
	}
}
