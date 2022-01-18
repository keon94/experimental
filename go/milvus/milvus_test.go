package milvus

import (
	"context"
	"fmt"
	"testing"
	"time"

	"github.com/milvus-io/milvus-sdk-go/v2/entity"
	log "github.com/sirupsen/logrus"

	"github.com/keon94/go-compose/docker"
	milvus "github.com/milvus-io/milvus-sdk-go/v2/client"
	"github.com/stretchr/testify/require"
)

func TestNoCollection(t *testing.T) {
	client := getClient(t)
	has, err := client.HasCollection(context.Background(), "YOUR_COLLECTION_NAME")
	require.NoError(t, err)
	require.False(t, has)
}

func TestSearch_NoPartitions(t *testing.T) {
	c := getClient(t)
	defer c.Close()
	// here is the collection name we use in this example
	collectionName := `insert_example`
	idFieldName := "ID"
	yearFieldName := "Year"
	vectorFieldName := "Vector"

	ctx := context.Background()
	has, err := c.HasCollection(ctx, collectionName)
	require.NoErrorf(t, err, "failed to check whether collection exists")
	require.False(t, has)

	// define collection schema, see film.csv
	schema := &entity.Schema{
		CollectionName: collectionName,
		Description:    "this is the example collection for insert and search",
		AutoID:         false,
		Fields: []*entity.Field{
			{
				Name:       idFieldName,
				DataType:   entity.FieldTypeInt64, // int64 only for now
				PrimaryKey: true,
				AutoID:     false,
			},
			{
				Name:       yearFieldName,
				DataType:   entity.FieldTypeInt32,
				PrimaryKey: false,
				AutoID:     false,
			},
			{
				Name:     vectorFieldName,
				DataType: entity.FieldTypeFloatVector,
				TypeParams: map[string]string{
					"dim": "8",
				},
			},
		},
	}

	err = c.CreateCollection(ctx, schema, 1) // only 1 shard
	require.NoErrorf(t, err, "failed to create collection:")
	films, err := loadFilmCSV()
	require.NoErrorf(t, err, "failed to load film data csv:")
	// grab a subset of films for testing
	films = films[0:50]
	filmsMap := mapFilmsByID(films)

	// insert into default partition
	_, err = c.Insert(ctx, collectionName, "", extractFilmsToSchemaColumns(films)...)
	require.NoErrorf(t, err, "failed to insert film data")
	log.Println("insert completed")
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*120)
	defer cancel()
	err = c.Flush(ctx, collectionName, false)
	require.NoErrorf(t, err, "failed to flush collection")
	log.Println("flush completed")
	// load collection with async=false
	err = c.LoadCollection(ctx, collectionName, false)
	require.NoErrorf(t, err, "failed to load collection")
	log.Println("load collection completed")

	// search call
	targetVector := []entity.Vector{
		entity.FloatVector(films[0].Vector[:]), //don't use more than 1!
	}
	searchParam, _ := entity.NewIndexFlatSearchParam(10)
	searchExpression := fmt.Sprintf("%s > 1950", yearFieldName)
	topKResults := 20
	comparatorAlgo := entity.L2 //see https://milvus.io/docs/metric.md#floating

	results, err := c.Search(ctx, collectionName, []string{}, searchExpression, []string{idFieldName}, targetVector, vectorFieldName,
		comparatorAlgo, topKResults, searchParam)
	require.NoErrorf(t, err, "failed to search collection")
	validateSearchResults(t, idFieldName, filmsMap, results)

	// clean up
	err = c.DropCollection(ctx, collectionName)
	require.NoError(t, err)
}

func validateSearchResults(t *testing.T, idFieldName string, filmsMap map[int64]film, results []milvus.SearchResult) {
	for _, result := range results {
		fmt.Println("==========================result==========================")
		idColumn, err := extractSearchResultColumn(result, idFieldName)
		require.NoError(t, err)
		for i := 0; i < result.ResultCount; i++ {
			id, err := idColumn.ValueByIdx(i)
			require.NoError(t, err)
			if i >= len(result.Scores) {
				fmt.Printf("file id: %d title: %s - wrong scores count! -> %v\n", id, filmsMap[id].Title, result.Scores)
			} else {
				fmt.Printf("file id: %d title: %s score: %v\n", id, filmsMap[id].Title, result.Scores[i])
			}
		}
	}
}

func extractSearchResultColumn(result milvus.SearchResult, primaryKeyName string) (*entity.ColumnInt64, error) {
	var idColumn *entity.ColumnInt64
	for _, field := range result.Fields {
		if field.Name() == primaryKeyName {
			c, ok := field.(*entity.ColumnInt64)
			if ok {
				idColumn = c
			}
		}
	}
	if idColumn == nil {
		return nil, fmt.Errorf("result field not math")
	}
	return idColumn, nil
}

func extractFilmsToSchemaColumns(films []film) []entity.Column {
	// row-base covert to column-base
	ids := make([]int64, 0, len(films))
	years := make([]int32, 0, len(films))
	vectors := make([][]float32, 0, len(films))
	// string field is not supported yet
	idTitle := make(map[int64]string)
	for idx, f := range films {
		ids = append(ids, f.ID)
		idTitle[f.ID] = f.Title
		years = append(years, f.Year)
		vectors = append(vectors, films[idx].Vector[:]) // prevent same vector
	}
	idColumn := entity.NewColumnInt64("ID", ids)
	yearColumn := entity.NewColumnInt32("Year", years)
	vectorColumn := entity.NewColumnFloatVector("Vector", 8, vectors)
	return []entity.Column{idColumn, yearColumn, vectorColumn}
}

func mapFilmsByID(films []film) map[int64]film {
	mapping := make(map[int64]film)
	for _, f := range films {
		mapping[f.ID] = f
	}
	return mapping
}

func getClient(t *testing.T) milvus.Client {
	t.Helper()
	env := docker.StartEnvironment(
		&docker.EnvironmentConfig{
			UpTimeout:        30 * time.Second,
			DownTimeout:      30 * time.Second,
			ComposeFilePaths: []string{"docker-compose.yml"},
		},
		&docker.ServiceEntry{
			Name:                "standalone",
			Handler:             GetMilvusClient,
			DisableShutdownLogs: true,
		},
	)
	t.Cleanup(env.Shutdown)
	return env.Services["standalone"].(milvus.Client)
}
