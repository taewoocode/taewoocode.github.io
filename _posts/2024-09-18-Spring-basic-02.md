---
layout: post
title: Spring Basic 02 -싱글톤 패턴 적용해보기-
subtitle: ""
categories: framework
tags: spring
comments: false
---

## 싱글톤 패턴 만들어 보기

```java
package hello.core.singleton;

public class SingletonService {

    private static final SingletonService instance = new SingletonService();

    public static SingletonService getInstance() {
        return instance;
    }

    //private는 자기자신을 호출한다.
    private SingletonService() {
    }

    public void logic() {
        System.out.println( "싱글톤 객체로직을 호출" );
    }
}

```
<img width="697" alt="image" src="https://github.com/user-attachments/assets/9eb1d652-95d3-4b14-8975-d54280ec84a3">

<img width="670" alt="image" src="https://github.com/user-attachments/assets/337ccce6-ed94-44a8-9b9c-f0ce4019db6d">

<img width="596" alt="image" src="https://github.com/user-attachments/assets/01ff653e-eb25-4398-80fe-74624cec0b16">

- 싱글톤으로 구현을하면 클라이언트측에서 요청이 올 때마다 객체를 새로 생성하는 것이 아니라 기존에 만들어둔 객체를 공유해서 효율적으로 사용할 수 있다.
- 하지만 문제가 많다
    - 안티패턴
    - 싱글톤 패턴을 구현하는 코드 자체가 많이 들어간다.
    - 의존관계상 클라이언트가 구체 클래스에 의존한다.
        - DIP를 위반하게 된다. → 여기서 또 DIP가 뭔지 알아야 한다.
        - 테스트하기가 어렵다.
        - 내부 속성을 변경하거나 초기화 하기 어렵다.

## 싱글톤 컨테이너

- 스프링 컨테이너는 싱글톤 패턴의 문제점을 해결하면서, 객체 인스턴스를 싱글톤(1개만 생성)으로 관리한다.
- 지금까지 우리가 학습한 스프링 빈이 바로 싱글톤으로 관리된다.
- 스프링 컨테이너는 싱글톤 패턴을 적용하지 않아도, 객체 인스턴스를 관리한다.
- 스프링 컨테이너는 싱글톤 컨테이너 역할을 한다. 이렇게 싱글톤 객체를 생성하고 관리하는 기능을 싱글톤 레지스트리라고 한다.

```java
@Test
    @DisplayName("스프링 컨테이너와 싱글톤")
    void springContainer() {
//        AppConfig appConfig = new AppConfig();
        AnnotationConfigApplicationContext ac = new AnnotationConfigApplicationContext( AppConfig.class );
        MemberService memberService1 = ac.getBean( "memberService", MemberService.class );
        MemberService memberService2 = ac.getBean( "memberService", MemberService.class );

        //참조값이 다른 것을 확인
        System.out.println( "memberService1 = " + memberService1 );
        System.out.println( "memberService2 = " + memberService2 );

        assertThat( memberService1 ).isSameAs( memberService2 );
    }
}
```

- 스프링 컨테이너 덕분에 고객의 요청이 올 때 마다 객체를 생성하는 것이 아니라 이미 만들어진 객체를 공유해서 효율적으로 사용할 수 있다.
- 스프링의 기본 빈 등록 방식은 싱글톤이지만, 싱글톤 방식만 지원하는 것은 아니다. 요청할 때 마다 새로운 객체를 생성해서 반환하는 기능도 제공한다.
- 싱글톤 패턴이든, 스프링 같은 컨테이너든 객체 인스턴스를 하나만 생성해서 공유하는 싱글톤 방식은 여러 클라이언트가 하나의 같은 객체 인스턴스를 공유하기 때문에 싱글톤 객체는 상태를 유지(stateful)하게 설계하면 안된다.
- 무상태로 설계를 해야한다. → 가급적이면 값을 수정해서는 안된다.

```java
public class ConfigurationSingletonTest {

    @Test
    void configurationTest() {
        ApplicationContext ac = new AnnotationConfigApplicationContext( AppConfig.class );
        MemberServiceImpl memberService = ac.getBean( "memberService", MemberServiceImpl.class );
        OrderServiceImpl orderService = ac.getBean( "orderService", OrderServiceImpl.class );
        MemberRepository memberRepository = ac.getBean( "memberRepository", MemberRepository.class );

        MemberRepository memberRepository1 = memberService.getMemberRepository();
        MemberRepository memberRepository2 = orderService.getMemberRepository();

        System.out.println( "memberService -> memberRepository = " + memberRepository1 );
        System.out.println( "orderService -> memberRepository = " + memberRepository2 );
        System.out.println( "memberRepository = " + memberRepository );
    }
```

## Reference

김영한님의 스프링 강의 + 나의 뇌