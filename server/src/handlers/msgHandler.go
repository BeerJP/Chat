package handlers

import (
	"context"
	"strings"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/BeerJP/Chat/src/models"
	"github.com/gofiber/fiber/v2"
	"google.golang.org/api/iterator"
)

func (handler *Handler) AddMessages(messages *models.Messages) {
	handler.Mu.Lock()
	defer handler.Mu.Unlock()
	conn := context.Background()
	var direct string
	if messages.Name > messages.Target {
		direct = messages.Name + "_" + messages.Target
	} else {
		direct = messages.Target + "_" + messages.Name
	}
	_, _, err := handler.DB.Collection("messages").Add(conn, map[string]interface{}{
		"name":   messages.Name,
		"target": messages.Target,
		"text":   messages.Text,
		"dm":     strings.ToLower(direct),
		"time":   time.Now(),
	})
	if err != nil {
		return
	}
}

func (handler *Handler) GetMessages(ctx *fiber.Ctx) error {
	conn := context.Background()
	var iter *firestore.DocumentIterator
	var direct string
	name := ctx.Params("id")
	target := ctx.Params("target")
	if name > target {
		direct = name + "_" + target
	} else {
		direct = target + "_" + name
	}
	switch target {
	case "main":
		iter = handler.DB.Collection("messages").
			Where("target", "==", "main").
			OrderBy("time", firestore.Asc).
			Documents(conn)
	default:
		iter = handler.DB.Collection("messages").
			Where("dm", "==", strings.ToLower(direct)).
			OrderBy("time", firestore.Asc).
			Documents(conn)
	}
	defer iter.Stop()
	var response []models.MessageResponse
	for {
		var messages models.Messages
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return err
		}
		if err := doc.DataTo(&messages); err != nil {
			return err
		}
		response = append(response, models.MessageResponse{
			Name:   messages.Name,
			Text:   messages.Text,
			Date:   messages.Time.Format("2006-01-02"),
			Time:   messages.Time.Format("15:04"),
			Target: messages.Target,
			Dm:     messages.Dm,
		})
	}
	return ctx.JSON(response)
}
