---
layout: post
title: Spring MVC 03 - Logger
subtitle: ""
categories: framework
tags: mvc
comments: false
---

## 로깅 라이브러리

운영 시스템에서는 System.out.println() 같은 시스템 콘솔을 사용해서 필요한 정보를 출력하지 않고, 
별도의 로깅 라이브러리를 사용해서 로그를 출력한다.
- 로그 라이브러리는 Logback, Log4J, Log4J2등등 수 많은 라이브러리가 있는데, 그것을 통합해서 인터페이스로 제공하는 것이 바로 SLF4J 라이브러리다.
- 쉽게 이야기해서 SLF4J는 인터페이스이고, 그 구현체로 LogBack을 대부분 사용한다.

## RestController, Controller 차이?

- @RestController
  - @Controller는 반환 값이 `String` 이면 뷰 이름으로 인식된다. 그래서 `뷰를 찾고 렌더링` 된다.
  - @RestController는 반환 값을초 뷰를 찾는 것이 아니라, HTTP 메시지 바디에 바로 입력 한다. 따라서 실행 결과로 ok 메시지를 받을 수 있다. @ResponseBody와 관련이 있는데, 뒤에서 더 자세히 설명한다.

```kotlin
log.info("info log" + name)
```

위와 같은 형식으로 로그를 출력하면 안된다.
이유는 로그를 출력하기 전에 이미 더해지는 연산이 일어나기 때문이다.

## 로그 사용시 장점

- 쓰레드 정보, 클래스 이름 같은 부가 정보를 함께 볼 수 있고, 출력 모양을 조정할 수 있다.
- 로그 레벨에 따라 개발 서버에서는 모든 로그를 출력하고, 운영서버에서는 출력하지 않는 등 로그를 상황에 맞게 조절할 수 있다.
- 시스템 아웃 콘솔에만 출력하는 것이 아니라, 파일이나 네트워크 등, 로그를 별도의 위치에 남길 수 있다. 특히 파일로 남길 때는 일별, 특정 용량에 따라 로그를 분할하는 것도 가능하다.
- 성능도 일반 System.out보다 좋다. (내부 버퍼링, 멀티 쓰레드 등등) 그래서 실무에서는 꼭 로그를 사용해야 한다.

## Reference

<http://www.slf4j.org>

<http://logback.qos.ch>

<https://docs.spring.io/spring-boot/docs/current/reference/html/spring-boot-features.html#boot-features-logging?>

## 올바른 로그 사용법

![image](https://github.com/user-attachments/assets/76665cb7-f66e-4866-88bd-24cec95b34fe)


## Reference

<https://docs.spring.io/spring-framework/docs/3.0.0.M4/spring-framework-reference/html/ch15s02.html>
<https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html>