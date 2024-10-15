---
layout: post
title: Elasticsearch Logstash
subtitle: ''
categories: devops
tags: es
comments: false
---

## Logstash?

로그 스태시는 오픈소스 데이터 처리 파이프라인 도구이다. 
장애대응 로직이0나 성능 저하 요인을 쉽게 파악할 수 있는 모니터링, API 간단한 조정으로 성능을 튜닝할 수 있는 파라미터들도 제공한다. 비츠, 로그스태시, 엘라스틱서치, 키바나를 이용해 데이터 수집, 변환, 저장, 시각화하는 서비스를 구성할 때 로그스태시는 데이터를 저장하기 전에 원하는 형태로 가공하는 역할을 한다.

실습을 위한 압축파일 다운로드

```bash
wget https://artifacts.elastic.co/downloads/logstash/logstash-7.17.1-linux-x86_64.tar.gz
```

<img width="445" alt="image" src="https://github.com/user-attachments/assets/558cbf44-654e-4c00-9a50-d5479ef735c5">

- 로그를 수집하는 쪽에서 로그 형태를 분석하고 시스템에서 인식할 수 있도록 로그를 정제하는 작업이 필요한데, 로그스태시는 이 과정을 쉽게 할 수 있도록 지원한다.
- 어떤 형태의 로그에 대해서도 ‘수집 > 가공 > 전송’ 하는 일련의 과정을 간편하게 구현 하기 위한 강력한 기능을 제공한다.
- 로그 스태시는 오픈소스 데이터 처리 파이프라인 도구이다.
- 장애대응 로직이0나 성능 저하 요인을 쉽게 파악할 수 있는 모니터링, API 간단한 조정으로 성능을 튜닝할 수 있는 파라미터들도 제공한다.
- 비츠, 로그스태시, 엘라스틱서치, 키바나를 이용해 데이터 수집, 변환, 저장, 시각화하는 서비스를 구성할 때 로그스태시는 데이터를 저장하기 전에 원하는 형태로 가공하는 역할을 한다.

<img width="678" alt="image" src="https://github.com/user-attachments/assets/3499c769-5ed8-48dd-b1c2-243be1e3f129">

## Input

- 소스 원본으로부터 데이터를 입력받는 단계이다.
- 직접 대상에 접근해 읽어 들이는 경우도 있지만, 서버를 열 어놓고 받아들이는 형태의 구성도 가능하다.
  수 있고 이를 쉽게 처리하기 위해 다양한 플러그인들이 존재한다.
- 예를들어 특정 파일은 파일 플러그인을, 실시간 트윗은 트위터 플러그인을 통해 가져올 수 있다.
- 자주 쓰이는 플러그인
    - file : 리눅스의 tail -f 처럼 파일을 스트리밍하여 이벤트를 읽는다.
    - syslog : 네트워크를 통해 전달되는 syslog를 수신한다.
    - kafka : 카프카의 토픽에서 데이터를 읽는다.
    - jdbc : JDBC 드라이버로 지정한 일정마다 쿼리를 실행해서 결과를 읽어 들인다.

## Filter

- 입력 플러그인이 받은 데이터를 의미 있는 데이터로 구조화하는 역할을 한다.
- 필수 구성요소가 아니어서 필터 없이 파이프라인을 구성할 수 있지만, 필터 없는 파이프라인은 그 기능을 온전히 발휘하기 힘들다
- 로그스태시 필터는 비정형 데이터를 정형화하고 데이터 분석을 위한 구조를 잡아준다.
- 비츠나 카프카 등에서 입력받은 데이터를 필터를 이용해 필요한 정보만 손쉽게 추출하거나 형태를 변환하고 부족한 정보는 추가하 는 등 전반적인 데이터 정제/가공 작업을 수행할 수 있다.
- 정형화된 데이터는 엘라스틱서치나 아마존 S3와 같은 스토리지에 전송되어 분석 등의 용도로 활용된다.
- 자주 쓰이는 플러그인
    - add_field : 새로운 필드를 추가한다.
    - add_tag : 성공한 이벤트에 태그를 추가할 수 있다.
    - enable_metric : 매트릭 로깅을 활성화하거나 비활성화 할 수 있다. 수집된 데이터는 로그스태시 모니터링에서 해당 필터의 성능을 분석할 떄 사용한다.
    - id : 플러그인의 ID 를 설정한다. 모니터링 시 아이디를 이용해 특정 플러그인을 쉽게 찾을 수 있다.
    - remove_field : 필드를 삭제할 수 있다.
    - remove_tag : 성공한 이벤트에 붙은 태그를 제거할 수 있다.

## OutPut

- 출력은 파이프라인의 입력과 필터를 거쳐 가공된 데이터를 지정한 대상으로 내보내는 단계이다.
- 입력, 필터 플러그인과 마찬가지로 다양한 출력 플러그인을 지원한다.
- 자주 쓰이는 플러그인
    - elasticserach : 사용빈도가 가장 높고, bulk API 를 사용하여 엘라스틱서치 인덱싱을 수행한다.
    - file : 지정한 파일의 새로운 줄에 데이터를 기록한다.
    - kafka : 카프카 토픽에 데이터를 기록한다.

- 파이프라인 기본 템플릿 형태

```bash
input { 
	{ 입력 플러그인 }

filter {
	{ 필터 플러그인 } 

output {
	{ 출력 플러그인 }
}
```

- 소스 원본으로부터 데이터를 입력받는 단계이다. 직접 대상에 접근해 읽어 들이는 경우도 있지만, 서버를 열 어놓고 받아들이는 형태의 구성도 가능하다.
- 실습을 위한 conf 파일 설정

```shell
vi config/logstash-test.conf 

sudo ./bin/logstash -f config/logstash-test.conf

touch config/fillter-example.log
```

실습을 위해 logstash-test.conf 파일을 생성하고 파일에 파일입력 플러그인을 적용한다.

```bash
root@elastic:~/logstash-7.0.1# pwd

/root/logstash-7.0.1

root@elastic:~/logstash-7.0.1# cat config/logstash-test.conf

input {

file {
	path => "/root/elasticsearch-7.0.1/logs/elasticsearch.log" 
	start_position => "beginning"
	} 
}
output {
  stdout { }
}
```

- 로그스태시 필터는 비정형 데이터를 정형화하고 데이터 분석을 위한 구조를 잡아준다.
- 비츠나 카프카 등에서 입력받은 데이터를 필터를 이용해 필요한 정보만 손쉽게 추출하거나 형태를 변환하고 부족한 정보는 추가하 는 등 전반적인 데이터 정제/가공 작업을 수행할 수 있다.
- 이렇게 정형화된 데이터는 엘라스틱서치나 아마존 S3와 같은 스토리지에 전송되어 분석 등의 용도로 활용된다.

### /bin/ogstash -f config/logstash-test.conf

<img width="625" alt="image" src="https://github.com/user-attachments/assets/206197d1-0fb2-44fa-9623-565385baed6f">

## 필터 적용

```shell

--인풋 구조--

input{
  file{
    path => "/home/user1/logstashlab/config/fillter-example.log"
    start_position => "beginning"
    sincedb_path => "/dev/null"

  }
}

--필터구조--

fillter{
 mutate {
   split => { "message" => " " }
   add_field => { "id => %{[message][2]}" }
   remove_field => "message"
  }
}

--아웃풋 구조--

output{
  stdout { }

}
```

- mutate 플러그인은 필드를 변형하는 다양한 기능을 제공하고 있다. 필드 이름 변 경, 삭제 등이 가능하다.
- mutate 는 플러그인 내부에 옵션이 다양한데 split 도 여러 옵션 중 하나이다. split 옵션은 구분자를 기준으로 데이터를 자를 수 있다.
- message 라는 필드를 ‘띄어쓰기’ 기준으로 분리했다.

## 실행결과

<img width="647" alt="image" src="https://github.com/user-attachments/assets/68eb9684-d402-443a-8885-248023116806">

## grok. loglevel은 모두다 대문자, 동일한 시간포맷으로 로그가 출력하자

```shell
input {
  file {
    path => "/home/user1/logstashlab/config/filter-example.log"
    start_position => "beginning"
    sincedb_path => "/dev/null"
  }
}

filter {
  dissect {
    mapping => {"message" => "[%{timestamp}]%{?->}[%{id}] %{ip} %{+ip} [%{?level}] - %{}."}
  }
  date {
    match => [ "timestamp", "YYYY-MM-dd HH:mm", "yyyy/MM/dd HH:mm:ss"]
    target => "new_timestamp"
    timezone => "UTC"
  }
}

output {
  stdout { }
  elasticsearch {
    hosts => ["211.183.3.10:9200"]
    index => "2024-01-testlog"
  }
}
[실행]
sudo ./bin/logstash -f config/logstash-test2.conf --log.level error
```

어렵구나 어려워

## Reference

<https://www.elastic.co/kr/blog/what-is-an-elasticsearch-index>

<https://www.elastic.co/kr/elasticsearch>

<https://aws.amazon.com/ko/what-is/elasticsearch/>

<https://victorydntmd.tistory.com/308>