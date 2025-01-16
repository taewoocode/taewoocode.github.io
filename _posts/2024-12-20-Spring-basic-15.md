---
layout: post
title: Spring Basic 15 - ConfigurationProperties
subtitle: ""
categories: framework
tags: spring
comments: false
---

## Spring ConfigurationProperties

- 스프링은 외부 설정의 묶음 정보를 객체로 변환하는 기능을 제공한다.
- 타입 안전한 설정 속성이라 한다.
- 객체를 사용하면 타입을 사용할 수 있다.
- 따라서 타입 안전성이 보장된다.
- 객체를 통해서 활용할 수 있는 부분들이 많아진다.
- 위에서 말한 것들을 정리 해본다면 → 모든 외부 설정들을 자바코드로 관리하게 된다.
- 설정 정보 그 자체도 타입임

## 코드로 알아보자

- application.propeties

<img width="654" alt="image" src="https://github.com/user-attachments/assets/8f58f364-7b42-4ec4-9928-3b249e7684bd" />

외부 설정을 해줄 설정정보는 위와 같이 작성한다.

<img width="654" alt="image" src="https://github.com/user-attachments/assets/6793c3d4-3e4e-4a53-a140-6009f75b2e82" />

외부 설정을 주입 받을 객체를 생성한다. 
그리고 각 필드를 외부 설정의 키 값에 맞추어 준비한다.
`@ConfigurationProperties` 이 있으면 외부 설정을 주입 받는 객체라는 뜻이다. 
여기에 외부 설정 KEY의 묶음 시작점인 `my.datasource` 를 적어준다. 기본 주입 방식은 자바빈 프로퍼티 방식이다. 
`Getter` , `Setter` 가 필요하다. (롬복의 `@Data` 에 의해 자동 생성된다.)

<img width="654" alt="image" src="https://github.com/user-attachments/assets/b875b4e1-eeb9-424e-b6d3-4fb83c12c8d4" />


- `@EnableConfigurationProperties(MyDataSourcePropertiesV1.class)`스프링에게 사용할 `@ConfigurationProperties` 를 지정해주어야 한다.
- 이렇게 하면 해당 클래스는 스프링 빈으로 등록되고, 필요한 곳에서 주입 받아서 사용할 수 있다.
- `private final MyDataSourcePropertiesV1 properties` 설정 속성을 생성자를 통해 주입 받
  아서 사용한다.

<img width="654" alt="image" src="https://github.com/user-attachments/assets/18dc1571-0c62-4596-8c0a-6fbd7166b924" />

외부설정 값을 읽어오는 것을 확인할 수 있다.
그리고 표기법 변환이 일어난 것을 확인할 수 있다. 
max-connection은 (캐밥 케이스(표기법))을 따랐지만, 
자바 코드는 카멜 케이스로 적은 것을 확인할 수 있다. 스프링은 캐밥 표기법을 카멜 케이스로 중간에 자동변환을 지원해준다.

## Reference

<https://docs.spring.io/spring-boot/reference/features/profiles.html>