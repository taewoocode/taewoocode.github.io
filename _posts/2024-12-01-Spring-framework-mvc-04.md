---
layout: post
title: Spring MVC 04 - RequestParameter - Query
subtitle: ""
categories: framework
tags: mvc
comments: false
---

## Client to Server

### GET - 쿼리 파라미터

- /url ?username = hello&age=20
    - 메시지 바디 없이 URL의 쿼리 파라미터에 데이터를 포함해서 전달
    - 검색 필터, 페이징등에서 많이 사용하는 방식

### POST - HTML Form

- content-type: application/x-www.form-urlencoded
    - 회원 가입, 상품 주문, HTML Form 사용

### HTTP Message body

- HTTP API에서 주로 사용, JSON, XML, TEXT
    - 데이터 형식은 주로 JSON 사용
    - POST, PUT, PATCH

## HTTP으로 요청 파라미터 조회

<img width="654" alt="image" src="https://github.com/user-attachments/assets/44d90888-6c4c-41f7-bfbf-753c695734f2"/>

<img width="654" alt="image" src="https://github.com/user-attachments/assets/6e7f3bde-4900-4aca-ada0-cc25aef49aa4" />

## Spring으로 요청 파라미터 조회

<img width="654" alt="image" src="https://github.com/user-attachments/assets/0d004f0c-0196-4650-93bc-66cdce712724" />

- RequestParam을 사용하면 요청 파리미터를 쉽게 사용할 수 있다.
- @Controller이면서 반환타입이 String 이면 ok라는 뷰를 찾게 된다. 
- 따라서 클래스 레벨에서 @RestController로 변경해주거나, 메소드 레벨에서 @ReponseBody를 사용한다.

<img width="654" alt="image" src="https://github.com/user-attachments/assets/8420783a-23ca-48ac-b6b2-6ed155fb4d7c" />

- String, int 등의 단순 타입이면 @RequestParam 도 생략 가능
- String, int, Integer 등의  단순 타입이면 @RequestParam 도 생략가능
  - 이렇게 애노테이션을 완전히 생략해도 되는데, 너무 없는 것도 약간 과하다는 주관적 생각이 있다.
    `@RequestParam` 이 있으면 명확하게 요청 파리미터에서 데이터를 읽는 다는 것을 알 수 있다.

<img width="654" alt="image" src="https://github.com/user-attachments/assets/6445a22e-592e-437a-bc40-4c2285a46102" />

(와중에 FHD, MAC 화질차이가..)
- RequiredParam 속성에서 기본값은 true이다. 아무것도 명시해주지 않는다면 false로 적용이 되어있다.
- 위의코드는 age는 필수값이 되어있고, username은 필수가 아니다.
- 또한 자바에서는 기본형은 null을 허용하지 않고, Integer(객체)는 null을 허용한다.

## ModelAttribute

<img width="654" alt="image" src="https://github.com/user-attachments/assets/40b5bb13-6c54-4485-94e0-ecff9255615e" />

- ModelAttribute를 활용해보기 위해서 HelloData 객체 생성
- Lombok이 제공해주는 @Data로 @Getter, @Setter, @ToString, @EqualsAndHashCode, @RequiredArgsConstructor를 자동으로 적용해준다.

<img width="654" alt="image" src="https://github.com/user-attachments/assets/3bcf608d-0322-4665-984f-958497c1ab4f" />

- 위에 두 코드는 같은 기능을 하는 코드이다.
- @ModelAttribute를 사용하면 @ModelAttribute는 HelloData 객체를 생성하고 요청 파라미터 이름으로 HelloData 객체의 프로퍼티를 찾는다. 그리고 해당 프로퍼티의 setter를 호출해서 파라미터 값을 입력한다.
  - 파라미터 이름이 username이라면 setUsername() 메서드를 찾아서 호출하면서 값을 입력해준다.

<img width="654" alt="image" src="https://github.com/user-attachments/assets/ef23de6e-38e9-4ce8-b14c-b5581cd1ceff" />

- `@ModelAttribute` 는 생략할 수 있다. 그런데 `@RequestParam`도 생략할 수 있으니 혼란이 발생할 수 있다.
- 스프링은 해당 생략시 다음과 같은 규칙을 적용한다.
  - `String` , `int` , `Integer` 같은 단순 타입 = `@RequestParam`
  - 나머지 = `@ModelAttribute` (argument resolver 로 지정해둔 타입 외)




## Reference

<http://www.slf4j.org>

<http://logback.qos.ch>

<https://docs.spring.io/spring-boot/docs/current/reference/html/spring-boot-features.html#boot-features-logging?>