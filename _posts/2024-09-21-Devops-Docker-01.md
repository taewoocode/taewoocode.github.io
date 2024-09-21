---
layout: post
title: Docker swarm을 이용한 사이드 프로젝트
subtitle: ''
categories: devops
tags: docker
comments: false
---

## 프로젝트 요구사항

<aside>
💡 도커 토이프로젝트

- 지금까지 나와있지 않은 이미지를 만들기
- manager1, worker(1,2,3) → github와 연결하여 코드를 가져온뒤 이를 배포하는 방식 (awx 를 효율적으로 사용하는 것도 좋을 거 같다.)
- side car를 컨테이너로 만들고 타 서비스에서 제공되는 컨테이너의 metric 이나 filebeat 등을 이용하여 데이터 수집 → 시각화
- gitlab을 컨테이너로 배포하고 개발자가 gitlab에 코드를 푸쉬하면 이를 swarm cluster에 배포하는 것
- 클러스터를 어떻게 활용하는지
</aside>

## 프로젝트 방향성

> 중앙 집중화 및 저장소: Elasticsearch
대시보드 구현: Kibana
차트 및 그래프 생성: D3.js, Chart.js
로그 수집 및 분석: ELK Stack (Elasticsearch, Logstash, Kibana)
컨테이너 환경 통합: Docker Swarm
컨테이너 로깅 및 메트릭 수집: Elk Stack

Elasticsearch 설정: Elasticsearch를 설치하고 실행 메트릭 데이터를 저장하기 위한 Elasticsearch 인덱스를 생성, 대시보드 구현

Kibana 설정: Kibana를 설치하고 Elasticsearch와 연동. Kibana 대시보드를 생성하고 필요한 차트 및 시각화를 추가, 차트 및 그래프 생성

ELK Stack 설정:
Logstash를 사용하여 로그 데이터를 Elasticsearch로 전송
Kibana에서 로그 데이터를 시각화하고 분석
컨테이너 환경 통합

Docker Swarm
Docker Swarm, Docker API를 활용하여 컨테이너 메트릭 및 로그 데이터를 수집
컨테이너 로깅 및 메트릭 수집
>

## 각 노드 별 역할

### Manager

docker image를 github에 업로드

github action 설정

---

### Worker1, Worker2

git hub에서 docker image 받아서 실행하기

수집된 데이터 W3한테 전송하기

---

### Worker3

전송받은 데이터를 db에 정리한 뒤 정리된 내용을 M한테 넘겨주기

---

### M

W3한테 전달받은 내용을 시각화하기

## 프로젝트 구상도
<img width="757" alt="image" src="https://github.com/user-attachments/assets/b69c079c-1ce8-42e2-9582-c17e8c108537">

## 환경세
<img width="687" alt="image" src="https://github.com/user-attachments/assets/58a908bc-fedd-44cc-8856-67f469b22054">
<img width="621" alt="image" src="https://github.com/user-attachments/assets/5330f672-043d-4476-ac71-cad4e4c8e43c">

VmworkStation을 이용하여 각 노드를 구성하고 ManageNode를 클론해왔기 때문에 Mac Address는 변경해준다.

manager 211.183.3.100

worker1 211.183.3.101

worker2 211.183.3.102

worker3 211.183.3.103

## Putty 원격 접속
<img width="678" alt="image" src="https://github.com/user-attachments/assets/54017a09-8cac-4255-94f9-fec975595faf">

<img width="694" alt="image" src="https://github.com/user-attachments/assets/dd464807-8136-4001-ba8f-e5bf8bcac067">
ping 외부와 연결가능

<img width="617" alt="image" src="https://github.com/user-attachments/assets/659e2e6d-6605-4471-a654-47cadb4fa6ae">
노드끼리도 통신이 가능

이렇게 초기세팅을 완료해줬다.

## 런레벨 설정

```bash
systemctl set-default multi-user.target
```

**CentOS 리눅스의 Run Level은 0부터 6까지 총 7단계로 구성**되어 있으며, 시스템 관리를 위해 서비스 실행에 관련된 명령을 단계 별로 구분하여 적용하는 것을 의미한다.

**시스템 관리를 용이하기 위해 만들어졌으며 시스템을 실행할 때 네트워크를 사용할 지, 여러 명의 사용자가 로그인을 할 수 있도록 허용할 지, 그래픽 인터페이스를 사용할 지 구분해서 시스템을 구동 시키는 것이다.**

일반적으로 리눅스 터미널에서 시스템을 종료하기 위해서 init 0을 입력하거나 재부팅을 위해 init 6을 입력한다. 이와 같이 init 뒤에 단계를 나타내는 숫자를 붙이는 형식으로 사용한다.

# Beats.yaml

## metricbeat.yaml

```bash
metricbeat.config.modules:
  reload.enabled: false
  reload.period: 10s

setup.dashboards.enabled: true
setup.kibana.host: kibana:5601

output.elasticsearch:
  hosts: ['211.183.3.100:9200']

metricbeat.modules:
  - module: system
    metricsets:
      - cpu
      - load
      - memory
      - network
      - process
      - process_summary
      - uptime
      - socket_summary
    enabled: true
    period: 10s
    processes: ['.*']
    cpu.metrics: ['percentages']
    core.metrics: ['percentages']
```

1. **`metricbeat.config.modules:`**
    - **`reload.enabled: false`**: Metricbeat는 이 설정이 **`false`**로 설정되어 있으면 구성 파일이 변경되어도 모듈을 다시로드하지 않는다. 다시로드를 비활성화하는 데 사용된다.
    - **`reload.period: 10s`**: 구성 파일의 변경을 확인하는 주기를 나타낸다. 이 경우에는 10초로 설정되어 있다.
2. **`setup.dashboards.enabled: true`**: 이 설정이 **`true`**로 설정되어 있으면 Metricbeat가 Kibana 대시보드 설정을 활성화한다. 이는 Metricbeat가 Elasticsearch에서 데이터를 가져와 Kibana 대시보드에 표시할 수 있도록 도와준다.
3. **`setup.kibana.host: kibana:5601`**: Metricbeat가 대시보드를 설정할 Kibana의 호스트 및 포트를 지정한다. 이는 Kibana의 주소를 설정하는 데 사용된다.
4. **`output.elasticsearch.hosts: ['211.183.3.100:9200']`**: Metricbeat가 수집한 데이터를 전송할 Elasticsearch 호스트를 지정한다. 여기서는 **`211.183.3.100`**의 IP 주소와 **`9200`** 포트를 사용한다.
5. **`metricbeat.modules`**: 이 부분은 Metricbeat가 수집할 메트릭과 관련 설정을 정의한다. 여기서는 **`system`** 모듈이 활성화되어 있으며, CPU, 로드, 메모리, 네트워크, 프로세스 등의 메트릭을 수집하고 있다.모든 메트릭은 10초마다 수집되게 설정했다.

## MetricBeat.yaml
- 인덱스 패턴 받아오기
- http://211.183.3.100:5601/app/home#/tutorial/logstashMetrics

## DockerSwarm을 위한 token 발행

- token

```bash
sudo hostnamectl set-hostname worker1

user1@manager:~$ docker swarm join-token manager
To add a manager to this swarm, run the following command:

    docker swarm join --token SWMTKN-1-0dfpai1r9exo1qvi2ig1jzedfyms6guure64q3nu997kfn7hwq-0u2bm0z6ihfcbd2mbk523e17z 211.183.3.100:2377

user1@manager:~$ docker swarm join-token worker
To add a worker to this swarm, run the following command:

    docker swarm join --token SWMTKN-1-0dfpai1r9exo1qvi2ig1jzedfyms6guure64q3nu997kfn7hwq-5tf8xv7j3dzekzhefwsb33sqx 211.183.3.100:2377
```

<img width="702" alt="image" src="https://github.com/user-attachments/assets/274b972f-21ee-45f1-984f-48e24a7ffe27">

## 레이블 추가하기

```bash
user1@manager:~$ docker node update --laber-add zone=a --label-add app=web worker1
unknown flag: --laber-add
See 'docker node update --help'.
user1@manager:~$ docker node update --label-add zone=a --label-add app=web worker1
worker1
user1@manager:~$ docker node update --label-add zone=a --label-add app=web worker2
worker2
user1@manager:~$ docker node update --label-add zone=b --label-add app=web worker3
worker3
```

# ElasticSearch

- 환경세팅 (download elasticsearch)

```bash
############## elasticsearch / kibana #####################

 sudo apt install openjdk-11-jre-headless -y

 wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.17.7-amd64.deb

 wget https://artifacts.elastic.co/downloads/kibana/kibana-7.17.7-amd64.deb

 sudo dpkg -i elasticsearch-7.17.7-amd64.deb

 sudo dpkg -i kibana-7.17.7-amd64.deb

 sudo systemctl daemon-reload # 시스템 재부팅하지않고 구성파일 변경사항을 적용

 sudo systemctl enable elasticsearch --now

 sudo systemctl enable kibana --now

 sudo systemctl disable ufw --now
```

- 실행코드

```bash
curl -L -O https://artifacts.elastic.co/downloads/beats/metricbeat/metricbeat-7.17.7-amd64.deb
sudo dpkg -i metricbeat-7.17.7-amd64.deb

/etc/metricbeat/metricbeat.yml

output.elasticsearch:
  hosts: ["<es_url>"]
  username: "elastic"
  password: "<password>"
setup.kibana:
  host: "<kibana_url>"

sudo metricbeat modules enable kibana

sudo metricbeat setup

sudo service metricbeat start
```

<img width="623" alt="image" src="https://github.com/user-attachments/assets/d2d21827-4f81-4cdf-8a7f-dc34d42f6049">

- sudo vi /etc/metricbeat/metricbeat.yml

```bash
Overwriting ILM policy is disabled. Set `setup.ilm.overwrite: true` for enabling.

Index setup finished.
Loading dashboards (Kibana must be running and reachable)
Exiting: error connecting to Kibana: fail to get the Kibana version: HTTP GET request to http://211.173.3.100..5601:5601/api/status fails: fail to execute the HTTP GET request: Get "http://211.173.3.100..5601:5601/api/status": lookup 211.173.3.100..5601: no such host. Response: .
```

- status
<img width="694" alt="image" src="https://github.com/user-attachments/assets/ca44fb83-c545-423b-9d09-54ccd4546a79">
<img width="693" alt="image" src="https://github.com/user-attachments/assets/6d068f80-5459-4f35-bd33-3f878324f3d3">

metricbeat.yaml 파일을 편집하여 Elasticsearch에 데이터를 전송하고, index 패턴을 정의하여 데이터를 저장
및 조회하였다.

## Wordpress 배포

docker-compose.yaml

```bash
user1@manager:~/0212$ cat docker-compose.yaml
version: "3.8"

# 동일 기능을 제공하는 컨테이너들은 서비스로 그룹핑된다.
services:
  web:
    image: wordpress
    ports:
      - "8001-8009:80"
    deploy:
      mode: replicated
      replicas: 2
      placement:
        constraints: [ node.labels.zone == A ]
    restart: always
    volumes:
      - web_data:/var/www/html
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: wordpress
      WORDPRESS_DB_NAME: wordpress
    depends_on:
      - db

    networks:
      - web_net

  db:
    image: mysql:5.7
    ports:
      - "33061-33069:3306"
    deploy:
      mode: replicated
      replicas: 2
      placement:
        constraints: [ node.labels.zone == A ]
    environment:
      MYSQL_ROOT_PASSWORD: wordpress
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: wordpress

    restart: always
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - web_net

networks:
  web_net: {}

volumes:
  db_data: {}

  web_data: {}
```

- 배포

```bash
docker stack deploy -c=wordpress.yaml web
```

<img width="694" alt="image" src="https://github.com/user-attachments/assets/a1b2a80f-8af9-48bf-a5ab-7352046c7115">

211.183.3.100:8001로 접속하여 연동이 잘된 것을 확인할 수 있었다.

# Mariadb.yaml

## Mariadb는 10.4 버전으로 !!!!

- Docker 는 항상 이미지를 당겨오고 이미지를 활용하여 docker run을 한다.
   - image의 버전을 항상 맞추어야 한다.
- Ubuntu 환경에서 mariadb를 연동하자.
- Worker3에서 진행을 하도록 한다. 버전은 10.4 ver를 사용한다.
- docker swarm으로 구성할 것 이기 때문에 manager에서 작업을 한다.

- es_mariadb.yaml

```bash
version: '3.7'

services:
  mariadb:
    image: mariadb:10.4
    environment:
      MYSQL_ROOT_PASSWORD: test1234
    volumes:
      - db1:/var/lib/mysql
    networks:
      - es-bridge
    deploy:
      mode: global
      placement:
        constraints: [node.hostname == worker3]
      restart_policy:
        condition: on-failure
        max_attempts: 3
    ports:
      - "3306:3306"
volumes:
  data:
    driver: local
  db1:
    driver: local

networks:
  es-bridge:
    driver: overlay
```

- 실행코드

```bash
docker stack deploy --with-registry-auth -c=es_mariadb.yaml es_mariadb
Creating network es_mariadb_es-bridge
```

- docker Swarm을 이용한 스택베포

```bash
user1@manager:~$ docker stack deploy --with-registry-auth -c=es_mariadb.yaml es_mariadb
Creating network es_mariadb_es-bridge
Creating service es_mariadb_mariadb
user1@manager:~$ docker stack ps es_mariadb
ID             NAME                                           IMAGE          NODE      DESIRED STATE   CURRENT STATE           ERROR     PORTS
8cqy52vngpgf   es_mariadb_mariadb.sifl9joeyjiata9pvc4yrfsf7   mariadb:10.4   worker3   Running         Running 2 seconds ago
```

- 컨테이너 생성
<img width="695" alt="image" src="https://github.com/user-attachments/assets/88683758-b1e0-4e04-8f45-3d1cd0ccc05c">
## Github-action

``` bash
name: GitHub Actions Demo
run-name: ${{ github.actor }} is testing out GitHub Actions 🚀
on: [push]
jobs:
  Explore-GitHub-Actions:
    runs-on: ubuntu-latest
    steps:
      - run: echo "🎉 The job was automatically triggered by a ${{ github.event_name }} event."
      - run: echo "🐧 This job is now running on a ${{ runner.os }} server hosted by GitHub!"
      - run: echo "🔎 The name of your branch is ${{ github.ref }} and your repository is ${{ github.repository }}."
      - name: Check out repository code
        uses: actions/checkout@v4
      - run: echo "💡 The ${{ github.repository }} repository has been cloned to the runner."
      - run: echo "🖥️ The workflow is now ready to test your code on the runner."
      - name: List files in the repository
        run: |
          ls ${{ github.workspace }}
      - run: echo "🍏 This job's status is ${{ job.status }}."
```
<img width="679" alt="image" src="https://github.com/user-attachments/assets/a380d171-baae-4a26-8244-1577edc6bf87">

## 프로젝트 결론

1. **분산 시스템 모니터링 및 관리**: ELK Stack 및 Docker Swarm과 같은 도구를 사용하여 분산 시스템에서 발생하는 로그 및 메트릭 데이터를 수집, 분석 및 시각화하는 방법을 배울 수 있었다. 이를 통해 시스템의 상태 및 성능을 효과적으로 관리할 수 있었다.
2. **데이터 시각화 및 분석**: Kibana와 같은 도구를 사용하여 Elasticsearch에 저장된 데이터를 시각화하고 분석하는 방법을 배울 수 있었다. 이를 통해 데이터를 효과적으로 시각화하여 시스템의 상태 및 성능을 이해하고 개선할 수 있다.
3. **컨테이너 환경 관리 및 모니터링**: Docker Swarm을 사용하여 컨테이너 환경을 관리하고 모니터링하는 방법을 배울 수 있었다.
4. **자동화 및 확장성**: Docker Swarm과 ELK Stack을 통해 자동화된 모니터링 및 조치를 구현하고 확장성을 고려하여 시스템을 설계하는 방법을 배울 수 있었다.

최종적으로, 이 프로젝트를 통해 분산 시스템 관리 및 모니터링에 필요한 다양한 기술과 도구를 습득하고, 시스템의 안정성과 성능을 향상시키는 데 기여할 수 있었다.

