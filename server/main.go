package main

import (
	"github.com/BeerJP/server/database"
	"github.com/BeerJP/server/handlers"
	"github.com/BeerJP/server/server"
	"github.com/gofiber/websocket/v2"

	jwtware "github.com/gofiber/contrib/jwt"
)

func main() {

	dbc := database.Database()
	hdl := handlers.Catch(dbc)
	app := server.NewServer()
	wsc := server.NewSocket(hdl.DB)

	app.Post("/token-get", server.TokenGet)
	app.Use("/ws", server.WebSocketUpgrade)
	app.Get("/ws/:id", websocket.New(wsc.HandlerSocket))

	app.Use(jwtware.New(server.TokenMdw()))

	app.Get("/token-check", server.TokenCheck)
	app.Get("/get-msg/:value", hdl.GetMessages)
	app.Get("/get-user", hdl.GetOnUser)

	app.Listen(":8000")

}
