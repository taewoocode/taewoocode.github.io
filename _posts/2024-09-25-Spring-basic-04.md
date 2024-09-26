---
layout: post
title: Spring Basic 04 - Autowired 는 타입으로 조회를 한다
subtitle: ""
categories: framework
tags: spring
comments: false
---

## @Autowired 는 타입으로 조회를 한다.

```java
@Autowired
private Discountpolicy discountpolicy
```

- 타입으로 조회를 하기 때문에 마치 다음 코드와 유사하게 동작한다.
- ac.getBean(DiscountPolicy.class)

## 빈이 2개 이상일 때 문제가 발생한다.

```java
@Component
public class FixDiscountPolicy DiscountPolicy {}

@Component
public class RateDiscountPolicy implements DiscountPolicy {}
```

그리고 의존관계를 주입을 해주면

```java
@Autowired
private RateDiscountPolicy discountPolicy
```

- NoUniqueBeanDefinitionException이 발생한다.

## Autowired 매칭정리

- 타입 매칭
- 타입 매칭의 결과가 2개 이상일 때 필드 명으로 빈 이름 매칭

## Qulifier 사용

- @Qulifier는 추가 구분자를 붙여주는 방법이다. 주입시 추가적인 방법을 제공하는 것이지 빈 이름을 변경하는 것은 아니다.

### 빈 등록시 Qulifier를 붙여준다

```java
 @Component
 @Qualifier("mainDiscountPolicy")
public class RateDiscountPolicy implements DiscountPolicy {} ```

 @Component
 @Qualifier("fixDiscountPolicy")
public class FixDiscountPolicy implements DiscountPolicy {}
```

### **주입시에 @Qualifier를 붙여주고 등록한 이름을 적어준다**

```java
@Autowired
 public OrderServiceImpl(MemberRepository memberRepository, @Qualifier("mainDiscountPolicy") DiscountPolicy discountPolicy) {
     this.memberRepository = memberRepository;
     this.discountPolicy = discountPolicy;
}

```

`@Qualifier` 로 주입할 때 `@Qualifier("mainDiscountPolicy")` 를 못찾으면 어떻게 될까? 그러면 mainDiscountPolicy라는 이름의 스프링 빈을 추가로 찾는다. 하지만 경험상 `@Qualifier` 는 `@Qualifier` 를 찾 는 용도로만 사용하는게 명확하고 좋다.

## Primary

- @Primary는 우선권을 가지는 방법이다. @Autowired 시에 여러 빈이 매칭이 되면 @Primary가 우선권을 가진다.

### **@Primary, @Qualifier 활용**

코드에서 자주 사용하는 메인 데이터베이스의 커넥션을 획득하는 스프링 빈이 있고, 코드에서 특별한 기능으로 가끔 사용하는 서브 데이터베이스의 커넥션을 획득하는 스프링 빈이 있다고 생각해보자. 메인 데이터베이스의 커넥션을 획득하는 스프링 빈은 `@Primary` 를 적용해서 조회하는 곳에서 `@Qualifier` 지정 없이 편리하게 조회하고, 서브 데이터베이스 커넥션 빈을 획득할 때는 `@Qualifier` 를 지정해서 명시적으로 획득 하는 방식으로 사용하면 코드를 깔끔하게 유지할 수 있다. 물론 이때 메인 데이터베이스의 스프링 빈을 등록할 때 `@Qualifier` 를 지정해주는 것은 상관없다.

### 우선순위

`@Primary` 는 기본값 처럼 동작하는 것이고, `@Qualifier` 는 매우 상세하게 동작한다. 이런 경우 어떤 것이 우선권을가져갈까? 스프링은 자동보다는 수동이, 넒은 범위의 선택권 보다는 좁은 범위의 선택권이 우선 순위가 높다. 따라서 여기서도 `@Qualifier` 가 우선권이 높다.



## Reference

김영한님의 스프링 강의 정리