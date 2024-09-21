---
layout: post
title: DockerFile로 Spring Image 만들기
subtitle: ''
categories: devops
tags: docker
comments: false
---

## 도커파일 정의

DockerFile

```bash
# Use an appropriate base image for Java
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the JAR file from the local machine to the container
COPY build/libs/APIServer-0.0.1-SNAPSHOT.jar app.jar

# Set environment variables
ENV SPRING_DATASOURCE_URL=jdbc:mysql://host.docker.internal:3306/user?serverTimezone=Asia/Seoul
ENV SPRING_DATASOURCE_USERNAME=root
ENV SPRING_DATASOURCE_PASSWORD= 
ENV SPRING_JPA_HIBERNATE_DDL_AUTO=create
ENV SPRING_DATASOURCE_DRIVER_CLASS_NAME=com.mysql.cj.jdbc.Driver
ENV SPRING_JPA_PROPERTIES_HIBERNATE_SHOW_SQL=true
ENV SPRING_JPA_PROPERTIES_HIBERNATE_FORMAT_SQL=true
ENV SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.MySQLDialect

# Expose port 8080 to the outside world
EXPOSE 8080

# Run the JAR file
ENTRYPOINT ["java", "-jar", "app.jar"]
```

- 도커 컨테이너를 외부로 배포하기 위한 이미지 만들기 수행
- 도커 이미지를 만들기 전에 수행해야 할 것이 있는데

<img width="533" alt="image" src="https://github.com/user-attachments/assets/729d64d9-0379-48ce-8625-1b730fc7bd10">

## MYSQL SERVER 시작
<img width="425" alt="image" src="https://github.com/user-attachments/assets/ed2e6dc9-8ddb-4bec-9af8-b7a87915bce0">

- 그리고 데이터베이스에 의존성을 위해서 서버를 꼭 시작해줘야 한다.
- 안그러면 서버에 대한 의존성에 예외가 발생해서 서버가 정상작동 하지 않는다.
- 그리고 나서 localhost:8079로 접속하면 배포된 컨테이너에 접속할 수 있다.

docker ps -a

```java
*[main][~/Desktop/Study/APIServer]$ docker ps -a
CONTAINER ID   IMAGE                                 COMMAND                  CREATED              STATUS                          PORTS                                                                                                                                  NAMES
69e8b11fc3f1   taewoocode/apiserver:latest           "java -jar app.jar"      About a minute ago   Exited (1) About a minute ago                                                                                                                                          thirsty_sammet
4a9633ffa1a4   gcr.io/k8s-minikube/kicbase:v0.0.42   "/usr/local/bin/entr…"   22 hours ago         Up 22 hours                     127.0.0.1:50114->22/tcp, 127.0.0.1:50115->2376/tcp, 127.0.0.1:50117->5000/tcp, 127.0.0.1:50118->8443/tcp, 127.0.0.1:50116->32443/tcp   minikube

```

docker run -p 8079:8080 taewoocode/apiserver:latest

```java
2024-07-21T07:50:18.383Z  INFO 1 --- [nio-8080-exec-1] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring DispatcherServlet 'dispatcherServlet'
2024-07-21T07:50:18.384Z  INFO 1 --- [nio-8080-exec-1] o.s.web.servlet.DispatcherServlet        : Initializing Servlet 'dispatcherServlet'
2024-07-21T07:50:18.387Z  INFO 1 --- [nio-8080-exec-1] o.s.web.servlet.DispatcherServlet        : Completed initialization in 3 ms
^C2024-07-21T07:50:48.674Z  INFO 1 --- [ionShutdownHook] j.LocalContainerEntityManagerFactoryBean : Closing JPA EntityManagerFactory for persistence unit 'default'
2024-07-21T07:50:48.724Z  INFO 1 --- [ionShutdownHook] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Shutdown initiated...
2024-07-21T07:50:48.742Z  INFO 1 --- [ionShutdownHook] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Shutdown completed.

```

- 컨테이너로 배포 성공

### 도커허브에 올리기

도커허브에 올릴 이미지 만들기

```java
docker build -t taewoocode/apiserver:1.0 .
```

도커허브에 올릴 이미지 버전 태그하기

```java
docker tag taewoocode/apiserver:latest taewoocode/apiserver:1.0

```

## 생성된 이미지 도커허브에 푸시하기

<img width="686" alt="image" src="https://github.com/user-attachments/assets/5467eedd-0258-4379-aa0b-43913315f1e6">

```java
docker push taewoocode/apiserver:1.0

```

<img width="705" alt="image" src="https://github.com/user-attachments/assets/f8514e62-9549-40a2-9f02-90e667a79c81">

```java
https://hub.docker.com/repository/docker/taewoocode/apiserver/general
```

## Reference

<https://velog.io/@18k7102dy/Docker-Spring-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%EB%A5%BC-Docker%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%B4%EC%84%9C-%EB%B0%B0%ED%8F%AC%ED%95%B4%EB%B4%85%EC%8B%9C%EB%8B%A4>


