---
layout: post
title: Spring Basic 10 - Web Scope
subtitle: ""
categories: framework
tags: spring
comments: false
---

## **웹** **스코프**

- 웹 스코프는 웹 환경에서만 동작한다.
- 웹 스코프는 프로토타입과 다르게 스프링이 해당 스코프의 종료시점까지 관리한다. 따라서 종료 메서드가 호출된다.

### **웹** **스코프** **종류**

- *request:* HTTP 요청 하나가 들어오고 나갈 때 까지 유지되는 스코프, 각각의 HTTP 요청마다 별도의 빈 인스턴스가 생성되고, 관리된다.
- *session:* HTTP Session과 동일한 생명주기를 가지는 스코프
- *application:* 서블릿 컨텍스트(`ServletContext` )와 동일한 생명주기를 가지는 스코프
- *websocket:* 웹 소켓과 동일한 생명주기를 가지는 스코프

## request **스코프** **예제** **개발**

동시에 여러 HTTP 요청이 오면 정확히 어떤 요청이 남긴 로그인지 구분하기 어렵다. 이럴때 사용하기 딱 좋은것이 바로 request 스코프이다. 다음과 같이 로그가 남도록 request 스코프를 활용해서 추가 기능을 개발해보자.

- 기대하는 공통 포멧: [UUID][requestURL] {message}
- UUID를 사용해서 HTTP 요청을 구분하자.
- requestURL 정보도 추가로 넣어서 어떤 URL을 요청해서 남은 로그인지 확인하자.

```java
package hello.core.common;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@Scope(value = "request")
public class MyLogger {

    private String uuid;
    private String requestURL;

    public MyLogger(String uuid, String requestURL) {
        this.uuid = uuid;
        this.requestURL = requestURL;
    }

    //메시지를 전달한다.
    public void log(String message) {
        System.out.println( "[" + uuid + "]" + "[" + requestURL + "] " + message );
    }

    @PostConstruct
    public void init() {
        uuid = UUID.randomUUID().toString();
        System.out.println( "[" + uuid + "] request scope bean create: " + this );
    }

    @PreDestroy
    public void close() {
        System.out.println();
        System.out.println( "[" + uuid + "] request scope bean close: " + this );
    }
}

```

- 로그를 출력하기 위한 `MyLogger` 클래스이다. `@Scope(value = "request")` 를 사용해서 request 스코프로 지정했다.
- 이제 이 빈은 HTTP 요청 당 하나씩 생성되고, HTTP 요청이 끝나는 시점에 소멸된다.
- 이 빈이 생성되는 시점에 자동으로 `@PostConstruct` 초기화 메서드를 사용해서 uuid를 생성 저장한다.
- 이 빈은 HTTP 요청 당 하나씩 생성되므로, uuid를 저장해두면 다른 HTTP 요청과 구분할 수 있다.
- 이 빈이 소멸되는 시점에 `@PreDestroy` 를 사용해서 종료 메시지를 남긴다.
- `requestURL` 은 이 빈이 생성되는 시점에는 알 수 없으므로, 외부에서 setter로 입력 받는다.

<img width="674" alt="image" src="https://github.com/user-attachments/assets/88ab674e-5df9-4786-ad15-3d24953b0cda">

- 로거가 잘 작동하는지 확인하는 테스트용 컨트롤러다.
- 여기서 HttpServletRequest를 통해서 요청 URL을 받았다.
- requestURL`http://localhost:8080/log-demo` 이렇게 받은 requestURL 값을 myLogger에 저장해둔다.
- myLogger는 HTTP 요청 당 각각 구분되므로 다른HTTP 요청 때문에 값이 섞이는 걱정은 하지 않아도 된다.
- 컨트롤러에서 controller test라는 로그를 남긴다.

<img width="679" alt="image" src="https://github.com/user-attachments/assets/9ca5d42a-0f08-4d29-83af-8567a86766ff">

- 비즈니스 로직이 있는 서비스 계층에서도 로그를 출력해보자.
- request scope를 사용하지 않고 파라미터로 이 모든 정보를 서비스 계층에 넘긴다면,파라미터가 많아서 지저분해진다.
- 더 문제는 requestURL 같은 웹과 관련된 정보가 웹과 관련없는 서비스 계층까지 넘어가게 된다.
- 웹과 관련된 부분은 컨트롤러까지만 사용해야 한다.
- 서비스 계층은 웹 기술에 종속되지 않고, 가급적 순수하게 유지하는 것이 유지보수 관점에서 좋다.
- request scope의 MyLogger 덕분에 이런 부분을 파라미터로 넘기지 않고, MyLogger의 멤버변수에 저장해서 코드와 계층을 깔끔하게 유지할 수 있다.

<img width="681" alt="image" src="https://github.com/user-attachments/assets/69d973a8-3f98-44fa-b77d-817247779659">

- `ObjectProvider` 덕분에 `ObjectProvider.getObject()` 를 호출하는 시점까지 request scope ****빈의생성을** **지연****할 수 있다.
- `ObjectProvider.getObject()` 를 호출하시는 시점에는 HTTP 요청이 진행중이므로 request scope 빈의 생성이 정상 처리된다.
- `ObjectProvider.getObject()` 를 `LogDemoController` , `LogDemoService` 에서 각각 한번씩 따로 호출해도 같은 HTTP 요청이면 같은 스프링 빈이 반환된다!

## Reference

김영한님의 스프링 강의 정리 + 어렵다 스프링