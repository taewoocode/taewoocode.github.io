---
layout: post
title: Spring Basic 17 - Prometheus Config
subtitle: ""
categories: framework
tags: spring
comments: false
---

## Prometheus config

프로메테우스는 메트릭을 수집하고 보관하는 DB이다. 프로메테우스가 우리 애플리케이션의 메트릭을 수집하도록 연동 해보자.
여기에는 2가지 작업이 필요하다.
- 애플리케이션 설정: 프로메테우스가 애플리케이션의 메트릭을 가져갈 수 있도록 애플리케이션에서 프로메테우스 포멧에 맞추어 메트릭 만들기
- 프로메테우스 설정: 프로메테우스가 우리 애플리케이션의 메트릭을 주기적으로 수집하도록 설정
- 프로메테우스가 애플리케이션의 메트릭을 가져가려면 프로메테우스가 사용하는 포멧에 맞추어 메트릭을 만들어야 한다.

프로메테우스는 [여기](https://github.com/prometheus/prometheus/releases/download/v2.42.0/)서 다운로드 받을 수 있다.

<img width="654" alt="Image" src="https://github.com/user-attachments/assets/3fec6a57-ba46-4314-baf2-66246c294a78" />

각각의 메트릭들은 내부에서 마이크로미터 표준 방식으로 측정되고 있다. 따라서 어떤 구현체를 사용할지 지정만 해주면 된다.

build.gradle **추가**

```jsx
implementation 'io.micrometer:micrometer-registry-prometheus'
```

마이크로미터 프로메테우스 구현 라이브러리를 추가한다.
이렇게 하면 스프링 부트와 액츄에이터가 자동으로 마이크로미터 프로메테우스 구현체를 등록해서 동작하도록 설정해준다. 
액츄에이터에 프로메테우스 메트릭 수집 엔드포인트가 자동으로 추가된다.
`/actuator/prometheus`

prometheus.yml

<img width="654" alt="Image" src="https://github.com/user-attachments/assets/7deea1ae-a0b0-41d3-bb76-336eb8d2e3f3" />
<img width="654" alt="Image" src="https://github.com/user-attachments/assets/1dac37e7-422a-4f73-8e8b-a0f753e79722" />

프로메테우스 로컬서버를 실행해준다. 
그리고 Status에서 Configuration을 확인해주면 yml에서 적용해준 설정값들이 들어가 있는 것을 확인할 수 있다.

## Reference

<https://docs.spring.io/spring-boot/api/rest/actuator/prometheus.html>

<https://docs.spring.io/spring-boot/reference/features/profiles.html>