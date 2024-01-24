package handlers

import (
	"sync"

	"cloud.google.com/go/firestore"
	"github.com/BeerJP/Chat/src/models"
)

type Handler struct {
	WS *models.ChatWebsocket
	DB *firestore.Client
	Mu sync.Mutex
}

func Catch(ws *models.ChatWebsocket, db *firestore.Client) Handler {
	return Handler{
		WS: ws,
		DB: db,
	}
}
