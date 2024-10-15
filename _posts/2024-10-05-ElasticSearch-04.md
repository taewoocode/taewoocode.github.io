---
layout: post
title: Elasticsearch Aggregation
subtitle: ''
categories: devops
tags: es
comments: false
---

## Aggregation Function

엘라스틱서치에서 **집계(Aggregation)**는 데이터를 분석하고 통계 정보를 얻는 데 중요한 기능이다. 이 기능은 SQL의 `GROUP BY`와 통계 함수와 유사한 역할을 하며, 데이터의 패턴을 이해하고 통찰력을 얻는 데 매우 유용하다. 집계는 특정 기준에 따라 데이터를 그룹화하고, 각 그룹에 대한 통계 값을 계산한다.

대규모 데이터베이스에서의 작은 단쉬로 분할하는 기술에서 부하 분산을 위해 다수의 데이터베이스에 데이터를 분산 저장하는 것에 있어서 집계 함수는 데이터 사이의 중복을 줄이기 위해서 최적화 되어있다.

(여기서 샤드란 데이터베이스를 작은 단위로 분할하는 기술을 말한다.)

### 집계의 개념

집계는 데이터를 다양한 기준으로 그룹화하고, 그룹별로 통계 값을 도출하는 기능이다. 예를 들어, 다음과 같은 방식으로 집계를 수행할 수 있다:

- **날짜별 집계**: 특정 기간 동안의 데이터를 날짜별로 묶어 통계 값을 도출할 수 있다.
- **카테고리별 집계**: 제품 카테고리나 사용자 그룹 등 특정 카테고리로 데이터를 묶어 분석할 수 있다.

이러한 집계 기능은 **키바나(Kibana)**와 같은 시각화 도구와 대시보드에서 주로 활용되며, 사용자에게 데이터를 직관적으로 전달하는 데 도움을 준다.

### 집계의 요청 방법

엘라스틱서치에서 집계를 요청하기 위해서는 별도의 집계 API가 존재하지 않는다. 대신, **search API**의 요청 본문에 `aggs` 파라미터를 추가하여 집계를 수행할 수 있다. 이 방식은 쿼리와 집계를 동시에 실행할 수 있는 장점을 제공한다.

```json
POST /my_index/_search
{
  "query": {
    "match_all": {}
  },
  "aggs": {
    "category_count": {
      "terms": {
        "field": "category.keyword"
      }
    }
  }
}
```

- **query**: `match_all` 쿼리를 사용하여 모든 문서를 검색한다.
- **aggs**: 집계 요청을 위한 파라미터로, `category_count`라는 이름의 집계를 정의하고 `terms` 집계 방식을 사용한다.
- **field**: 집계할 필드로 `category.keyword`를 지정하여 각 카테고리의 문서 수를 계산한다.

```json

{
  "aggregations": {
    "category_count": {
      "buckets": [
        {
          "key": "electronics",
          "doc_count": 150
        },
        {
          "key": "furniture",
          "doc_count": 100
        },
        {
          "key": "clothing",
          "doc_count": 75
        }
      ]
    }
  }
}

```

- **aggregations**: 요청한 집계 결과가 포함된 부분으로, `category_count`에 대한 결과를 보여준다.
- **buckets**: 각 카테고리에 대한 집계 결과를 배열 형태로 반환하며, `key`는 카테고리 이름, `doc_count`는 해당 카테고리에 속하는 문서 수를 나타낸다.

### 집계의 활용

엘라스틱서치의 집계 기능은 데이터를 효과적으로 분석한다.
통계 정보를 제공하여 사용자가 더 나은 결정을 내릴 수 있도록 돕는다. 
`aggs` 파라미터를 사용하여 다양한 집계 방식을 적용할 수 있으며, 이를 통해 대시보드와 시각화 도구에서 보다 풍부한 정보를 제공할 수 있다. 
집계 기능을 잘 활용하면 데이터에서 유용한 통찰력을 얻을 수 있다.

## Reference

<https://www.elastic.co/kr/blog/what-is-an-elasticsearch-index>

<https://www.elastic.co/kr/elasticsearch>

<https://aws.amazon.com/ko/what-is/elasticsearch/>

<https://victorydntmd.tistory.com/308>