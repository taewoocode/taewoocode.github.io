---
layout: post
title: Elasticsearch Index
subtitle: ''
categories: devops
tags: es
comments: false
---

# Index

대부분의 개발자에게 인덱스가 무엇인지 물어보면, 일반적으로 표와 관련된 관계형 데이터베이스(RDBMS)의 데이터 구조를 언급하며, 인덱스를 통해 데이터 검색 작업 속도가 향상된다고 한다.
그러나 Elasticsearch 인덱스란 Elasticsearch 인덱스는 문서의 모음을 유지하는 논리적 네임스페이스이며, 각 문서는 필드의 모음이고, 필드는 데이터를 포함하는 키-값 쌍이다.

- 인덱스는 도큐먼트를 저장하는 논리적 단위로, 관계형 데이터베이스의 테이블과 유사한 개념이다.
- 하나의 인 덱스에 다수의 도큐먼트가 포함되는 구조인데, 동일한 인덱스에 있는 도큐먼트는 동일한 스키마를 갖는다.
- 또 한 모든 도큐먼트는 반드시 하나의 인덱스에 포함되어야 한다.
- elasticsearch 에서는 검색기능을 제공하며 DSL 방식의 검색을 지원한다. 모든 검색 형태는 json 형태로 입력되어야 한다.
- 최근에는 MSA 방법에 의해 특정 애플리케이션이나 웹사이트를 제작할 경우 기능별로 구분하여 프로그래밍(개발)이 진행된다.
- 인덱스는 도큐먼트를 저장하는 논리적 단위이다.

<img width="691" alt="image" src="https://github.com/user-attachments/assets/59e344f0-a574-485d-ae3b-95a6fe36b4e9">

## 스키마에 따른 그룹핑

- 일반적으로 스키마에 따라 인덱스를 구분한다.
- 회원정보 도큐먼트와 장바구니 도큐먼트는 성격이 다 르므로 데이터 스키마도 다르다.
- 이렇게 서로다른 스키마를 가진 도큐먼트를 하나의 인덱스에 저장하는 방법 은 바람직하지 않다.
- 스키마에 따라 인덱스를 구분하는 것은 기본며 필수적인 사항은 아니다.
- 인덱스 스키마 는 매핑을 통해 정의한다.

결론을 말하자면 그룹핑을 하는 이유는 데이터를 효율적으로 처리하기 위함이다.
어떻게 효율적으로 처리하냐? → 데이터가 커질수록 데이터 정제작업이 많은데 그룹핑을하면 데이터를 효율적으로 관리할 수 있다.

## 도큐먼스 CRUD

- Document : 하나의 Json 오브젝트로 Elasticsearch 시스템에서 데이터를 구성하는 최소단위이다.
- 일반적인 Row형 데이터베이스에서 하나의 row에 대응하는 개념으로 이해한다.
- Document를 Elastichserach 인덱스에 Create, Read, Update, Delete 한다.
- 도큐먼트는 인덱스 내에 포함되야 한다.

name” , “age”, “gender” 를 필드라고 하며, “mike”, 25, “male” 를 값이라고 한다.

엘라스틱서치 매핑으로 필드들의 데이터 타입을 지정할 수 있는데, name, gender 필드는 텍스트 타입, age 필드는 정수 타입으로 매핑이 되어있다.

## 데이터(인덱스) 생성

```json
PUT index0/_doc/1
{
  "name": "gildong",
  "age": 22,
  "address": "seoul"
}

#! Elasticsearch built-in security features are not enabled. Without authentication, your cluster could be accessible to anyone. See https://www.elastic.co/guide/en/elasticsearch/reference/7.17/security-minimal-setup.html to enable security.
{
  "_index" : "index0",
  "_type" : "_doc",
  "_id" : "1",
  "_version" : 1,
  "result" : "created",
  "_shards" : {
    "total" : 2,
    "successful" : 1,
    "failed" : 0
  },
  "_seq_no" : 0,
  "_primary_term" : 1
}
```

- age는 long타입, name은 text와 같이 타입을 미리 지정하지 않아도 엘라스틱 서치는 도큐먼트의 필드와 값을 보고 자동으로 이를 지정해주는데 이 기능을 ‘dynamic mapping’ 이라고 한다.

## 데이터(인덱스) 조회

```json
GET kibana_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "range_aggs": {
      "range" : {
        "field": "products.base_price",
        "ranges": [
          { "from": 0, "to": 30 },
          { "from": 30, "to": 50 },
          { "from": 50, "to": 100 },
          { "from": 100, "to": 200 },
          { "from": 200, "to": 1000 }
          ]
        }
      }
    }
  }
```

- 인덱스의 정보를 확인한다.

```json
{
  "took" : 2,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 4675,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [ ]
  },
  "aggregations" : {
    "range_aggs" : {
      "buckets" : [
        {
          "key" : "0.0-30.0",
          "from" : 0.0,
          "to" : 30.0,
          "doc_count" : 3882
        },
        {
          "key" : "30.0-50.0",
          "from" : 30.0,
          "to" : 50.0,
          "doc_count" : 1468
        },
        {
          "key" : "50.0-100.0",
          "from" : 50.0,
          "to" : 100.0,
          "doc_count" : 1902
        },
        {
          "key" : "100.0-200.0",
          "from" : 100.0,
          "to" : 200.0,
          "doc_count" : 263
        },
        {
          "key" : "200.0-1000.0",
          "from" : 200.0,
          "to" : 1000.0,
          "doc_count" : 13
        }
      ]
    }
  }
}
```

## 데이터(인덱스) 수정

```json
POST index0/_update/1
{
  "doc": {
    "name": "minsoo"
  }
}
```

- POST 이용하여 엎어쓰기
- 기존 내용중 변경을 원하는 데이터가 수정되지만 입력되지 않은 데이터는 없어진다. 순수하게 업데이트라고 할 수는 없다.
- update API 를 이용하여 특정 도큐먼트의 값을 업데이트 할 때 POST 메서드를 사용한다.

```json
{
  "_index" : "index0",
  "_type" : "_doc",
  "_id" : "1",
  "_version" : 2,
  "_seq_no" : 5,
  "_primary_term" : 1,
  "found" : true,
  "_source" : {
    "name" : "minsoo",
    "age" : 22,
    "address" : "seoul"
  }
}
```

## 데이터(인덱스) 삭제

- index0 인덱스에서 도큐먼트를 삭제하고  _search를 통해 전체 도큐먼트를 확인한다

```json
DELETE index0/_doc/3
```

```json
"max_score" : 1.0,
    "hits" : [
      {
        "_index" : "index0",
        "_type" : "_doc",
        "_id" : "2",
        "_score" : 1.0,
        "_source" : {
          "name" : "chulsoo",
          "age" : 23,
          "address" : "busan"
        }
      },
      {
        "_index" : "index0",
        "_type" : "_doc",
        "_id" : "1",
        "_score" : 1.0,
        "_source" : {
          "name" : "minsoo",
          "age" : 22,
          "address" : "seoul"
        }
      }
    ]
  }
}
```

# 벌크 데이터

- 데이터 CRUD를 할 때는 REST API 를 호출해 하나하나 도큐먼트를 요청하는 것보다 벌크로 한번에 요청하는 것이 효율적이다.
- API를 20번 호출해 20개의 도큐먼트를 인덱싱한다면? 20번의 HTTP 통신이 발생하는데, API를 한번에 호출한다면 2훨씬 빠르고 경제적일 것이다.
- 읽기는 지원하지 않고 생성, 수정, 삭제만 지원한다.

```json
PUT index1

POST _bulk
{"index": {"_index": "index1", "_id": "1"}}
{"name": "gil dong hong", "age": 30, "gender": "male"}
{"index": {"_index": "index1", "_id": "2"}}
{"name": "young hee park", "age": 25, "gender": "female"}

GET index1/_search
```

```json
{
  "took" : 2,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 2,
      "relation" : "eq"
    },
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "index1",
        "_type" : "_doc",
        "_id" : "1",
        "_score" : 1.0,
        "_source" : {
          "name" : "gil dong hong",
          "age" : 30,
          "gender" : "male"
        }
      },
      {
        "_index" : "index1",
        "_type" : "_doc",
        "_id" : "2",
        "_score" : 1.0,
        "_source" : {
          "name" : "young hee park",
          "age" : 25,
          "gender" : "female"
        }
      }
    ]
  }
}
```

## Reference

<https://www.elastic.co/kr/blog/what-is-an-elasticsearch-index>

<https://www.elastic.co/kr/elasticsearch>

<https://aws.amazon.com/ko/what-is/elasticsearch/>

<https://victorydntmd.tistory.com/308>