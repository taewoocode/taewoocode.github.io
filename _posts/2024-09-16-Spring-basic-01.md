---
layout: post
title: Spring Basic 01 -제어의 역전, ApplicationContext-
subtitle: ""
categories: framework
tags: spring
comments: false
---

## 제어의 역전(Inversion of Control)

프로그램의 제어흐름을 직접 제어하는 것이 아니라 외부(스프링)이 관리하는 것을 제어의 역전(loC)라고 한다.

## 스프링 컨테이너
### ApplicationContext
<img width="700" alt="스크린샷 2024-09-16 오후 9 06 08" src="https://github.com/user-attachments/assets/76d1d251-e001-48b7-b0fc-8472a2380792">
- ApplicationContext를 스프링 컨테이너라고 한다.
- 기존에는 개발자가 AppConfig를 사용해서 직접 객체를 생성하고 DI를 했지만, 이제부터는 스프링 컨테이너를 통해서 사용한다.
- 스프링 컨테이너에서는 Configuration이 붙은 객체를 설정 정보로 사용한다. @Bean이라 붙은 메서드를 모두 호출해서 반환된 객체를 스프링 컨테이너로 등록한다. 이렇게 스프링 컨테이너로 등록된 객체를 스프링 빈이라고 한다.
- 예전에는 AppConfig를 통해서 필요한 객체를 직접 조회했지만, 이제는 스프링 컨테이너를 통해서 필요한 스프링 빈을 찾는다. 스프링 빈은 applicationContext.getBean()을 통해서 찾을 수 있다.
- 스프링 빈은 @Bean이 붙은 메서드의 명을 빈의 이름으로 사용하여 컨테이너에 등록한다.
- 스프링 컨테이너에 객체를 스프링 빈으로 등록하고, 찾을 수 있다.

## Reference

인프런 김영한님의 스프링 프레임워크 핵심 기술 강좌