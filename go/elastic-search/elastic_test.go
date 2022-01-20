package elastic_search

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"github.com/elastic/go-elasticsearch/v7/esutil"
	"github.com/tidwall/gjson"
	"strconv"
	"sync"
	"testing"
	"time"

	"github.com/stretchr/testify/require"

	"github.com/elastic/go-elasticsearch/v7/esapi"

	"github.com/keon94/go-compose/docker"

	es "github.com/elastic/go-elasticsearch/v7"
)

func createIndices(t *testing.T, reqs ...func() (*esapi.Response, error)) map[string]*esutil.BulkIndexerResponseItem {
	responses := make(map[string]*esutil.BulkIndexerResponseItem)
	wg := sync.WaitGroup{}
	for _, req := range reqs {
		wg.Add(1)
		req := req
		go func() {
			defer wg.Done()
			res, err := req()
			require.NoError(t, err)
			defer res.Body.Close()
			if res.IsError() {
				require.Failf(t, "[%s] Error indexing document", res.Status())
			} else {
				// Deserialize the response into a map.
				r := esutil.BulkIndexerResponseItem{}
				require.NoError(t, json.NewDecoder(res.Body).Decode(&r))
				responses[r.Index] = &r
			}
		}()
	}
	wg.Wait()
	return responses
}

func TestIndexAndSearchJSON_QueryByMatch(t *testing.T) {
	cli := getClient(t)
	{
		info, err := cli.Info(func(request *esapi.InfoRequest) {
			request.Pretty = true
		})
		require.NoError(t, err)
		fmt.Println(info.String())
		require.NoError(t, info.Body.Close())
	}

	titleIndex1 := "test1"
	var id1 string
	{
		indexResponses := createIndices(t, func() (*esapi.Response, error) {
			id1 = strconv.Itoa(time.Now().Nanosecond())
			return cli.Index(
				titleIndex1,
				bytes.NewBuffer(ReadFile(t, "data/file1.json")),
				cli.Index.WithDocumentID(id1),
				cli.Index.WithRefresh("true"),
			)
		})
		fmt.Printf("Index creation responses:\n%s", StructToJSON(t, indexResponses))
	}
	{
		query := fmt.Sprintf(`
			{
				"query": {
					"match": {
						"title": "%s"
					}
				 }
			}
		`, "Title1")
		res, err := cli.Search(
			cli.Search.WithContext(context.Background()),
			cli.Search.WithIndex(titleIndex1),
			cli.Search.WithBody(bytes.NewBuffer([]byte(query))),
			cli.Search.WithTrackTotalHits(true),
			cli.Search.WithPretty(),
		)
		require.NoError(t, err)
		require.False(t, res.IsError())
		js := BodyToJSON(t, res.Body)
		fmt.Printf("SEARCH response:\n%s\n", js)
		value := gjson.Get(js, "hits.total.value").Float()
		took := gjson.Get(js, "took").Float()
		fmt.Printf("[%s] %f hits; took: %fms", res.Status(), value, took)
		hits := gjson.Get(js, "hits.hits").Array()
		require.Greater(t, len(hits), 0)
		for _, hit := range hits {
			id := hit.Get("_id").Value()
			src := hit.Get("_source").Value()
			fmt.Printf(" * ID=%v, %v\n", id, src)
		}
	}
	{
		res, err := cli.Get(titleIndex1, id1)
		require.NoError(t, err)
		require.False(t, res.IsError())
		js := BodyToJSON(t, res.Body)
		fmt.Printf("GET response:\n%s\n", js)
		require.True(t, gjson.Get(js, "found").Bool())
	}
}

func getClient(t *testing.T) *es.Client {
	t.Helper()
	env := docker.StartEnvironment(
		&docker.EnvironmentConfig{
			UpTimeout:        60 * time.Second,
			DownTimeout:      60 * time.Second,
			ComposeFilePaths: []string{"docker-compose.yml"},
		},
		&docker.ServiceEntry{
			Name:                "es01",
			Handler:             GetElasticSearchClient,
			DisableShutdownLogs: true,
		},
		&docker.ServiceEntry{
			Name:                "es02",
			DisableShutdownLogs: true,
		},
		&docker.ServiceEntry{
			Name:                "kibana",
			DisableShutdownLogs: true,
		},
	)
	t.Cleanup(env.Shutdown)
	return env.Services["es01"].(*es.Client)
}
