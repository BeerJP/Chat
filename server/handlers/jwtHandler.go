package handlers

import (
	"time"

	"github.com/BeerJP/server/models"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func TokenGet(ctx *fiber.Ctx) error {
	user := new(models.Users)
	if err := ctx.BodyParser(user); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}
	claims := jwt.MapClaims{
		"name": user.Name,
		"type": user.Type,
		"exp":  time.Now().Add(time.Hour * 1).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	encoded, err := token.SignedString([]byte("secret"))
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}
	return ctx.JSON(fiber.Map{"token": encoded})
}

func TokenCheck(ctx *fiber.Ctx) error {
	user := ctx.Locals("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	name := claims["name"].(string)
	roll := claims["type"].(string)
	return ctx.JSON(fiber.Map{"user": name, "type": roll})
}
