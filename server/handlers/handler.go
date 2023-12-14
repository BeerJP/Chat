package handlers

import (
	"sync"

	"github.com/BeerJP/server/server"
	"gorm.io/gorm"
)

type Handler struct {
	WS *server.Websocket
	DB *gorm.DB
	Mu sync.Mutex
}

func Catch(ws *server.Websocket, db *gorm.DB) Handler {
	return Handler{
		WS: ws,
		DB: db,
	}
}
