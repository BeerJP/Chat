package handlers

import (
	"encoding/json"
	"log"
	"strings"
	"time"

	"github.com/BeerJP/server/models"
	"github.com/BeerJP/server/server"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
)

func WebSocketUpgrade(ctx *fiber.Ctx) error {
	if websocket.IsWebSocketUpgrade(ctx) {
		ctx.Locals("allowed", true)
		return ctx.Next()
	}
	return fiber.ErrUpgradeRequired
}

func sendUserMessage(socket *server.Websocket, data interface{}) {
	jsonData, err := json.Marshal(data)
	if err != nil {
		log.Println("json marshal error:", err)
		return
	}
	for conn := range socket.Room {
		if conn != nil {
			if err := conn.WriteMessage(websocket.TextMessage, jsonData); err != nil {
				log.Println("write:", err)
				break
			}
		}
	}
}

func (socket Handler) HandlerSocket(ctx *websocket.Conn) {
	defer ctx.Close()

	name := strings.Trim(ctx.Params("id"), ":")
	if name == "" {
		return
	}

	go func() {
		response := models.Users{
			State: "1",
			Name:  name,
		}
		if err := socket.DB.Save(&response).Error; err != nil {
			log.Println("database error:", err)
			return
		}
		sendUserMessage(socket.WS, response)
	}()

	socket.WS.Room[ctx] = true

	for {
		var message models.Messages
		if err := ctx.ReadJSON(&message); err != nil {
			log.Println("read:", err)
			break
		}

		go func(msg models.Messages) {
			if err := socket.DB.Create(&models.Messages{
				Name: msg.Name,
				Text: msg.Text,
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
		sendUserMessage(socket.WS, response)
	}

	go func() {
		response := models.Users{
			State: "0",
			Name:  name,
		}
		if err := socket.DB.Where("name = ?", name).Delete(&response).Error; err != nil {
			log.Println("database error:", err)
			return
		}
		sendUserMessage(socket.WS, response)
	}()

	delete(socket.WS.Room, ctx)
}
