package handlers

import (
	"github.com/BeerJP/server/models"
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

func (handler *Handler) LoginUser(ctx *fiber.Ctx) error {
	user := new(models.Users)
	if err := ctx.BodyParser(user); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}
	pass := user.Password
	if err := handler.DB.Where("name = ?", user.Name).Find(&user); err != nil {
		if err := CheckPassword(pass, user.Password); err {
			return ctx.SendString(user.Name)
		} else {
			return ctx.SendString("Password Incurrect")
		}
	} else {
		return ctx.SendString("Database error")
	}
}

func (handler *Handler) RegisUser(ctx *fiber.Ctx) error {
	user := new(models.Users)
	if err := ctx.BodyParser(user); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}
	if err := handler.DB.Where("name = ?", user.Name).Find(user).RowsAffected; err == 0 {
		if err := handler.DB.Create(&models.Users{
			Name:     user.Name,
			Password: HashPassword(user.Password),
			Type:     "1",
			State:    "0",
		}).Error; err != nil {
			return ctx.SendString("Database error")
		}
	} else {
		return ctx.SendString("Username Already in Use.")
	}
	return ctx.SendString("Success")
}

func (handler *Handler) GetUser(ctx *fiber.Ctx) error {
	var user []models.Users
	request := handler.DB.Find(&user).Group("name")
	if request.Error != nil {
		return ctx.Status(fiber.StatusInternalServerError).SendString(request.Error.Error())
	}
	var response []models.Users
	for _, m := range user {
		response = append(response, models.Users{
			Name:  m.Name,
			State: m.State,
		})
	}
	return ctx.JSON(response)
}
