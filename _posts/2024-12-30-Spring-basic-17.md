---
layout: post
title: Spring Basic 17 - spring actuator
subtitle: ""
categories: framework
tags: spring
comments: false
---

## 프로덕션 준비

운영 환경에서 서비스할 때 필요한 이런 기능들을 프로덕션 준비 기능이라 한다. 쉽게 이야기해서 프로덕션을 운영에 배포할 때 준비해야 하는 비 기능적 요소들을 뜻한다.
지표(metric), 추적(trace), 감사(auditing) 애플리케이션이 현재 살아있는지, 로그 정보는 정상 설정 되었는지, 커넥션 풀은 얼마나 사용되고 있는지 등을 확인할 수 있어야 한다.
스프링 부트가 제공하는 액추에이터는 이런 프로덕션 준비 기능을 매우 편리하게 사용할 수 있는 다양한 편의 기능들을 제공한다. 더 나아가서 마이크로미터, 프로메테우스, 그라파나 같은 최근 유행하는 모니터링 시스템과 매우 쉽게 연동할 수 있는 기능도 제공한다.
참고로 액추에이터는 시스템을 움직이거나 제어하는 데 쓰이는 기계 장치라는 뜻이다.
여러 설명보다 한번 만들어서 실행해보는 것이 더 빨리 이해가 될 것이다.

## actuator

액츄에이터가 제공하는 프로덕션 준비 기능을 사용하려면 스프링 부트 액츄에이터 라이브러리를 추가해야 한다.

build.gradle
```jsx
implementation 'org.springframework.boot:spring-boot-starter-actuator' //
```

## actuator 설정파일 등록

application.yml

```jsx
management:
  endpoints:
    web:
      exposure:
        include: "*"

```

actuator에서 제공해주는 설정파일을 등록한다.

```jsx
{
    "_links": {
        "self": {
            "href": "http://localhost:8080/actuator",
            "templated": false
        },
        "beans": {
            "href": "http://localhost:8080/actuator/beans",
            "templated": false
        },
        "caches-cache": {
            "href": "http://localhost:8080/actuator/caches/{cache}",
            "templated": true
        },
        "caches": {
            "href": "http://localhost:8080/actuator/caches",
            "templated": false
        },
        "health-path": {
            "href": "http://localhost:8080/actuator/health/{*path}",
            "templated": true
        },
        "health": {
            "href": "http://localhost:8080/actuator/health",
            "templated": false
        },
        "info": {
            "href": "http://localhost:8080/actuator/info",
            "templated": false
        },
        "conditions": {
            "href": "http://localhost:8080/actuator/conditions",
            "templated": false
        },
        "configprops": {
            "href": "http://localhost:8080/actuator/configprops",
            "templated": false
        },
        "configprops-prefix": {
            "href": "http://localhost:8080/actuator/configprops/{prefix}",
            "templated": true
        },
        "env": {
            "href": "http://localhost:8080/actuator/env",
            "templated": false
        },
        "env-toMatch": {
            "href": "http://localhost:8080/actuator/env/{toMatch}",
            "templated": true
        },
        "loggers": {
            "href": "http://localhost:8080/actuator/loggers",
            "templated": false
        },
        "loggers-name": {
            "href": "http://localhost:8080/actuator/loggers/{name}",
            "templated": true
        },
        "heapdump": {
            "href": "http://localhost:8080/actuator/heapdump",
            "templated": false
        },
        "threaddump": {
            "href": "http://localhost:8080/actuator/threaddump",
            "templated": false
        },
        "metrics-requiredMetricName": {
            "href": "http://localhost:8080/actuator/metrics/{requiredMetricName}",
            "templated": true
        },
        "metrics": {
            "href": "http://localhost:8080/actuator/metrics",
            "templated": false
        },
        "scheduledtasks": {
            "href": "http://localhost:8080/actuator/scheduledtasks",
            "templated": false
        },
        "mappings": {
            "href": "http://localhost:8080/actuator/mappings",
            "templated": false
        }
    }
}
```
## 다양한 엔드포인트

각각의 엔드포인트를 통해서 개발자는 애플리케이션 내부의 수 많은 기능을 관리하고 모니터링 할 수 있다.
스프링 부트가 기본으로 제공하는 다양한 엔드포인트에 대해서 알아보자. 다음은 자주 사용하는 기능 위주로 정리했다.
- `beans` : 스프링 컨테이너에 등록된 스프링 빈을 보여준다.
- `conditions` : `condition` 을 통해서 빈을 등록할 때 평가 조건과 일치하거나 일치하지 않는지 보여준다.
- `configprops` : `@ConfigurationProperties` 를 보여준다.
- `env` : `Environment` 정보를 보여준다.
- `health` : 애플리케이션 헬스 정보를 보여준다.
- `httpexchanges` : HTTP 호출 응답 정보를 보여준다. `HttpExchangeRepository` 를 구현한 빈을 별도로 등록해야 한다.
- `info` : 애플리케이션 정보를 보여준다.
- `loggers` : 애플리케이션 로거 설정을 보여주고 변경도 할 수 있다.
- `metrics` : 애플리케이션의 메트릭 정보를 보여준다.
- `mappings` : `@RequestMapping` 정보를 보여준다.
- `threaddump` : 쓰레드 덤프를 실행해서 보여준다.
- `shutdown` : 애플리케이션을 종료한다. 이 기능은 **기본으로 비활성화** 되어 있다.

위와 같은 정보들을 제공받을 수 있다.
Bean은 등록됬는지 안됬는지도 확인이 가능하다.

## Reference

<https://docs.spring.io/spring-boot/docs/current/reference/html/>

<https://docs.spring.io/spring-boot/reference/features/profiles.html>