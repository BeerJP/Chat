package main

import (
	"github.com/BeerJP/server/database"
	"github.com/BeerJP/server/handlers"
	"github.com/BeerJP/server/server"
	"github.com/gofiber/websocket/v2"
)

func main() {

	dbc := database.Database()
	hdl := handlers.Catch(dbc)
	app := server.NewServer()
	wsc := server.NewSocket(hdl.DB)

	app.Get("/ws", websocket.New(wsc.HandlerSocket))
	app.Get("/get-all", hdl.GetMsgAll)

	app.Listen(":8000")

}
