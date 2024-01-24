package handlers

import (
	"time"

	config "github.com/BeerJP/Chat/configs"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func NewToken(ctx *fiber.Ctx, username string, nickname string) error {
	claims := jwt.MapClaims{
		"id":   username,
		"name": nickname,
		"exp":  time.Now().Add(time.Hour * 1).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	encoded, err := token.SignedString([]byte(config.Secret))
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}
	return ctx.JSON(fiber.Map{"name": nickname, "user": username, "token": encoded})
}

func RefreshToken(ctx *fiber.Ctx) error {
	token := ctx.Locals("user").(*jwt.Token)
	claims := token.Claims.(jwt.MapClaims)
	claims["exp"] = time.Now().Add(time.Hour * 1).Unix()
	return ctx.SendString("OK")
}
