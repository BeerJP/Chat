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

func (socket *Handler) CreateRoom(roomName string) {
	if _, exists := socket.WS.Rooms[roomName]; !exists {
		socket.WS.Rooms[roomName] = &server.Room{
			Name:    roomName,
			Members: make(map[*websocket.Conn]bool),
		}
	}
}

func (socket *Handler) JoinRoom(roomName string, ctx *websocket.Conn) {
	socket.Mu.Lock()
	defer socket.Mu.Unlock()

	room, exists := socket.WS.Rooms[roomName]
	if !exists {
		socket.CreateRoom(roomName)
		room = socket.WS.Rooms[roomName]
	}
	room.Members[ctx] = true
}

func (socket *Handler) OutRoom(roomName string, ctx *websocket.Conn) {
	socket.Mu.Lock()
	defer socket.Mu.Unlock()

	room, exists := socket.WS.Rooms[roomName]
	if exists {
		delete(room.Members, ctx)
	}
}

func (socket *Handler) SendMessage(roomName string, message []byte, target string) {
	socket.Mu.Lock()
	defer socket.Mu.Unlock()

	room, exists := socket.WS.Rooms[roomName]
	if exists {
		if target == "main" {
			for conn := range room.Members {
				if err := conn.WriteMessage(websocket.TextMessage, message); err != nil {
					break
				}
			}
		} else {
			for conn := range room.Members {
				if strings.Trim(conn.Params("name"), ":") == target {
					if err := conn.WriteMessage(websocket.TextMessage, message); err != nil {
						break
					}
				}
			}
		}
	}
}

func (socket *Handler) HandlerSocket(ctx *websocket.Conn) {
	defer ctx.Close()

	userType := strings.Trim(ctx.Params("id"), ":")
	userName := strings.Trim(ctx.Params("name"), ":")

	socket.JoinRoom("main", ctx)
	jsonData, _ := json.Marshal(models.Member{
		Online: len(socket.WS.Rooms["main"].Members) / 2,
	})
	socket.SendMessage("main", jsonData, "main")

	go func() {
		if userType == "true" {
			response := models.Users{
				Name: userName,
			}
			if err := socket.DB.Model(&response).Where("name = ?", response.Name).Update("state", "1").Error; err != nil {
				log.Println("database error:", err)
				return
			}
		}
	}()

	for {
		var message models.Messages
		if err := ctx.ReadJSON(&message); err != nil {
			break
		}
		target := string(message.Target)

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

		response, _ := json.Marshal(models.MessageResponse{
			Name:   message.Name,
			Text:   message.Text,
			Date:   time.Now().Format("2006-01-02"),
			Time:   time.Now().Format("15:04"),
			Target: message.Target,
		})

		socket.SendMessage("main", response, target)
	}

	go func() {
		if userType == "true" {
			response := models.Users{
				Name: userName,
			}
			if err := socket.DB.Model(&response).Where("name = ?", response.Name).Update("state", "0").Error; err != nil {
				log.Println("database error:", err)
				return
			}
		}
	}()

	socket.OutRoom("main", ctx)
	jsonData, _ = json.Marshal(models.Member{
		Online: len(socket.WS.Rooms["main"].Members) / 2,
	})
	socket.SendMessage("main", jsonData, "main")

}
