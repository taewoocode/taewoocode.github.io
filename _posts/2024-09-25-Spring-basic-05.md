---
layout: post
title: Spring Basic 05 - 애노테이션 직접 만들기
subtitle: ""
categories: framework
tags: spring
comments: false
---

## 애노테이션 만들기

@Qualifier(”mainDiscountPolicy”) 이렇게 문자를 적으면 컴파일시 타입 체크가 안된다. 다음과 같은 애노테이션을 만들어서 문제를 해결할 수 있다.

```java
package hello.core.annotation;

import org.springframework.beans.factory.annotation.Qualifier;

import java.lang.annotation.*;

@Target({ElementType.FIELD, ElementType.METHOD, ElementType.PARAMETER, ElementType.TYPE, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@Documented
@Qualifier("mainDiscountPolicy")
public @interface MainDiscountPolicy {
}

```

<img width="694" alt="image" src="https://github.com/user-attachments/assets/a9f86b40-f051-4528-bd18-c810e6b407ae">
<img width="908" alt="image" src="https://github.com/user-attachments/assets/89772b42-9a95-4c6a-b7ab-185cf061b962">

애노테이션에는 상속이라는 개념이 없다. 이렇게 여러 애노테이션을 모아서 사용하는 기능은 자바가 지원해주는 기능 이다. 다만, **스프링 프레임워크**에서는 이 Java 애노테이션을 활용하여 특정 기능을 처리하는 데 사용한다.
스프링이 제공하는 애노테이션(`@Controller`, `@Service`, `@Autowired` 등)은 스프링의 독자적인 기능이지만, 그 기반은 Java 애노테이션이다.

## Reference

김영한님의 스프링 강의 정리