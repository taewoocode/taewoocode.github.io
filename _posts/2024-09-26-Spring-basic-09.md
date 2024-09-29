---
layout: post
title: Spring Basic 09 - Bean Scope 03
subtitle: ""
categories: framework
tags: spring
comments: false
---

## 싱글톤 빈과 프로토타입 빈을 함께 사용할 때 마다 새로운 빈 형성하기

- 심플하게 생각해보면 싱글톤 빈이 프로토타입을 사용할 때 마다 스프링 컨테이너에게 새로 요청하는 것
- 의존관계를 외부에서 주입(DI) 받는게 아니라 이렇게 직접 필요한 의존관계를 찾는 것을 Dependency Lookup(DL) 의존관계 조회(탐색) 이라한다.
- 그런데 이렇게 스프링의 애플리케이션 컨텍스트 전체를 주입받게 되면, 스프링 컨테이너에 종속적인 코드가 되고,단위 테스트도 어려워진다.
- 지금 필요한 기능은 지정한 프로토타입 빈을 컨테이너에서 대신 찾아주는 딱! **DL** 정도의 기능만 제공하는 무언가가 있으면 된다.

## ObjectFactory, ObjectProvider

지정한 빈을 컨테이너에서 대신 찾아주는 DL 서비스를 제공하는 것이 바로 `ObjectProvider` 이다. 
참고로 과거에는`ObjectFactory` 가 있었는데, 여기에 편의 기능을 추가해서 `ObjectProvider` 가 만들어졌다.

<img width="655" alt="image" src="https://github.com/user-attachments/assets/abd97ea9-8dd3-454f-a0d2-6bbc4b1b839f">

- 실행해보면 `prototypeBeanProvider.getObject()` 을 통해서 항상 새로운 프로토타입 빈이 생성되는 것을 확인할 수 있다.
- `ObjectProvider` 의 `getObject()` 를 호출하면 내부에서는 스프링 컨테이너를 통해 해당 빈을 찾아서 반환한다.
- 스프링이 제공하는 기능을 사용하지만, 기능이 단순하므로 단위테스트를 만들거나 mock 코드를 만들기는 훨씬 쉬워진다.

<img width="661" alt="image" src="https://github.com/user-attachments/assets/2e3abcbf-ca36-455a-aa56-319896f8b1f9">

- ObjectProvider는 ObjectFactory를 상속받고 있다. 스트림 처리등 편의 기능이 많다. 그리고 스프링에 의존하고 있다.

<img width="691" alt="image" src="https://github.com/user-attachments/assets/1430459e-9584-4ca6-9a46-593668cfee88">
<img width="701" alt="image" src="https://github.com/user-attachments/assets/18aab303-e323-45bb-9699-ec4454a484d9">

실행해보면 `provider.get()` 을 통해서 항상 새로운 프로토타입 빈이 생성되는 것을 확인할 수 있다.
`provider` 의 `get()` 을 호출하면 내부에서는 스프링 컨테이너를 통해 해당 빈을 찾아서 반환한다. (**DL**)
자바 표준이고, 기능이 단순하므로 단위테스트를 만들거나 mock 코드를 만들기는 훨씬 쉬워진다.
`Provider` 는 지금 딱 필요한 DL 정도의 기능만 제공한다.

## 프로토타입은 그럼 언제 사용할까?

- 사용할 때 마다 의존관계 주입이 완료된 새로운 객체가 필요할 때 사용된다.

## Reference

김영한님의 스프링 강의 정리 + 어렵다 스프링