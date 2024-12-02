---
layout: post
title: Spring MVC 01 - FrontController 
subtitle: ""
categories: framework
tags: mvc
comments: false
---

## FrontController

<img width="654" alt="image" src="https://github.com/user-attachments/assets/b757077e-b69d-471c-8131-ef8f894e07d4">

- FrontController **패턴** **특징**
- 프론트 컨트롤러 서블릿 하나로 클라이언트의 요청을 받음 프론트 컨트롤러가 요청에 맞는 컨트롤러를 찾아서 호출 입구를 하나로! 공통 처리 가능 프론트 컨트롤러를 제외한 나머지 컨트롤러는 서블릿을 사용하지 않아도 됨
- **스프링** **웹** MVC**와** **프론트** **컨트롤러**
- 스프링 웹 MVC의 핵심도 바로 **FrontController** 스프링 웹 MVC의 **DispatcherServlet**이 FrontController 패턴으로 구현되어 있음

프론트 컨트롤러를 단계적으로 도입해보자. 이번 목표는 기존 코드를 최대한 유지하면서, 프론트 컨트롤러를 도입하는 것이다. 먼저 구조를 맞추어두고 코드를 짜보자

<img width="654" alt="image" src="https://github.com/user-attachments/assets/f5a6fac1-4ca1-41ef-9c06-047892253c6c">

서블릿과 비슷한 모양의 컨트롤러 인터페이스를 도입한다. 각 컨트롤러들은 이 인터페이스를 구현하면 된다. 
프론트 컨트롤러는 이 인터페이스를 호출해서 구현과 관계없이 로직의 일관성을 가져갈 수 있다.
이제 이 인터페이스를 구현한 컨트롤러를 만들어보자. 지금 단계에서는 기존 로직을 최대한 유지하는게 핵심이다.

<img width="654" alt="image" src="https://github.com/user-attachments/assets/1b733f18-52f0-4811-9ef0-d1c8166ed0ce">
<img width="654" alt="image" src="https://github.com/user-attachments/assets/ceab8ac4-35ba-454d-b1c0-8a4010d6e1ec">
<img width="654" alt="image" src="https://github.com/user-attachments/assets/be88842e-9e37-48b7-81d8-cbfb5f9850ee">

## 왜 ControllerV1을 반환할까?

<img width="654" alt="image" src="https://github.com/user-attachments/assets/304f23ca-00b2-4d0a-8cc5-11b41bc1d22c">

이유는 ControllerMap에서 `requestURI`에 매핑된 값을 가져온다.

1. ControllerMap 값 타입은 ControllerV1
   `controllerMap`은 `Map<String, ControllerV1>`로 선언되어 있다. 따라서, `.get(key)` 메서드는 `ControllerV1` 타입을 반환한다.
2. **다형성 적용**
   `ControllerV1`은 인터페이스이므로, `controllerMap`에 저장된 객체들은 `ControllerV1`을 구현하는 클래스의 인스턴스이다.
    - `new MemberFormControllerV1()`
    - `new MemberSaveControllerV1()`
    - `new MemberListControllerV1()`
이러한 구현체들은 모두 `ControllerV1` 타입으로 취급될 수 있습니다. 따라서, `controllerMap.get()`이 반환하는 값은 `ControllerV1` 타입이다.

## Reference

<https://docs.spring.io/spring-framework/docs/3.0.0.M4/spring-framework-reference/html/ch15s02.html>
<https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html>