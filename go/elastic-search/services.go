package elastic_search

import (
	"fmt"

	"github.com/sirupsen/logrus"

	"github.com/keon94/go-compose/docker"

	es "github.com/elastic/go-elasticsearch/v7"
)

func GetElasticSearchClient(container *docker.Container) (interface{}, error) {
	endpoints, err := container.GetEndpoints()
	if err != nil {
		return "", err
	}
	var connString string
	var cli *es.Client
	for _, publicPort := range endpoints.GetPublicPorts(9200) {
		connString = fmt.Sprintf("http://%s:%d", endpoints.GetHost(), publicPort)
		cli, err = es.NewClient(es.Config{
			Addresses: []string{connString},
		})
		if err == nil {
			break
		}
		logrus.Infof("connection \"%s\" failed with %s. trying another if available.", connString, err.Error())
		connString = ""
	}
	if connString == "" {
		return nil, fmt.Errorf("no valid connection could be establised")
	}
	return cli, nil
}
