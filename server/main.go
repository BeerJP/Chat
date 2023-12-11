package main

import (
	"github.com/BeerJP/server/database"
	"github.com/BeerJP/server/handlers"
	"github.com/BeerJP/server/server"

	jwtware "github.com/gofiber/contrib/jwt"
	"github.com/gofiber/websocket/v2"
)

func main() {

	app := server.NewServer()
	wsc := server.NewSocket()
	dbc := database.Database()
	hdl := handlers.Catch(wsc, dbc)

	app.Post("/user-regis", hdl.RegisUser)
	app.Post("/user-login", hdl.LoginUser)
	app.Post("/token-get", handlers.TokenGet)
	app.Use("/ws", handlers.WebSocketUpgrade)
	app.Get("/ws/:id", websocket.New(hdl.HandlerSocket))

	app.Use(jwtware.New(server.TokenMdw()))

	app.Get("/token-check", handlers.TokenCheck)
	app.Get("/get-msg/:value", hdl.GetMessages)
	app.Get("/get-user", hdl.GetOnUser)

	app.Listen(":300")

}
