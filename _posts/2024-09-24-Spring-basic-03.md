---
layout: post
title: Spring Basic 03 - 생성자 주입을 선택하라
subtitle: ""
categories: framework
tags: spring
comments: false
---

## 불변

- 대부분의 의존관계 주입은 한번 일어나면 애플리케이션 종료시점까지 의존관계를 변경할 일이 없다.
- 의존관계는 애플리케이션 종료 전까지 변하면 안된다.
- 수정자 주입을 사용하면 get, set 메서드를 public으로 열어두어야 한다.
- 누군가 실수로 변경할 수도 있고, 변경하면 안되는 메서드를 열어두는 것은 좋은 설계 방법이 아니다.
- 생성자 주입은 객체를 생성할 때 딱 1번만 호출이 되므로 이후에 호출될 일이 거의 없다. 따라서 불변하게 설계할 수도 있다.

```java
@Test
    void createOrder2() {
        OrderServiceImpl orderService = new OrderServiceImpl();
        orderService.createOrder( 1L, "itemA", 10000 );

    }
```

<img width="697" alt="image" src="https://github.com/user-attachments/assets/f893f6f4-7245-4ca1-a458-9dc8fb34be5a">

그런데 막상 실행 결과는 NPE(Null Point Exception)이 발생하는데, memberRepository, discountPolicy 모두의존관계 주입이 누락되었기 때문이다.
생성자 주입을 사용하면 다음처럼 주입 데이터를 누락 했을 때 ****컴파일 오류****가 발생한다.
그리고 IDE에서 바로 어떤 값을 필수로 주입해야 하는지 알 수 있다.

```java
@Component
public class OrderServiceImpl implements OrderService {

    private final MemberRepository memberRepository; //회원 저장소 역할
    private final DiscountPolicy discountPolicy; //인터페이스만 의존하고 있다.-> 하지만 문제가 있다. -> NullPointException
	  
	  //생성자 주입
    public OrderServiceImpl(MemberRepository memberRepository, DiscountPolicy discountPolicy) {
        this.memberRepository = memberRepository;
        this.discountPolicy = discountPolicy;
    }
```

- 생성자 주입을 선택하면 fianl 키워드를 넣을 수 있다.
- 실수로 생성자를 만드는데 코드를 누락하는 경우 컴파일 에러를 통해서 문제점을 바로 잡을 수 있다.
    - 불변과 누락을 방지한다.

## 정리

- 생성자 주입 방식을 선택하는 이유는 여러가지가 있지만, 프레임워크에 의존하지 않고, 순수한 자바 언어의 특징을 잘 살리는 방법이다.
- 기본으로 생성자 주입을 사용하고, 필수 값이 아닌 경우에는 수정자 주입 방식을 옵션으로 부여하면 된다. 생성자 주입과 수정자 주입을 동시에 할 수 있다.
- 항상 생성자 주입을 선택하라, 그리고 가끔 옵션이 필요하면 수정자 주입을 선택하라, 필드 주입은 사용하지 않는게 좋다.




## Reference

김영한님의 스프링 강의 + 나의 뇌