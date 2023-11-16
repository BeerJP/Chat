package main

import (
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type Message struct {
	Name      string    `json:"name"`
	Text      string    `json:"text"`
	CreatedAt time.Time `json:"createdAt"`
}

func Database() *gorm.DB {
	dns := "root:@tcp(127.0.0.1)/full-stack-chat?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dns), &gorm.Config{})
	if err != nil {
		fmt.Println("failed to connect to database")
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

	server.Get("/chat", func(c *fiber.Ctx) error {
		var messages []Message
		result := db.Find(&messages)
		if result.Error != nil {
			return c.Status(fiber.StatusInternalServerError).SendString(result.Error.Error())
		}
		return c.JSON(messages)
	})

	server.Post("/message", func(c *fiber.Ctx) error {
		return c.SendString("Success")
	})

	err := server.Listen(":8000")
	if err != nil {
		panic(err)
	}
}
