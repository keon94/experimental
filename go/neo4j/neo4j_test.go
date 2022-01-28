package neo4j

import (
	"testing"
	"time"

	"github.com/stretchr/testify/require"

	"github.com/keon94/go-compose/docker"

	"github.com/neo4j/neo4j-go-driver/v4/neo4j"
)

// See some query syntax usage at https://www.youtube.com/watch?v=Dmxq90gJ2xE&ab_channel=SCIENCEANDSCIENCEONLY
func TestBasicNodeCreation(t *testing.T) {
	session := getSession(t)
	greeting, err := session.WriteTransaction(func(transaction neo4j.Transaction) (interface{}, error) {
		result, err := transaction.Run(
			"CREATE (a:Greeting) SET a.message = $message RETURN a.message + '!!'",
			map[string]interface{}{"message": "hello, world"})
		if err != nil {
			return nil, err
		}
		if result.Next() {
			return result.Record().Values[0], nil
		}
		return nil, result.Err()
	})
	require.NoError(t, err)
	require.Equal(t, "hello, world!!", greeting.(string))
}

func getSession(t *testing.T) neo4j.Session {
	t.Helper()
	env := docker.StartEnvironment(
		&docker.EnvironmentConfig{
			UpTimeout:        60 * time.Second,
			DownTimeout:      60 * time.Second,
			ComposeFilePaths: []string{"docker-compose.yml"},
		},
		&docker.ServiceEntry{
			Name:                "neo4j",
			Handler:             GetNeo4jClient,
			DisableShutdownLogs: false,
		},
	)
	t.Cleanup(env.Shutdown)
	return env.Services["neo4j"].(neo4j.Session)
}
