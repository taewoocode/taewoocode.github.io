---
layout: post
title: Spring JDBC 04 - JDBC ConnectionPool
subtitle: ''
categories: framework
tags: jpa
comments: false
---

## ConnectionPool

<img width="739" alt="image" src="https://github.com/user-attachments/assets/02e9d434-8a79-4a77-83df-7b132782a5dc">


- 커넥션 풀을 사용해 보기 위해서 Hikari객체를 생성하고 라이브러리에 들어가 보았는데 Hikari는 DataSource를 구현하고 있는 구현체였다.

### 커넥션 풀링: HikariProxyConnection(Proxy)JdbcConnection(Target)

<img width="692" alt="image" src="https://github.com/user-attachments/assets/197970b6-9037-4b2e-99c3-7b629eba256b">
<img width="704" alt="image" src="https://github.com/user-attachments/assets/a8a31fb3-0a96-40be-ba70-b4c9d907e834">

별도의 쓰레드 사용해서 커넥션 풀에 커넥션을 채우고 있는 것을 확인할 수 있다. 
이 쓰레드는 커넥션 풀에 커넥션을 최대 풀 수(`10` )까지 채운다. `그렇다면 왜 별도의 쓰레드`를 사용해서 커넥션 풀에 커넥션을 채우는 것일까?
커넥션 풀에 커넥션을 채우는 것은 상대적으로 오래 걸리는 일이다. 
애플리케이션을 실행할 때 커넥션 풀을 채울 때 까지 마냥 대기하고 있다면 애플리케이션 실행 시간이 늦어진다. 
따라서 이렇게 별도의 쓰레드를 사용해서 커넥션 풀을 채워야 애플리케이션 실행 시간에 영향을 주지 않는다.

<img width="646" alt="image" src="https://github.com/user-attachments/assets/2343cef6-80d4-4e4b-a009-db7d464e4c50">

- 커넥션 풀에서 두개의 커넥션이 생성된 이유는 앞서 dataSource에서 커넥션 객체를 두개를 꺼내왔기 때문에 최대 10개 총 2개의 커넥션이 활성화 되는 것을 확인할 수 있다.



## Reference

김영한님의 스프링 강의 정리