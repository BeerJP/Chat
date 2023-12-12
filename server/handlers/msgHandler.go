package handlers

import (
	"github.com/BeerJP/server/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func (handler Handler) GetMessages(ctx *fiber.Ctx) error {
	var messages []models.Messages
	var request *gorm.DB
	value := ctx.Params("value")
	switch value {
	case "all":
		request = handler.DB.Find(&messages)
	default:
		request = handler.DB.Order("created_at desc").Limit(20).Find(&messages)
	}

	if request.Error != nil {
		return ctx.Status(fiber.StatusInternalServerError).SendString(request.Error.Error())
	}

	var response []models.MessageResponse
	for _, m := range messages {
		response = append(response, models.MessageResponse{
			Name: m.Name,
			Text: m.Text,
			Date: m.CreatedAt.Format("2006-01-02"),
			Time: m.CreatedAt.Format("15:04"),
		})
	}
	return ctx.JSON(response)
}
