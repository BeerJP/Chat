package handlers

import (
	"encoding/json"
	"log"
	"strings"
	"time"

	"github.com/BeerJP/server/models"
	"github.com/BeerJP/server/server"

	"github.com/gofiber/websocket/v2"
)

func (socket Handler) CreateRoom(roomName string) {
	if _, exists := socket.WS.Rooms[roomName]; !exists {
		socket.WS.Rooms[roomName] = &server.Room{
			Name:    roomName,
			Members: make(map[*websocket.Conn]bool),
		}
	}
}

func (socket Handler) JoinRoom(roomName string, ctx *websocket.Conn) {
	room, exists := socket.WS.Rooms[roomName]
	if !exists {
		socket.CreateRoom(roomName)
		room = socket.WS.Rooms[roomName]
	}
	room.Members[ctx] = true
}

func (socket Handler) SendMessage(roomName string, data interface{}) {
	room, exists := socket.WS.Rooms[roomName]
	jsonData, err := json.Marshal(data)
	if err != nil {
		log.Println("json marshal error:", err)
		return
	}
	if exists {
		for conn := range room.Members {
			if err := conn.WriteMessage(websocket.TextMessage, jsonData); err != nil {
				log.Println("write:", err)
				break
			}
		}
	}
}

func (socket Handler) HandlerSocket(ctx *websocket.Conn) {
	defer ctx.Close()
	roomName := strings.Trim(ctx.Params("room"), ":")
	userName := strings.Trim(ctx.Params("name"), ":")
	socket.JoinRoom(roomName, ctx)

	if len(userName) >= 5 && userName[:5] == " Guest" {
		var user []models.Users
		request := socket.DB.Where("state = 1").Find(&user).RowsAffected
		member := len(socket.WS.Rooms["main"].Members) - int(request)
		log.Println("Guest:", member)
	} else {
		go func() {
			response := models.Users{
				Name: userName,
			}
			if err := socket.DB.Model(&response).Where("name = ?", response.Name).Update("state", "1").Error; err != nil {
				log.Println("database error:", err)
				return
			}
		}()
	}

	for {
		var message models.Messages
		if err := ctx.ReadJSON(&message); err != nil {
			log.Println("read:", err)
			break
		}

		go func(msg models.Messages) {
			if err := socket.DB.Create(&models.Messages{
				Name:   msg.Name,
				Text:   msg.Text,
				Target: msg.Target,
			}).Error; err != nil {
				log.Println("database error:", err)
				return
			}
		}(message)

		response := models.MessageResponse{
			Name: message.Name,
			Text: message.Text,
			Date: time.Now().Format("2006-01-02"),
			Time: time.Now().Format("15:04"),
		}

		socket.SendMessage(roomName, response)
	}

	if len(userName) >= 5 && userName[:5] == " Guest" {
		log.Println("Guest: Delete")
	} else {
		go func() {
			response := models.Users{
				Name: userName,
			}
			if err := socket.DB.Model(&response).Where("name = ?", response.Name).Update("state", "0").Error; err != nil {
				log.Println("database error:", err)
				return
			}
		}()
	}

}
