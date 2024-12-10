---
layout: post
title: Spring MVC 02 - Adapter Pattern
subtitle: ""
categories: framework
tags: mvc
comments: false
---

## Adapter Pattern

어댑터 패턴(Adapter Pattern)**은 구조적 디자인 패턴의 하나로, 서로 호환되지 않는 인터페이스를 가진 클래스들을 연결하여 함께 동작할 수 있도록 돕는 역할을 한다. 
즉, **클라이언트가 기존 클래스나 인터페이스를 사용할 수 있게 "중간 다리 역할"**을 하는 객체를 만드는 패턴이다.

<img width="654" alt="image" src="https://github.com/user-attachments/assets/111ef9aa-45ad-4579-9359-5bad5df6cf22">

- 핸들러 어댑터
   - 중간에 어댑터 역할을 하는 어댑터가 추가되었는데, 이름이 핸들러 어댑터이다. 여기서 어댑터 역할을 해주는 덕분에 다양한 종류의 컨트롤러를 호출할 수 있다.
- 핸들러
   - 컨트롤러의 이름을 더 넓힌 범위의 핸들러로 변경이 되었다. 그 이유는 이제 어댑터가 있기 때문에 꼭 컨트롤러의 개념 뿐만이 아니라 어떠한 것이든 해당하는 종류의 어댑터만 있으면 다 처리할 수 있기 때문이다.

<img width="654" alt="image" src="https://github.com/user-attachments/assets/626fcd87-70c3-4d75-91a8-697663535631">

- boolean supports(Object handler)
   - handler는 컨트롤러를 말한다.
   - 어댑터가 해당 컨트롤러를 처리할 수 있는지 판단하는 메서드다.
- ModelView handle(HttpServletRequest request, HttpServletResponse response, Object handler)
   - 어댑터는 실제 컨트롤러를 호출하고, 그 결과로 ModelView를 반환해야 한다.
   - 실제 컨트롤러가 ModelView를 반환하지 못하면, 어댑터가 ModelView를 직접 생성해서라도 반환해야
     한다.
   - 이전에는 프론트 컨트롤러가 실제 컨트롤러를 호출했지만 이제는 이 어댑터를 통해서 실제 컨트롤러가 호출 된다.

<img width="654" alt="image" src="https://github.com/user-attachments/assets/7dba62de-f27a-44dc-bf24-da773579a47f">

코드를 잘보면 위의 그림을 그대로 표현한 것이다.
클라이언트가 요청을 하면 일단 핸들러 맵핑 정보를 뒤져본다.
핸들러를 처리할 수 있는 핸들러 어댑터를 getHandler 어댑터에다가 이 핸들러를 던지면서 V3 컨트롤러에 대한 걸 처리할 수 있는 핸들러 어댑터를 찾아온다.
그러면 V3 컨트롤러를 바꾼 다음 컨트롤러의 프로세서를 호출한다. 이후 모델뷰를 반환한다.

## Reference

<https://docs.spring.io/spring-framework/docs/3.0.0.M4/spring-framework-reference/html/ch15s02.html>
<https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html>