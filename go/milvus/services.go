package milvus

import (
	"context"
	"fmt"
	"github.com/keon94/go-compose/docker"
	milvus "github.com/milvus-io/milvus-sdk-go/v2/client"
	"github.com/sirupsen/logrus"
)

func GetMilvusClient(container *docker.Container) (interface{}, error) {
	host, ports, err := docker.GetAllEndpoints(container)
	if err != nil {
		return "", err
	}
	publicPorts := ports["19530"]
	if len(publicPorts) == 0 {
		return nil, fmt.Errorf("milvus port not found")
	}
	var connString string
	var client milvus.Client
	for _, publicPort := range publicPorts {
		connString = fmt.Sprintf("%s:%s", host, publicPort)
		client, err = milvus.NewGrpcClient(context.Background(), connString)
		if err == nil {
			break
		}
		logrus.Infof("milvus connection \"%s\" failed with %s. trying another if available.", connString, err.Error())
	}
	if connString == "" {
		return nil, fmt.Errorf("no valid milvus connection could be establised")
	}
	return client, nil
}
