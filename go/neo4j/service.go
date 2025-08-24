package neo4j

import (
	"fmt"

	"github.com/neo4j/neo4j-go-driver/v4/neo4j"

	"github.com/keon94/go-compose/docker"
	"github.com/sirupsen/logrus"
)

func GetNeo4jClient(container *docker.Container) (interface{}, error) {
	endpoints, err := container.GetEndpoints()
	if err != nil {
		return "", err
	}
	var connString string
	var driver neo4j.Driver
	for _, publicPort := range endpoints.GetPublicPorts(7687) {
		connString = fmt.Sprintf("bolt://%s:%d", endpoints.GetHost(), publicPort)
		driver, err = neo4j.NewDriver(connString, neo4j.BasicAuth("neo4j", "test", ""))
		if err == nil {
			break
		}
		logrus.Infof("connection \"%s\" failed with %s. trying another if available.", connString, err.Error())
		connString = ""
	}
	if connString == "" {
		return nil, fmt.Errorf("no valid connection could be establised")
	}
	return driver.NewSession(neo4j.SessionConfig{AccessMode: neo4j.AccessModeWrite}), nil
}
