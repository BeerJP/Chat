package database

import (
	"github.com/BeerJP/server/models"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func Database() *gorm.DB {
	dns := "root:@tcp(127.0.0.1)/full-stack-chat?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dns), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	if err := db.AutoMigrate(&models.Messages{}); err != nil {
		panic(err)
	}
	return db
}
