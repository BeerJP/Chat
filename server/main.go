package main

import (
	database "server/database"

	fiber "github.com/gofiber/fiber/v2"
	cors "github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {

	chatDb := database.Database()
	httpServer := fiber.New()
	httpServer.Use(cors.New(cors.Config{
		AllowOrigins:     "*",
		AllowHeaders:     "*",
		AllowMethods:     "*",
		AllowCredentials: true,
	}))

	httpServer.Get("/chat", func(c *fiber.Ctx) error {
		result := database.Query(chatDb)
		return c.SendString(result)
	})

	httpServer.Listen(":8000")

}
