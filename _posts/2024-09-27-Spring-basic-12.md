---
layout: post
title: Spring Basic 12 - Dependency Injection 01
subtitle: ""
categories: framework
tags: spring
comments: false
---

## Dependency Injection

Dependency Injection이란 외부에서 두 객체 간의 관계를 결정해주는 디자인 패턴이다. 
인터페이스를 사이에 둬서 클래스 레벨에서는 의존관계가 고정되지 않도록 하고 런타임 시에 관계를 동적으로 주입하여 유연성을 확보하고 결합도를 낮출 수 있게 해준다.
의존성이란 한 객체가 다른 객체를 사용할 때 의존성이 있다고 한다.
즉 동적인 의존관계는 애플리케이션 실행시점에 `외부에서 실제 구현 객체를 생성하고 클라이언트에 전달`을 해서 클라이언트와 서버의 실제 의존관계를 연결되는 것을 Dependency Injection이라고 한다.
의존관계 주입을 사용하면 클라이언트 코드를 변경하지 않고, 클라이언트가 호출하는 대상의 타입 인스턴스를 변경할 수 있다는 장점을 가지고 있다.

```java
Public class Store {

	private Box box;
```

<img width="652" alt="image" src="https://github.com/user-attachments/assets/a882ad31-7db3-49ca-92cd-f13e098f2b1f">



그리고 두 객체 간의 관계(의존성)을 맺어주는 것을 의존성 주입이라고 하는데 생성자 주입, 필드 주입, 수정자 주입등 다양한 주입 방법이 있으며, 스프링은 생성자 주입을 권장하고 있다.(인텔리제이도 생성자 주입을 권장한다.)

## 그럼 왜 의존성 주입(DI)가 필요할까?

```java
public class Store {

    private Box box;

    public Store() {
        this.box = new Box();
    }
}
```

- 위와 같은 예시 클래스는 크게 다음과 같은 문제점을 가지고 있다.
- 두 클래스가 강하게 결합되어 있음
- 객체들 간의 관계가 아니라 클래스 간의 관계가 맺어짐

클래스 끼리의 관계가 강하게 맺어져 있는 코드이기 때문에 유연성이 떨어진다.
유연성이 떨어진다는 말은 클래스 끼리의 관계를 맺고 있기 때문인데 그 이유는 Store에서 만약 Box가 아닌 Chicken을 팔게 된다면 Store 클래스에서 생성자의 변경이 필요하기 때문에 유연성이 떨어진다.
각각의 다른 품목을 팔기 위해서 생성자만 다르고 나머지는 중복되는 Store 클래스들이 생성되는 것은 좋지 못하다. 이에 대한 해결책으로 상속을 생각할 수 있지만 상속은 제약이 많고 확장성이 떨어지므로 지양하는 것이 좋다.
Store와 Box는 객체들 간의 관계가 아닌 클래스들 간의 관계가 맺어져 있다.
객체지향을 배운 설계자라면 객체들 끼리의 관계를 맺는 것에 충분한 고민을 해보아야 한다.
객체들 간의 관계가 맺어진다면 다른 객체의 구체 클래스를 몰라도 해당 클래스가 인퍼테이스를 구현한 구현객체라면 인터페이스의 타입으로 사용한다. 즉 다형성을 최대한 활용한다. 부모는 자식을 담을 수 있다~

```java
public interface merchandise {

}

public class Box implements Merchandise {

}
```

이제는 클래스 간의 강한 결합을 제거 해주어야 한다. 즉 DI를 활용하여 외부에서 상품을 주입 받아야 한다. 
그래야 구체 클래스에 의존하지 않을 수 있다.

<img width="449" alt="image" src="https://github.com/user-attachments/assets/dea4c5ff-f7cc-4596-8536-fdc2f3d0784e">

Store에서 Merchandise 객체를 주입하기 위해서는 애플리케이션 실행시적 즉 동적인 시점에 필요한 객체를 생성한 이후 의존성이 있는 두 객체를 연결하기 위해 한 객체를 다른 객체로 주입시켜야 한다.
box라는 객체를 만들고, 그 객체를 store로 주입시켜주는 역할을 위해 컨테이너가 필요한 것이다.
위에 명시한 코드는 스프링이라는 프레임워크가 완벽하게 저 부분을 재구성해주며 지원해준다.
스프링은 특정 위치부터 클래스를 탐색하고, 객체를 만들며, 객체들의 관계까지 설정해준다. 이렇게 편리한데 스프링을 쓰지 않을 이유가 없는 것이다.

### 정리

- 한 객체가 어떤 객체(구체 클래스)에 의존할 것인지는 별도의 관심사로 분리한다. Spring은 DI를 도와주는 DI 컨테이너로써 강하게 결합된 클래스들을 분리하고, 객체간의 관계를 결정해 줌으로써 결합도를 낮추고 유연성을 보장해준다.



## Reference

<https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html>