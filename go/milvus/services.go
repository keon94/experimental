package milvus

import (
	"context"
	"fmt"
	"github.com/keon94/go-compose/docker"
	milvus "github.com/milvus-io/milvus-sdk-go/v2/client"
	"github.com/sirupsen/logrus"
)

func GetMilvusClient(container *docker.Container) (interface{}, error) {
	endpoints, err := container.GetEndpoints()
	if err != nil {
		return "", err
	}
	var connString string
	var client milvus.Client
	for _, publicPort := range endpoints.GetPublicPorts(19530) {
		connString = fmt.Sprintf("%s:%d", endpoints.GetHost(), publicPort)
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
