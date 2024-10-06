---
layout: post
title: Spring JDBC 02 - JDBC Connection
subtitle: ''
categories: framework
tags: jpa
comments: false
---

## JDBC는 Connection 정보를 어떻게 넘겨줄까

<img width="689" alt="image" src="https://github.com/user-attachments/assets/c20c048b-4313-4858-b74d-94c17f3f767d">

우선 커넥션 정보를 가지고 있는 클래스를 통해서 URL, USERNAME, PASSWORD를 담고 있는 클래스를 하나 정의한다.

<img width="705" alt="image" src="https://github.com/user-attachments/assets/7a293b96-7186-4567-a70e-04c11d7f56bb">

- `DriverManager.getConnection(URL, USERNAME, PASSWORD)`  를 getConnection을 통해 인자로 넘겨준다. 그리고 넘겨준 정보들의 반환 값들을 통해 connection 객체를 반환받는다.
- **데이터베이스 연결 시도는** `DriverManager` 클래스 내부에서 해당 정보를 기반으로 데이터베이스에 연결을 시도한다.
- **결과 반환값은** 연결이 성공하면, **데이터베이스와의 연결을 나타내는 `Connection` 객체**를 반환하고 이 반환된 객체가 코드 내에서 `Connection connection` 변수에 저장된다.
- 그리고 `SQLException`이 발생할 경우, 즉 데이터베이스 연결에 문제가 생겼을`IllegalStateException`이라는 런타임 예외로 변환하여 던진다. Checked Exception인 `SQLException`을 런타임 예외로 바꿔서 예외 처리를 간소화 시킨다.
    - 간소화의 이유는 `SQLException`과 같은 **체크드 예외(Checked Exception)**는 컴파일 시점에서 반드시 처리해야 하는 예외이므로  코드가 복잡해질 수 있다.  반면 **런타임 예외(Unchecked Exception)**는 컴파일러가 처리할 필요가 없기 때문에, 호출하는 쪽에서 자유롭게 처리할 수 있다.

<img width="691" alt="image" src="https://github.com/user-attachments/assets/3e1d9f2d-6600-46b1-986d-99dec1a4268d">
<img width="629" alt="image" src="https://github.com/user-attachments/assets/03cdf493-991c-4e6e-809c-838c0dce4076">

- 실행 결과를 보면 `class=class org.h2.jdbc.JdbcConnection` 부분을 확인할 수 있다. 이것이 바로 H2 데이터베이스 드라이버가 제공하는 H2 전용 커넥션이다. 물론 이 커넥션은 JDBC 표준 커넥션 인터페이스인`java.sql.Connection` 인터페이스를 구현하고 있다.

## 필요한 정보를 담아서 인자로 넘기자

- JDBC가 제공하는 `DriverManager` 는 라이브러리에 등록된 DB 드라이버들을 관리하고, 커넥션을 획득하는 기능을제공한다.
- `DriverManager` 는 라이브러리에 등록된 드라이버 목록을 자동으로 인식한다. 이 드라이버들에게 순서대로 다음 정보를 넘겨서 커넥션을 획득할 수 있는지 확인한다.
- URL이 `jdbc:h2`로 시작하면 이것은 h2 데이터베이스에 접근하기 위한 규칙이다. 따라서 H2 드라이버는
  본인이 처리할 수 있으므로 실제 데이터베이스에 연결해서 커넥션을 획득하고 이 커넥션을 클라이언트에 반
  환한다.
- 반면에 URL이 `jdbc:h2`로 시작했는데 MySQL 드라이버가 먼저 실행되면 이 경우 본인이 처리
  할 수 없다는 결과를 반환하게 되고, 다음 드라이버에게 순서가 넘어간다.
- 이렇게 찾은 구현체가 클라이언트에 반환된다.

## Reference

김영한님의 스프링 강의 정리