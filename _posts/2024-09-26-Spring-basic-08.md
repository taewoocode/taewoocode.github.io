---
layout: post
title: Spring Basic 07 - Bean Scope 02
subtitle: ""
categories: framework
tags: spring
comments: false
---

## 싱글톤과 프로토타입 빈

- clientBean은 싱글톤이다. → 스프링 컨테이너 생성 시점에 함께 생성되고, 의존관계 주입도 발생한다.
- clientBean은 의존관계 자동 주입을 사용한다. 주입 시점에 스프링 컨테이너에 프로토타입 빈을 요청한다.
- 스프링 컨테이너는 프로토타입 빈을 생성해서 `clientBean`에 반환한다. 프로토타입 빈의 count필드 값은 0이다.
- clentBean은 프로토타입 빈의 참조값을 보관한다(내부 필드를 말한다.)

<img width="699" alt="image" src="https://github.com/user-attachments/assets/d24d7184-c9a4-453e-8ff5-5f69635cf562">
<img width="697" alt="image" src="https://github.com/user-attachments/assets/973b6327-48d8-4140-a6cb-db278cae2563">

- 클라이언트가 clientBean을 컨테이너에게 요청해서 반환받는다. 싱글톤이므로 항상 같은 clientBean을 반환받게 된다.
- 클라이언트 A는 `clientBean.logic()` 을 호출한다.
- clientBean`은 prototypeBean의`addCount()` 를 호출해서 프로토타입 빈의 count를 증가한다.
count값이 1이 된다.
- **여기서** **중요한** **점이** **있는데**, clientBean**이** **내부에** **가지고** **있는** **프로토타입** **빈은** **이미** **과거에** **주입이** **끝난** **빈이다**. **주입** **시점에** **스프링** **컨테이너에** **요청해서** **프로토타입** **빈이** **새로** **생성이** **된** **것이지**, **사용** **할** **때마다** **새로** **생성되는** **것이** **아니다**!**
- `clientBean` 은 prototypeBean의 `addCount()` 를 호출해서 프로토타입 빈의 count를 증가한다. 원
  래 count 값이 1이었으므로 2가 된다.

## 싱글톤 빈이 프로토타입 빈을 주입받을 경우
<img width="697" alt="image" src="https://github.com/user-attachments/assets/ecbf385d-28cf-4c05-b97b-c8a997e5ae6c">
<img width="692" alt="image" src="https://github.com/user-attachments/assets/d9bfa24b-7e4e-46e3-93dd-8143103aef0b">
  
- Scope에 singleton이라고 명시를 해줬는데 사실 아무것도 쓰지 않은 값이어도 default로 싱글톤이 유지된다.
- 여기서 중요한 점은 싱글톤 빈인 `ClientBean`이 **프로토타입 빈을 주입받을 경우**, `ClientBean`이 생성될 때만 `PrototypeBean`의 인스턴스가 주입된다. 즉, `ClientBean`이 생성될 때 주입된 **하나의 프로토타입 빈 인스턴스**를 계속 사용하게 된다. 이후에 `logic()` 메서드를 호출할 때마다 새로운 `PrototypeBean`이 생성되지 않고, 처음 주입된 동일한 인스턴스를 사용하게 되는 것이다. → 그 이유는 이미 생성시점에 빈을 만들어 두었기 때문이다.
- 사실 프로토타입빈은 요청할 때 마다 계속 다른 인스턴스를 보내주는 개념인데 싱글톤과 같이 사용하게 된다면 싱글톤이 더 우선이 되는 거 같은 개념인 것 같다.



## Reference

김영한님의 스프링 강의 정리