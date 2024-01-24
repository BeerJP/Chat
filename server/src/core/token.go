package core

import (
	config "github.com/BeerJP/Chat/configs"
	jwtware "github.com/gofiber/contrib/jwt"
)

func TokenMdw() jwtware.Config {
	return jwtware.Config{
		SigningKey: jwtware.SigningKey{Key: []byte(config.Secret)},
	}
}
