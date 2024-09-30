---
layout: post
title: Spring Basic 11 - Proxy Mode
subtitle: ""
categories: framework
tags: spring
comments: false
---

## 프록시 모드로 사용해보기

<img width="716" alt="image" src="https://github.com/user-attachments/assets/559a7154-64f4-479e-b7b3-35992bcc465b">

- `proxyMode = ScopedProxyMode.TARGET_CLASS` 를 추가해주자.
- 적용 대상이 인터페이스가 아닌 클래스면 `TARGET_CLASS` 를 선택
- 적용 대상이 인터페이스면 `INTERFACES` 를 선택

<img width="683" alt="image" src="https://github.com/user-attachments/assets/7ab13754-da53-4b47-9839-41ab02ff9593">

- 프록시 모드로 해도 Mylogger와 똑같이 동작이 된다. 코드의 구현이 변경됨이 없이 똑같이 동작할 수 있는 이유는 무엇일까?
    - 이유는 MyLogger의 가짜 프록시 클래스를 만들어두고 HTTP request와 상관 없이 `가짜 프록시 클래스`를 다른 빈에 미리 주입해 둘 수 있다.

## 프록시는 어떻게 동작할까?

<img width="632" alt="image" src="https://github.com/user-attachments/assets/b43e6ca1-3226-4838-b9ca-4bad935f17d1">
<img width="654" alt="image" src="https://github.com/user-attachments/assets/9a762e25-decf-4938-a3a0-91716b97978d">

### CGLIB**라는** **라이브러리로** **내** **클래스를** **상속** **받은** **가짜** **프록시** **객체를** **만들어서** **주입**

- `@Scope` 의 `proxyMode = ScopedProxyMode.TARGET_CLASS)` 를 설정하면 스프링 컨테이너는 CGLIB
  라는 바이트코드를 조작하는 라이브러리를 사용해서, MyLogger를 상속받은 가짜 프록시 객체를 생성한다.
- 결과는 우리가 등록한 순수한 MyLogger 클래스가 아니라 `MyLogger$ $EnhancerBySpringCGLIB` 이라는 클래스로 만들어진 객체가 대신 등록된 것을 확인한다.
- 그리고 스프링 컨테이너에 "myLogger"라는 이름으로 진짜 대신에 이 가짜 프록시 객체를 등록된다.
- 의존관계 주입도 이 가짜 프록시 객체가 주입된다.
- 즉 클라이언트 A,B가 MyLoggerProxy를 요청하게 되면 가짜 프록시 객체가 request 스코프의 진짜 mylogger.log를 호출하게 되고 가짜 프록시 객체는 원본을 상속 받아져서 만들어 졌기 때문에 객체를 사용하는 입장인 클라이언트 측에서는 이 객체가 진짜인지 가짜인지 구분할 방법은 없다. →  다형성

### 정리하면

- `CGLIB`이라는 라이브러리를 활용하여 내 클래스에 가짜 프록시 객체를 만들어서 주입한다.
- 요청이 오면 가짜 프록시 객체가 실제 빈을 요청하는 로직이다.
- 동작은 싱글톤이랑 유사하다.
- 주입되는 시점에 가짜 proxy 객체는 내부에서 실제 빈을 요청하는 위임 로직이 들어가 있다. (컨테이너 싹다 찾아봐)


## Reference

김영한님의 스프링 강의 정리