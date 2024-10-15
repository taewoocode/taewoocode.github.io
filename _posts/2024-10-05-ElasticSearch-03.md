---
layout: post
title: Elasticsearch Analyzer
subtitle: ''
categories: devops
tags: es
comments: false
---

## Analyzer

엘라스틱서치에서 **분석기(Analyzer)**는 텍스트 데이터를 처리하여 검색 성능을 높이는 데 필수적인 역할을 한다. 
분석기는 문서를 인덱싱하기 전에 데이터를 가공하여 유용한 형태로 변환한다. 
이 과정에서 사용되는 주요 구성 요소는 **캐릭터 필터(Character Filter)**, **토크나이저(Tokenizer)**, 그리고 **토큰 필터(Token Filter)**이다.

## 분석기의 구성 요소

<img width="981" alt="image" src="https://github.com/user-attachments/assets/772dd9f6-4fe1-494d-9ddf-ad43ac293eb4">


### 캐릭터 필터 (Character Filter)

- **역할**: 캐릭터 필터는 텍스트 데이터를 분석하기 전에 불필요한 문자나 정보를 사전에 처리하는 데 사용된다.
- **예시**: HTML 문서에서 `<html>`, `<body>`와 같은 태그는 인덱싱할 필요가 없으므로, 캐릭터 필터를 통해 이러한 태그를 제거할 수 있다.
- **사용 목적**: 데이터의 노이즈를 줄이고, 텍스트를 보다 깔끔한 형태로 변환하여 다음 단계인 토크나이징을 준비한다.

### 토크나이저 (Tokenizer)

- **역할**: 토크나이저는 텍스트를 분리하여 **토큰**이라고 불리는 작은 단위로 변환한다. 분석기에는 반드시 하나의 토크나이저가 포함되어야 한다.
- **예시**:
   - **Standard Tokenizer**: 기본적으로 사용하는 토크나이저로, 쉼표나 마침표와 같은 기호를 제거하여 단어를 분리한다.
   - **Lowercase Tokenizer**: 모든 문자를 소문자로 변환한 후 토큰화한다.
   - **Ngram Tokenizer**: N 개의 연속된 글자 단위를 모두 토큰화한다. 예를 들어, "엘라스틱서치"라는 문자열을 입력하면 (엘라, 라스, 스틱, 틱서, 서치)와 같은 연속된 두 글자를 모두 추출한다.

### 토큰 필터 (Token Filter)

- **역할**: 토큰 필터는 생성된 토큰에 추가적인 처리를 하여 최종적으로 인덱싱할 수 있는 형태로 변환한다.
- **예시**:
   - **소문자 필터**: 모든 대문자를 소문자로 변환한다. 예를 들어, "HELLO"는 "hello"로 변환된다.
   - **형태소 분석기**: "loving", "loved", "love", "loves"와 같은 다양한 형태를 분석하여 "love"라는 기본형으로 변환한다.
- **작동 과정**: 토큰이 이 필터를 거치면서 최종 용어로 변환된 후 인덱싱된다.

### 토크나이저 테스트

```json
POST _analyze
{
  "analyzer": "standard",
  "text": "Hello, my name is gildong hong. She loves him. I am 22 years old"
}
```

이 요청은 **standard** 분석기를 사용하여 주어진 텍스트를 분석하는 테스트이다. 결과로 각 단어가 토큰화되고, 각 토큰에 대한 정보(위치, 유형 등)가 포함된다. 예를 들어, "Hello"는 "hello"로 변환되며, 숫자 "22"는 `<NUM>` 유형으로 인식된다. 이를 통해 검색을 최적화하고 텍스트의 의미를 파악할 수 있다.

### 쿼리 실습

### 인덱스 생성 및 문서 추가

```json
PUT text_index
{
  "mappings": {
    "properties": {
      "writer": {"type" : "keyword"},
      "title": {"type": "text"}
    }
  }
}
```

위 코드는 `text_index`라는 인덱스를 생성하며, `writer` 필드는 **keyword** 타입, `title` 필드는 **text** 타입으로 정의된다.

문서를 추가하는 예시

```json
PUT text_index/_doc/1
{
  "wirter": "gildong",
  "title": "The Cloud Computing Rules"
}

PUT text_index/_doc/2
{
  "writer": "chulsoo",
  "title": "My Cloud Bread"
}
```

첫 번째 문서에서 `writer` 필드의 오타(“wirter”)가 있으므로, 인덱싱에 문제가 발생할 수 있다.

### 검색 쿼리

**전체 검색**

```json
GET text_index/_search
{
  "query": {
    "match": {
      "title": "Cloud Computing"
    }
  }
}
```

이 쿼리는 `title` 필드에서 "Cloud Computing"과 일치하는 문서를 찾는다.

**작가 검색**

```json
GET text_index/_search
{
  "query": {
    "match": {
      "writer": "gildong"
    }
  }
}
```

`writer` 필드에서 "gildong"을 찾는 쿼리이다.

**제목 검색**

```json
GET text_index/_search
{
  "query": {
    "match": {
      "title": "Cloud"
    }
  }
}
```

`title` 필드에서 "Cloud"와 일치하는 문서를 찾는다.

### 인덱스 템플릿

인덱스 템플릿은 새로운 인덱스가 생성될 때 적용되는 설정과 매핑을 정의한다.

```json
PUT _index_template/mysql_2024_template
{
  "index_patterns": ["mysql_2024_*"],
  "priority": 1,
  "template": {
    "settings": {
      "number_of_shards": 3,
      "number_of_replicas": 1
    },
    "mappings": {
      "properties": {
        "name": {"type": "keyword"},
        "time" : {"type": "date"},
        "message": {"type": "text"}
      }
    }
  }
}
```

위 코드는 인덱스 이름이 `mysql_2024_*` 패턴에 맞는 경우, 자동으로 해당 설정과 매핑이 적용된다. 
예를 들어, `mysql_2024_02`라는 인덱스를 생성하면, 설정된 샤드 수, 복제본 수, 그리고 필드 타입이 자동으로 적용된다.

### 다양한 토크나이저 테스트

### 표준 토크나이저

```json
POST _analyze
{
  "tokenizer": "standard",
  "text": "email: test@test.com"
}
```

표준 토크나이저를 사용하여 주어진 텍스트를 분석하고, 각 토큰을 추출한다.

```json
{
  "tokens" : [
    {
      "token" : "email",
      "start_offset" : 0,
      "end_offset" : 5,
      "type" : "<ALPHANUM>",
      "position" : 0
    },
    {
      "token" : "test",
      "start_offset" : 7,
      "end_offset" : 11,
      "type" : "<ALPHANUM>",
      "position" : 1
    },
    {
      "token" : "test.com",
      "start_offset" : 12,
      "end_offset" : 20,
      "type" : "<ALPHANUM>",
      "position" : 2
    }
  ]
}
```

여기서 "email"과 "test"는 일반 알파벳으로 처리되며, "test.com"은 하나의 토큰으로 처리된다.

### 소문자 토크나이저

```json
POST _analyze
{
  "tokenizer": "lowercase",
  "text": "email: test@test.com"
}
```

이 토크나이저는 모든 문자를 소문자로 변환한다. 결과는 아래와 같다.

```json

{
  "tokens" : [
    {
      "token" : "email",
      "start_offset" : 0,
      "end_offset" : 5,
      "type" : "<ALPHANUM>",
      "position" : 0
    },
    {
      "token" : "test@test.com",
      "start_offset" : 7,
      "end_offset" : 20,
      "type" : "<EMAIL>",
      "position" : 1
    }
  ]
}
```

이 결과에서 "test@test.com"은 이메일로 인식되어 하나의 토큰으로 처리된다.
엘라스틱서치에서의 실습을 진행해 보며 쿼리, 인덱스 템플릿, 그리고 토크나이저의 사용은 검색 성능을 극대화하는 데 매우 중요하다는 것을 배울 수 있었다. 
적절한 분석기와 토크나이저를 선택하면, 검색 결과의 품질을 높이고, 데이터의 의미를 보다 정확하게 파악할 수 있다. 
각 요소를 신중하게 구성하고 실험함으로써, 원하는 검색 결과를 얻을 수 있다.

## Reference

<https://www.elastic.co/kr/blog/what-is-an-elasticsearch-index>

<https://www.elastic.co/kr/elasticsearch>

<https://aws.amazon.com/ko/what-is/elasticsearch/>

<https://victorydntmd.tistory.com/308>