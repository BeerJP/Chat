package main

import (
	"fmt"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var Db *gorm.DB

type Messages struct {
	Name string    `json:"name"`
	Text string    `json:"text"`
	Time time.Time `json:"time"`
}

// func getMessage(c *fiber.Ctx) error {
// 	var message []Messages
// 	result := Db.Find(&message)
// 	return c.JSON()
// }

// func addMessage(c *fiber.Ctx) error {
// 	messages := Messages{
// 		Name: "Beer",
// 		Text: "Hello",
// 		Time: time.Now(),
// 	}
// 	result := Db.Create(&messages)
// 	if result.Error != nil {
// 		fmt.Println("failed...")
// 	}
// 	return nil
// }

func conn() {
	Db, err := gorm.Open(mysql.Open("root:@(127.0.0.1)/full-stack-chat"), &gorm.Config{})
	if err != nil {
		fmt.Println("MySQL Is Not Connected")
	}
	Db.AutoMigrate(&Messages{})
}

func main() {

	conn()
	// app := fiber.New()
	// app.Use(cors.New(cors.Config{
	// 	AllowOrigins:     "*",
	// 	AllowHeaders:     "*",
	// 	AllowMethods:     "*",
	// 	AllowCredentials: true,
	// }))

	messages := Messages{
		Name: "Beer",
		Text: "Hello",
		Time: time.Now(),
	}
	result := Db.Create(&messages)
	if result.Error != nil {
		fmt.Println("failed...")
	}

	// app.Get("/chat")
	// app.Post("/message", addMessage)

	// err := app.Listen(":8000")
	// if err != nil {
	// 	panic(err)
	// }

}
