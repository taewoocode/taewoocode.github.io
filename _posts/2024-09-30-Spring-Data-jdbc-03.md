---
layout: post
title: Spring JDBC 03 - JDBC DrivenManager
subtitle: ''
categories: framework
tags: jpa
comments: false
---

## DrivenManager?

- DrivenManger는 JDBC 드라이버를 통하여 커넥션을 만드는 클래스이다.
    - 쉽게 말하면 그냥 JDBC에서 커넥션을 위한 객체이다.
- Class.forName()으로 특정 클래스를 로딩하면 자동으로 객체가 생성되고 DrivenManager에 등록된다.
- 드라이버 클래스를 찾지 못한경우 ClassNotFoundException을 발생시키므로 반드시 예외처리를 해야한다.
- 자바는 이렇게 표준 인터페이스를 정의해두었고 개발자는 이 표준 인터페이스만 사용해서 개발을 하면 된다.
- 이것을**JDBC 드라이버**라고 한다. MySQL에 접근할 수 있는 것은 MySQL JDBC 드라이버라고 하고, Oracle DB에 접근할 수 있는 것은 Oracle JDBC 드라이버라고 한다.

## 공통화에 한계

- JDBC의 등장으로 많은 것들이 편리해졌지만  각각의 데이터베이스마다 SQL, 데이터타입 등의 일부 사용법이 다르다. 
- ANSI SQL 표준이라는 것이 있긴 하지만.. 하지만 일반적인 부분만 공통화했어서 한계가 있다. 그래서 데이터베이스를 변경하면 JDBC 코드는 변경하지 않아도 되지만 SQL은 해당 데이터베이스에 맞도록 변경해야 한다. 
  - 이 부분들을 또 공통화 시키기 위해서 JPA가 등장했다고 생각하면 된다.

## DrivenManagerDataSource

대부분의 커넥션 풀은 `DataSource` 인터페이스를 이미 구현해두었다. 따라서 개발자는 `DBCP2 커넥션 풀` ,
`HikariCP 커넥션 풀` 의 코드를 직접 의존하는 것이 아니라 `DataSource` 인터페이스에만 의존하도록 애플리
케이션 로직을 작성하면 된다. 커넥션 풀 구현 기술을 변경하고 싶으면 해당 구현체로 갈아끼우기만 하면 된다.
`DriverManager` 는 `DataSource` 인터페이스를 사용하지 않는다. 따라서 `DriverManager` 는 직접 사용해야 한다. 
따라서 `DriverManager` 를 사용하다가 `DataSource` 기반의 커넥션 풀을 사용하도록 변경하면 관련
코드를 다 고쳐야 한다. 이런 문제를 해결하기 위해 스프링은 `DriverManager`도`DataSource` 를 통해서 사용할 수 있도록 `DriverManagerDataSource` 라는 `DataSource` 를 구현한 클래스를 제공한다.

<img width="683" alt="image" src="https://github.com/user-attachments/assets/8f5ed795-6e22-4360-8b7a-1e995d0b0a26">

- `DriverManager` 는 커넥션을 획득할 때 마다 `URL` , `USERNAME` , `PASSWORD` 같은 파라미터를 계속 전달해야한다. 반면에 `DataSource` 를 사용하는 방식은 처음 객체를 생성할 때만 필요한 파리미터를 넘겨두고, 커넥션을 획득할 때는 단순히 `dataSource.getConnection()` 만 호출하면 된다.

## 작은 단위로 분리

- 설정과 사용이라는 관점으로 분리하는 것을 목표로 한다.
- DataSource는 설정이라는 역할로  DataSource 를 만들어 두는 것을 말한다 (URL, USERNAME, PASSWORD와 같은 정보들을 말한다.
- 설정은 신경쓰지 않고, `DataSource` 의 `getConnection()` 만 호출해서 사용하면 된다.

## Reference

김영한님의 스프링 강의 정리