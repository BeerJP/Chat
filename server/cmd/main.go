package main

import (
	config "github.com/BeerJP/Chat/configs"
	"github.com/BeerJP/Chat/src/core"
	"github.com/BeerJP/Chat/src/database"
	"github.com/BeerJP/Chat/src/handlers"

	jwtware "github.com/gofiber/contrib/jwt"
	"github.com/gofiber/contrib/websocket"
)

func main() {
	app := core.NewServer()
	wsc := core.NewChatSocket()
	dbc := database.Database()
	hdl := handlers.Catch(wsc, dbc)

	app.Post("/beerjp-chat/user-regis", hdl.RegisUser)
	app.Post("/beerjp-chat/user-login", hdl.LoginUser)

	app.Use(jwtware.New(core.TokenMdw()))

	app.Post("/beerjp-chat/user-rename", hdl.RenameUser)
	app.Post("/beerjp-chat/refresh-token", handlers.RefreshToken)
	app.Use("/beerjp-chat/ws", handlers.WebSocketUpgrade)
	app.Get("/beerjp-chat/ws/:user/:name", websocket.New(hdl.HandlerSocket))
	app.Get("/beerjp-chat/get-msg/:user/:target", hdl.GetMessages)

	app.Listen(config.Port)
}
