package handlers

import (
	"encoding/json"
	"time"

	"github.com/BeerJP/Chat/src/models"
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
)

func WebSocketUpgrade(ctx *fiber.Ctx) error {
	if websocket.IsWebSocketUpgrade(ctx) {
		ctx.Locals("allowed", true)
		return ctx.Next()
	}
	return fiber.ErrUpgradeRequired
}

func (socket *Handler) JoinRoom(roomName string, ctx *websocket.Conn, member *models.Member) {
	socket.Mu.Lock()
	defer socket.Mu.Unlock()
	room, exists := socket.WS.Rooms[roomName]
	if !exists {
		room = &models.Room{
			Members: make(map[*websocket.Conn]*models.Member),
		}
		socket.WS.Rooms[roomName] = room
	}
	room.Members[ctx] = member
}

func (socket *Handler) OutRoom(roomName string, ctx *websocket.Conn) {
	socket.Mu.Lock()
	defer socket.Mu.Unlock()
	if room, exists := socket.WS.Rooms[roomName]; exists {
		delete(room.Members, ctx)
	}
}

func (socket *Handler) SendMessage(roomName string, message []byte, target string, sender string) {
	socket.Mu.Lock()
	defer socket.Mu.Unlock()
	room, exists := socket.WS.Rooms[roomName]
	if exists {
		if target == "main" {
			for _, conn := range room.Members {
				_ = conn.Connection.WriteMessage(websocket.TextMessage, message)
			}
		} else {
			for _, conn := range room.Members {
				if conn.Id == target {
					_ = conn.Connection.WriteMessage(websocket.TextMessage, message)
				}
			}
		}
	}
}

func (socket *Handler) OnlineUser(roomName string) {
	socket.Mu.Lock()
	defer socket.Mu.Unlock()
	room, exists := socket.WS.Rooms[roomName]
	data := make(map[string]struct{})
	var response []models.OnlineUser
	if exists {
		for _, conn := range room.Members {
			if _, found := data[conn.Id]; !found {
				data[conn.Id] = struct{}{}
				response = append(response, models.OnlineUser{
					Id:   conn.Id,
					Name: conn.Name,
				})
			}
		}
		for _, conn := range room.Members {
			_ = conn.Connection.WriteJSON(response)
		}
	}
}

func (socket *Handler) HandlerSocket(ctx *websocket.Conn) {
	defer ctx.Close()
	userId := ctx.Params("user")
	userName := ctx.Params("name")
	socket.JoinRoom("main", ctx, &models.Member{
		Id:         userId,
		Name:       userName,
		Connection: ctx,
	})
	socket.OnlineUser("main")
	for {
		var message models.Messages
		if err := ctx.ReadJSON(&message); err != nil {
			break
		}
		go func(msg models.Messages) {
			socket.AddMessages(&msg)
		}(message)
		target := string(message.Target)
		response, _ := json.Marshal(models.MessageResponse{
			Name:   message.Name,
			Text:   message.Text,
			Date:   time.Now().Format("2006-01-02"),
			Time:   time.Now().Format("15:04"),
			Target: message.Target,
		})
		socket.SendMessage("main", response, target, userName)
	}
	socket.OutRoom("main", ctx)
	socket.OnlineUser("main")
}
