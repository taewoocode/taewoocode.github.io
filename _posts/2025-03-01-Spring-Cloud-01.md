---
layout: post
title: spring cloud 개요
subtitle: ""
categories: framework
tags: spring
comments: false
---

## 개요

![img.png](/assets/img/spring/img.png)

### API 게이트웨이란

**API 게이트웨이(패턴) 는 마이크로서비스 관리 / 운영을 위한 플랫폼 패턴이며 해당 패턴에 필요한 기능들을 제공하는 서버를 일컫는다.**

API 게이트웨이는 개별 서비스의 앞 단에서 모든 서비스들의 엔드포인트를 단일화하고 다음과 같은 필수 기능 요소들을 제공한다.

- **인증과 인가** : 모든 서비스들에 대한 접근에 있어서 단일 진입점에서 인증과 인가 처리를 진행
- **API 요청 로드밸런싱 및 라우팅** : API 요청을 식별하여 적절한 마이크로서비스로 전달
- **QoS(Quality of Service)** : 안정적인 서비스 제공 및 네트워크 품질을 관리하며 사용자 / 클라이언트 / API 단위로 접속 제어
- **로깅 및 모니터링** : API 요청에 대한 로깅 / 모니터링 기능 지원
- **입력 유효성 검사** : API 요청의 적절한 형식과 필수 데이터 포함 여부를 식별 및 관리

## API 게이트웨이를 왜 쓸까?

- 애플리케이션 내부 구조를 캡슐화
    - 클라이언트는 특정 서비스를 호출하지 않고 단순히 게이트웨이와 통신하며 API 게이트웨이는 각 종류의 클라이언트 각 종류의 클라이언트에 특정 API를 제공한다.
    - 클라이언트와 애플리케이션의 왕복 횟수가 감소한다. 클라이언트 코드는 최소화 된다.

## 장점이 있으면 단점도 있다.

- **개발, 배포 및 관리해야 하는 지점이 증가**
- 각 마이크로서비스의 Endpoint를 노출하기 위해 API 게이트웨이를 업데이트해야 하는데 이로 인해 **개발 병목 현상이 발생할 수 있다.**

그러나 단점이 있음에도 장점이 뚜렷하기 때문에 오늘날 마이크로서비스 아키텍처에서 API 게이트웨이는 반드시 필요한 요소로 존재하고 있다.

## application.yaml 예시

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: host_taewoo
          uri: https://host-taewoo.com
          predicates:
            - Host=host-taewoo.com # host-taewoo.com을 Host의 헤더로 요청이 들어오는 경우 해당 uri로 라우팅
        - id: cookie_taewoo
          uri: https://cookie-taewoo.com
          predicates:
            - Cookie=TAEWOO_SES, ej* # TAEWOO_SES ej* 정규식에 매칭되는 TAEWOO_SES 쿠키로 요청이 들어오는 경우 해당 uri로 라우팅
        - id: path_mangkyu
          uri: http://path-taewoo.com
          predicates:
            - Path=/hello/{path} # /hello/{path} 경로로 요청이 들어오는 경우 해당 uri로 라우팅
```

## Reference

<https://cloud.spring.io/spring-cloud-gateway/reference/html>