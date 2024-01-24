package handlers

import (
	"context"
	"strings"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/BeerJP/Chat/src/models"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) string {
	bytes, _ := bcrypt.GenerateFromPassword([]byte(password), 10)
	return string(bytes)
}

func CheckPassword(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func (handler *Handler) LogConnected(port string, username string) {
	conn := context.Background()
	_, _, err := handler.DB.Collection("connected").Add(conn, map[string]interface{}{
		"name": username,
		"port": port,
		"time": time.Now(),
	})
	if err != nil {
		return
	}
}

func (handler *Handler) RenameUser(ctx *fiber.Ctx) error {
	user := new(models.User_Res)
	if err := ctx.BodyParser(user); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}
	conn := context.Background()
	iter, err := handler.DB.Collection("users").Where("username", "==", strings.ToLower(user.Username)).Documents(conn).GetAll()
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).SendString("Database error")
	}
	if len(iter) > 0 {
		docRef := iter[0].Ref
		if _, err := docRef.Update(conn, []firestore.Update{
			{Path: "nickname", Value: user.Nickname},
		}); err != nil {
			return ctx.Status(fiber.StatusInternalServerError).SendString("Database error")
		}
		return ctx.SendString("User updated successfully")
	} else {
		return ctx.Status(fiber.StatusNotFound).SendString("User not found")
	}
}

func (handler *Handler) RegisUser(ctx *fiber.Ctx) error {
	user := new(models.User_Res)
	if err := ctx.BodyParser(user); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}
	conn := context.Background()
	iter, err := handler.DB.Collection("users").Where("username", "==", strings.ToLower(user.Username)).Documents(conn).GetAll()
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).SendString("Database error")
	}
	if len(iter) == 0 {
		if _, _, err := handler.DB.Collection("users").Add(conn, map[string]interface{}{
			"nickname": user.Nickname,
			"username": strings.ToLower(user.Username),
			"password": HashPassword(user.Password),
		}); err != nil {
			return ctx.Status(fiber.StatusInternalServerError).SendString("Database error")
		}
		return ctx.SendString("User added successfully")
	} else {
		return ctx.Status(fiber.StatusConflict).SendString("Username already in use")
	}
}

func (handler *Handler) LoginUser(ctx *fiber.Ctx) error {
	req := new(models.User_Req)
	res := new(models.User_Res)
	if err := ctx.BodyParser(req); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}
	conn := context.Background()
	iter := handler.DB.Collection("users").Where("username", "==", strings.ToLower(req.Username)).Documents(conn)
	data, _ := iter.Next()
	if err := data.DataTo(res); err != nil {
		return ctx.SendString("Error reading user data")
	}
	if err := CheckPassword(req.Password, res.Password); err {
		handler.LogConnected(ctx.IP(), res.Username)
		return NewToken(ctx, res.Username, res.Nickname)
	}
	return ctx.SendString("Username OR Password Incurrect")
}
