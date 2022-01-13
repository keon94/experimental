package milvus

import (
	"context"
	"github.com/keon94/go-compose/docker"
	milvus "github.com/milvus-io/milvus-sdk-go/v2/client"
	"github.com/stretchr/testify/require"
	"testing"
	"time"
)

func TestMilvus(t *testing.T) {
	env := docker.StartEnvironment(
		&docker.EnvironmentConfig{
			UpTimeout:        30 * time.Second,
			DownTimeout:      30 * time.Second,
			ComposeFilePaths: []string{"docker-compose.yml"},
		},
		&docker.ServiceEntry{
			Name:    "standalone",
			Handler: GetMilvusClient,
		},
	)
	t.Cleanup(env.Shutdown)
	client := env.Services["standalone"].(milvus.Client)
	has, err := client.HasCollection(context.Background(), "YOUR_COLLECTION_NAME")
	require.NoError(t, err)
	_ = has
}
