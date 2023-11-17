package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/signal"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/websocket/v2"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type Message struct {
	Name      string    `json:"name"`
	Text      string    `json:"text"`
	CreatedAt time.Time `json:"createdAt"`
}

type MessageResponse struct {
	Name string `json:"name"`
	Text string `json:"text"`
	Date string `json:"date"`
	Time string `json:"time"`
}

func Database() *gorm.DB {
	dns := "root:@tcp(127.0.0.1)/full-stack-chat?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dns), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	db.AutoMigrate(&Message{})
	return db
}

func main() {

	db := Database()
	server := fiber.New()
	server.Use(cors.New(cors.Config{
		AllowOrigins:     "*",
		AllowHeaders:     "*",
		AllowMethods:     "*",
		AllowCredentials: true,
	}))

	connections := make(map[*websocket.Conn]bool)

	// server.Post("/chat/add", func(c *fiber.Ctx) error {
	// 	var message Message
	// 	if err := c.BodyParser(&message); err != nil {
	// 		return err
	// 	}
	// 	result := db.Create(&message)
	// 	if result.Error != nil {
	// 		return c.Status(fiber.StatusInternalServerError).SendString(result.Error.Error())
	// 	}
	// 	return c.SendString("Success")
	// })

	server.Get("/chat/get", func(c *fiber.Ctx) error {
		var messages []Message
		result := db.Find(&messages)
		if result.Error != nil {
			return c.Status(fiber.StatusInternalServerError).SendString(result.Error.Error())
		}
		var response []MessageResponse
		for _, m := range messages {
			response = append(response, MessageResponse{
				Name: m.Name,
				Text: m.Text,
				Date: m.CreatedAt.Format("2006-01-02"),
				Time: m.CreatedAt.Format("15:04"),
			})
		}
		return c.JSON(response)
	})

	server.Get("/chat/websocket", websocket.New(func(c *websocket.Conn) {
		defer c.Close()
		connections[c] = true
		defer delete(connections, c)
		for {
			var message Message
			if err := c.ReadJSON(&message); err != nil {
				log.Println("read:", err)
				break
			}

			result := db.Create(&Message{
				Name: message.Name,
				Text: message.Text,
			})
			if result.Error != nil {
				log.Println("database error:", result.Error)
				break
			}

			response := MessageResponse{
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

			for conn := range connections {
				if conn != nil {
					if err := conn.WriteMessage(websocket.TextMessage, jsonData); err != nil {
						log.Println("write:", err)
						break
					}
				}
			}
		}
	}))

	err := server.Listen(":8000")
	if err != nil {
		panic(err)
	}

	ch := make(chan os.Signal, 1)
	signal.Notify(ch, os.Interrupt)
	<-ch

	fmt.Println("\nShutting down server...")
	if err := server.Shutdown(); err != nil {
		fmt.Println("Server shutdown error:", err)
	}
	fmt.Println("Server exiting")
}
