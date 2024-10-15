---
layout: post
title: Elasticsearch란?
subtitle: ''
categories: devops
tags: es
comments: false
---

## ElasticSearch

<img width="727" alt="image" src="https://github.com/user-attachments/assets/c2f8dff2-a819-4929-8c7b-3720f7333552">


ElasticSearch를 만든사람인데..( 왜 하나 같이 모두가 빡빡이..)

ElasticSearch는 샤이베논이라는 분이 개발하셨고, 요리학원을 다니는 아내를 위한 요리법 검색엔진을 만들기 위한 프로젝트이다.

## Elasticserach

- Elasticsearch 는 Elastic Stack 의 핵심 구성요소이다.
- 데이터를 저장하고 검색기능을 제공하며 유연한 방법 으로 분석 분석기능을 제공하기도 한다.
- Elasticsearch 는 다른 구성요소와의 연계없이 자체만으로도 사용될 검색, 분석 기능등을 제공할 수 있다.

## Logstash

- 로그, 메트릭과 같은 형태의 이벤트 데이터를 수집하는 것
- 수집된 데이터를 stash 로 전송할 때에는 사용자가원하는 다양한 방법으로 데이터의 행태를 변형하여 전송할 수 있다.
- Logstash 는 3가지 타입의 플러그인을 제공하는데 이는 input, filter, output 플러그인이다.

## Beats

- Beasts 는 오픈소스 기반의 경량화된 데이터 shipper 이며, Logstash 와 상호보완적인 기능을 제공한다.
- Logstash 가 서버사이드 구성요소라고 한다면 Beast 는 클라이언트 사이드 역할을 수행한다.
- Beasts 의 코 어 라이브러리인 libbeat 는 원본데이터를 이동시키기 위한 API 를 제공한다.
- Elasticsearch, Logstash, Kibana 와 같은 서버사이드 구성요소가 아니므로 non-cluster 노드라 할 수 있는 edge node 에 에이전트 를 설치해야 한다.

# 실습환경 구성

## 다운로드와 설치

```sql
설치파일

touch es_install.sh ; chmod +x es_install.sh ; vi es_install.sh
user1@ebes:~$ sudo ./es_install.sh

sudo apt install openjdk-11-jre-headless -y

 wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.17.7-amd64.deb

 wget https://artifacts.elastic.co/downloads/kibana/kibana-7.17.7-amd64.deb

 sudo dpkg -i elasticsearch-7.17.7-amd64.deb

 sudo dpkg -i kibana-7.17.7-amd64.deb

 sudo systemctl daemon-reload # 시스템 재부팅하지않고 구성파일 변경사항을 적용

 sudo systemctl enable elasticsearch --now

 sudo systemctl enable kibana --now

 sudo systemctl disable ufw --now

http://localhost:5601
```

[http://localhost:5601로](http://localhost:5601%EB%A1%9C/)

<img width="696" alt="image" src="https://github.com/user-attachments/assets/a5f501b0-4e83-4685-b65c-e156fc448b0e">

샘플데이터를 추가하면 키바나의 Visualize 와 Dashboard 등에도 샘플들이 함께 추가된다.

샘플데이터들이 추가되었으니 모든 실습준비가 끝이났다.!

## Reference

<https://www.elastic.co/kr/elasticsearch>

<https://aws.amazon.com/ko/what-is/elasticsearch/>

<https://victorydntmd.tistory.com/308>