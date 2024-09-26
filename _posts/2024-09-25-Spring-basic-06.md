---
layout: post
title: Spring Basic 06 - 빈 생명주기 콜백
subtitle: ""
categories: framework
tags: spring
comments: false
---

## Bean LifeCycle

데이터베이스 커넥션 풀이나, 네트워크 소켓처럼 애플리케이션 시작 시점에 필요한 연결을 미리 해두고, 애플리케이션 종료 시점에 연결을 모두 종료하는 작업을 진행하려면, 객체의 초기화와 종료 작업이 필요하다.
이번시간에는 스프링을 통해 이러한 초기화 작업과 종료 작업을 어떻게 진행하는지 예제로 알아보자.

간단하게 외부 네트워크에 미리 연결하는 객체를 하나 생성한다고 가정해보자. 실제로 네트워크에 연결하는 것은 아니고, 단순히 문자만 출력하도록 했다. 이 `NetworkClient` 는 애플리케이션 시작 시점에 `connect()` 를 호출해서 연결을 맺어두어야 하고, 애플리케이션이 종료되면 `disConnect()` 를 호출해서 연결을 끊어야 한다.

### 예제코드

```java
package hello.core.lifecycle;

public class NetworkClient {

    private String url;

    public NetworkClient() {
        System.out.println( "생성자를 호출합니다." + url );
        connect();
        call( "초기화 연결 메시지" );
    }

    public void setUrl(String url) {
        this.url = url;
    }

    //서비스를 시작합니다.
    public void connect() {
        System.out.println( "connect: " + url );
    }

    public void call(String message) {
        System.out.println( "call: " + url + "message = " + message );
    }

    //서비스 종료시 호출
    public void disconnect() {
        System.out.println( "close: " + url );
    }
}

```

```java
package hello.core.lifecycle;

import org.junit.jupiter.api.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

public class BeanLifeCycleTest {

    @Test
    public void lifeCycleTest() {
        AnnotationConfigApplicationContext ac = new AnnotationConfigApplicationContext( LifeCycleConfig.class );
        NetworkClient client = ac.getBean( NetworkClient.class );
        ac.close();
    }

    /**
     *  빈은 애플리케이션에서 재사용 가능한 객체로서 스프링 컨테이너에 의해 관리된다.
     *  getBean() 메서드는 스프링 컨테이너에서 등록된 빈을 가져오는 역할
     */

    @Configuration
    static class LifeCycleConfig{
        @Bean
        public NetworkClient networkClient() {
            NetworkClient networkClient = new NetworkClient();
            networkClient.setUrl( "http://hello-spring-dev" );
            return networkClient;
        }
    }
}

```
<img width="449" alt="image" src="https://github.com/user-attachments/assets/1b4a86fb-a1ed-4098-aafc-0282947df778">

생성자 부분을 보면 url 정보 없이 connect가 호출되는 것을 확인할 수 있다.
너무 당연한 이야기이지만 객체를 생성하는 단계에는 url이 없고, 객체를 생성한 다음에 외부에서 수정자 주입을 통해서`setUrl()` 이 호출되어야 url이 존재하게 된다.

## 스프링 빈 라이프싸이클

스프링 빈의 이벤트 라이프사이클은 스프링 컨테이너 생성, **스프링 빈 생성**, **의존관계 주입**, **초기화 콜백**, **사용** **소멸전 콜백**으로 진행된다.
초기화 콜백은 빈이 생성되고 의존관계 주입이 완료된 후 호출되며, 소멸전 콜백은 빈이 소멸되기 직전에 호출된다. 객체의 생성과 초기화를 분리하자.
생성자는 필수 정보(파라미터)를 받고 메모리를 할당해서 객체를 생성하는 책임을 가진다.
반면에 초기화는 생성된 값들을 활용해서 외부 커넥션을 연결하는 등의 무거운 동작을 수행한다.
따라서 생성자 안에서 무거운 초기화 작업을 함께 하는 것보다는 **객체를 생성하는 부분과 초기화하는 부분을 명확하게 나누는 것**이 유지보수 관점에서 좋다.
물론 초기화 작업이 내부 값들만 약간 변경하는 정도로 단순한 경우에는 생성자에서 한번에 다 처리하는 게 더 나을 수 있다.

### 왜 생성자와 초기화를 분리해야 할까?

1. 유지보수: 생성자에서 외부 리소스를 연결하는 등 복잡한 작업을 하면 코드가 이해하기 어려워지고, 버그가 발생했을 때 디버깅하기 힘들어진다. 또한, 객체가 만들어지는 시점에서 너무 많은 일이 벌어지면 그 과정에서 문제가 생길 가능성이 커지게 된다.

### 예시

```java

public class NetworkClient {
    private String url;

    public NetworkClient(String url) {
        this.url = url;
        // 생성자에서 객체를 만들기 위한 기본 작업만 수행
    }

    public void connect() {
        // 초기화 작업: 외부 네트워크 연결과 같은 무거운 작업을 여기에 둔다.
        System.out.println("Connecting to " + url);
    }
}
```

위 예시에서, `NetworkClient` 클래스의 생성자는 단지 `url` 값을 설정하는 가벼운 작업만 하고, 네트워크 연결과 같은 무거운 초기화 작업은 `connect()` 메서드에서 수행됩니다. 이 방식은 객체 생성과 초기화를 명확히 분리하므로 가독성과 유지보수성이 향상된다.

## Reference

김영한님의 스프링 강의 정리