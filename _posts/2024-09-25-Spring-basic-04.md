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


## Reference

김영한님의 스프링 강의 정리