package core

import "github.com/BeerJP/Chat/src/models"

func NewChatSocket() *models.ChatWebsocket {
	return &models.ChatWebsocket{
		Rooms: make(map[string]*models.Room),
	}
}
