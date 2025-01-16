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

## 코드의 문제점

`MyDataSourcePropertiesV1` 은 스프링 빈으로 등록된다. 그런데 `Setter` 를 가지고 있기 때문에 누군가 실수로
값을 변경하는 문제가 발생할 수 있다. 여기에 있는 값들은 외부 설정값을 사용해서 초기에만 설정되고, 이후에는 변경
하면 안된다. 이럴 때 `Setter` 를 제거하고 대신에 생성자를 사용하면 중간에 데이터를 변경하는 실수를 근본적으로 방
지할 수 있다.  이런 문제가 없을 것 같지만, 한번 발생하면 정말 잡기 어려운 버그가 만들어진다.
대부분의 개발자가 `MyDataSourcePropertiesV1` 의 값은 변경하면 안된다고 인지하고 있지만, 어떤 개발자가 자
신의 문제를 해결하기 위해 `setter` 를 통해서 값을 변경하게 되면, 애플리케이션 전체에 심각한 버그를 유발할 수 있
다.

## Data -> Getter

코드의 개선을 V2 버전을 만들어서 Lombok @Data에서 @Getter로 변경해주고 다시 실행시켰는데 

<img width="654" alt="image" src="https://github.com/user-attachments/assets/4e31da83-70e4-40d1-be15-49515c292132" />

이러한 에러가 생겼다. 보니까 자바 빈 프로퍼티 주입 방식에서 Setter를 찾을 수 없어서 주입이 되지 않는다는 에러였다.

<img width="654" alt="image" src="https://github.com/user-attachments/assets/3298aa66-3874-4deb-ad50-abfcb1ef1887" />

따라서 생성자를 통해 주입을 해주니 잘 되는 것을 확인할 수 있었다.

## Reference

<https://docs.spring.io/spring-boot/reference/features/profiles.html>