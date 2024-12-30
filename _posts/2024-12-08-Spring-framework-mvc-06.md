---
layout: post
title: Spring MVC 06 - Dispatcher-Servlet 
subtitle: ""
categories: framework
tags: mvc
comments: false
---

## Dispatcher Servlet

디스패처 서블릿의 dispatch는 '보내다'라는 뜻을 가지고 있다.
디스패처 서블릿은 HTTP 프로토콜로 들어오는 모든 요청을 가장 먼저 받아 적합한 컨트롤러에 위임해주는 프론트 컨트롤러라고 정의할 수 있다.
클라이언트로부터 어떠한 요청이 오면 Tomcat과 같은 서블릿 컨테이너가 요청을 받는다. 그리고 이 모든 요청을 프론트 컨트롤러인 디스패치 서블릿이 가장 먼저
받게 된다. 그러면 디스패처 서블릿은 공통적인 작업을 먼저 처리한 후에 해당 요청을 처리해야 하는 컨트롤러를 찾아서 작업을 위임한다.
여기서 Front Controller는 서블릿 컨테이너의 제일 앞에서 서버로 들어오는 클라이언트의 모든 요청을 받아서 처리해주는 컨트롤러로써
MVC 구조에서 함께 사용되는 디자인 패턴이다.


## Dispatcher Servlet의 장점은?

Spring MVC에서 Dispatcher Servlet이 등장함에 따라서 web.xml의 역할을 상당히 축소시켰다.
과거에는 모든 서블릿을 URL 매핑을 위해 web.xml에 모두 등록해야 했다.
dispatcher Servlet의 등장으로 해당 애플리케이션으로 들어오는 모든 요청을 핸들링하고 공통 작업을 처리하면서 상당히 편리하게 이용한다.
우리는 컨트롤러를 구현만 해두면 디스패처 서블릿이 알아서 적합한 컨트롤러로 위임하게 된다. -> 그냥 컨트롤러에 집중만 하면 된다.

## Dispatcher Servlet의 동작

<img width="654" alt="image" src="https://github.com/user-attachments/assets/1e8516bc-7943-4553-87d1-91e44a8db7d5" />

- 클라이언트의 요청을 디스패처 서블릿이 받는다.
- 요청 정보를 통해 요청을 위임할 컨트롤러를 찾는다.
- 요청을 컨트롤러로 위임할 핸들러 어댑터를 찾아서 전달한다.
- 핸들러 어댑터가 컨트롤러로 요청을 위임한다.
- 비즈니스 로직 수행 후 컨트롤러가 반환값을 반환한다.
- 핸들러 어댑터가 반환값을 처리하고 서버의 응답을 클라이언트로 반환한다.

디스패처 서블릿은 요청을 처리할 핸들러(컨트롤러)를 찾고 객체의 메소드를 호출한다. 따라서 가장 먼저 어느 컨트롤러가 요청을 처리할 수 있는지를 식별해야 한다.
해당 역할을 하는 것이 바로 HandlerMapping이다.

결론은 디스패처 서블릿을 통해 요청을 처리할 컨트롤러를 찾아서 위임하고, 그 결과를 받아오는 정도로 이해하면 좋다.

## Reference

<https://docs.spring.io/spring-framework/reference/web/webmvc.html>
