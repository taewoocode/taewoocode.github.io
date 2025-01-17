---
layout: post
title: Spring Basic 16 - Profile Bean
subtitle: ""
categories: framework
tags: spring
comments: false
---

## Profile

값이 다른 정도가 아니라 각 환경마다 서로 다른 빈을 등록해야 한다면 어떻게 해야할까?
예를 들어서 결제 기능을 붙여야 하는데, 
로컬 개발 환경에서는 실제 결제가 발생하면 문제가 되니 가짜 결제 기능이 있는 스프링 빈을 등록하고, 
운영 환경에서는 실제 결제 기능을 제공하는 스프링 빈을 등록한다고 가정해보자.

<img width="654" alt="Image" src="https://github.com/user-attachments/assets/e8cfd4f3-8625-4ecd-9ca5-a1f266f9ad6c" />

우선 인터페이스를 하나 정의한다.

<img width="654" alt="Image" src="https://github.com/user-attachments/assets/853284fc-20bf-459f-af3c-4190b7fbf366" />

Reference그 다음 구현체를 통해서 인터페이스를 구현한다.
스프링 프로필을 공부하기 위함이지 실제 결제기능 서비스를 개발하는 것은 아니기 때문에 log 정도만 남겨준다.

<img width="654" alt="Image" src="https://github.com/user-attachments/assets/b6e6ea94-30f3-45f9-9c37-e0b6ff22aeda" />
<img width="654" alt="Image" src="https://github.com/user-attachments/assets/a30f4804-f68c-4a47-a44d-59557b004d16" />

개발 환경에서 사용할 구현체와, 운영 환경에서 사용할 구현체를 나눠준다.

<img width="654" alt="Image" src="https://github.com/user-attachments/assets/390529b5-a142-439c-8c2f-fe7ef470151a" />

Config를 통해서 수동으로 빈을 등록해준다.
개발 환경에서는 default, 운영환경에서는 prod를 사용할 것이기 때문에 역할에 맞게 빈을 등록한다.

<img width="654" alt="Image" src="https://github.com/user-attachments/assets/028f920d-e624-46be-b784-720d95deab22" />
<img width="654" alt="Image" src="https://github.com/user-attachments/assets/b7dd60a2-d045-4b92-90bc-17c103bb125d" />

edit에 들어와서 prod로 적용해준다. 운영환경을 기준으로 애플리케이션을 실행해본다.
prod 프로필을 적용했다. pr프로필이 사용되면 `ProdPayClient` 가 빈으로 등록되는 것을 확인할 수 있다.
`@Profile` 은 특정 조건에 따라서 해당 빈을 등록할지 말지 선택한다. 어디서 많이 본 것 같지 않은가? 바로
`@Conditional` 이다. 코드를 보면 `@Conditional(ProfileCondition.class)` 를 확인할 수 있다.
스프링은 `@Conditional` 기능을 활용해서 개발자가 더 편리하게 사용할 수 있는 `@Profile` 기능을 제공하는 것이다.

## Reference

<https://docs.spring.io/spring-boot/reference/features/profiles.html>