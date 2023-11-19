package server

import (
	"encoding/json"
	"log"
	"time"

	"github.com/BeerJP/server/models"
	"github.com/gofiber/websocket/v2"
	"gorm.io/gorm"
)

type Websocket struct {
	room map[*websocket.Conn]bool
	DB   *gorm.DB
}

func NewSocket(db *gorm.DB) *Websocket {
	return &Websocket{
		room: make(map[*websocket.Conn]bool),
		DB:   db,
	}
}

func (socket *Websocket) HandlerSocket(ctx *websocket.Conn) {
	defer ctx.Close()
	socket.room[ctx] = true
	defer delete(socket.room, ctx)
	for {
		var message models.Messages
		if err := ctx.ReadJSON(&message); err != nil {
			log.Println("read:", err)
			break
		}

		go func(msg models.Messages) {
			result := socket.DB.Create(&models.Messages{
				Name: msg.Name,
				Text: msg.Text,
			})
			if result.Error != nil {
				log.Println("database error:", result.Error)
				return
			}
		}(message)

		response := models.MessageResponse{
			Name: message.Name,
			Text: message.Text,
			Date: time.Now().Format("2006-01-02"),
			Time: time.Now().Format("15:04"),
		}

		jsonData, err := json.Marshal(response)
		if err != nil {
			log.Println("json marshal error:", err)
			break
		}

		for conn := range socket.room {
			if conn != nil {
				if err := conn.WriteMessage(websocket.TextMessage, jsonData); err != nil {
					log.Println("write:", err)
					break
				}
			}
		}
	}
}
