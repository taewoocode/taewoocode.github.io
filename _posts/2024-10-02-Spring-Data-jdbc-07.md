---
layout: post
title: Spring JDBC 07 - Transaction 추상화
subtitle: ''
categories: framework
tags: jpa
comments: false
---

## 트랜잭션 추상화

트랜잭션 추상화의 개념은 서비스 계층이 특정 트랜잭션 기술에 의존하지 않도록 만들기 위한 것이다. 이를 통해 JDBC나 JPA 같은 기술을 변경할 때, 비즈니스 로직을 담고 있는 서비스 계층의 코드가 변경되지 않도록 설계한다. 이 방식은 OCP(Open-Closed Principle, 개방-폐쇄 원칙)에도 부합하며, 코드의 유연성과 확장성을 높인다.

- **트랜잭션이란?**
  트랜잭션은 데이터베이스에 대한 하나의 논리적 작업 단위로, 여러 작업을 하나의 일관된 흐름으로 처리하는 방법이다. 트랜잭션은 크게 세 가지 동작으로 요약된다.
  - **begin()**: 트랜잭션 시작
  - **commit()**: 모든 작업이 성공적으로 완료되었을 때 변경 내용을 확정
  - **rollback()**: 작업 중 오류가 발생했을 때 모든 작업을 취소하고 상태를 원래대로 복구
- **트랜잭션 추상화의 필요성**
  일반적으로 JDBC를 사용할 때는 해당 기술에 맞는 트랜잭션 제어 코드를 서비스 계층에 직접 넣어야 했다. 하지만 JPA 같은 다른 트랜잭션 기술로 전환할 경우, 해당 트랜잭션 제어 코드를 다시 수정해야 하는 문제가 발생한다. 이를 해결하기 위해 `TxManager` 같은 트랜잭션 제어 인터페이스를 만들어 서비스 계층이 특정 기술에 의존하지 않고, 트랜잭션 처리만을 추상적으로 다루게 한다.
- **TxManager 인터페이스**:
  `TxManager`는 트랜잭션을 추상화한 인터페이스다. 이 인터페이스는 트랜잭션의 시작, 커밋, 롤백과 같은 주요 메서드들을 제공한다.

    ```java
    
    public Interface TxManager {
       void begin();
       void commit();
       void rollback();
    }
    ```

  이를 구현하는 클래스들은 각 기술에 맞는 트랜잭션 처리를 담당한다.

- **구체적 구현체: JdbcTxManager & JpaTxManager**:
  - `JdbcTxManager`: JDBC 기반의 트랜잭션 처리 구현. JDBC 환경에서 트랜잭션을 시작하고, 커밋 또는 롤백하는 로직이 포함된다.
  - `JpaTxManager`: JPA 기반의 트랜잭션 처리 구현. JPA 환경에서 트랜잭션을 관리하는 방식으로 구현된다.
- **의존성 주입(DI)**:
  DI(Dependency Injection)를 사용하여 서비스 계층이 어떤 구현체를 사용할지 주입받게 한다. 이렇게 하면 서비스는 구체적인 트랜잭션 기술에 의존하지 않고, 필요에 따라 트랜잭션 관리 기술을 쉽게 변경할 수 있다.

    ```java
    
    public class SomeService {
        private final TxManager txManager;
    
        public SomeService(TxManager txManager) {
            this.txManager = txManager;
        }
    
        public void executeBusinessLogic() {
            txManager.begin();
            try {
                // 비즈니스 로직 수행
                txManager.commit();
            } catch (Exception e) {
                txManager.rollback();
                throw e;
            }
        }
    }
    ```

  여기서 트랜잭션 관리 객체가 `TxManager` 인터페이스에 의존하고, 구체적인 구현체(JDBC 또는 JPA 트랜잭션 관리자)는 외부에서 주입된다.

1. **OCP 원칙 준수**
   OCP 원칙은 '확장에는 열려 있으나 수정에는 닫혀 있어야 한다'는 원칙이다. 서비스가 `TxManager` 인터페이스에 의존하기 때문에, 새로운 트랜잭션 관리 기술이 추가되더라도 서비스 코드는 수정하지 않고 새로운 구현체를 추가하기만 하면 된다. 이로써 서비스 계층의 코드가 변경되지 않고도 트랜잭션 기술을 유연하게 변경할 수 있다.

### 장점

- **기술 변화의 용이성**: 서비스 계층의 코드를 변경하지 않고도 트랜잭션 기술을 교체할 수 있다.
- **유지보수성 향상**: 코드의 중복을 줄이고, 특정 기술에 종속적인 코드를 제거함으로써 유지보수가 쉬워진다.
- **확장성**: 추가적인 트랜잭션 관리 기술(JDBC 외 다른 ORM 등)을 사용할 때도 코드 수정 없이 새로운 구현체를 추가하는 방식으로 확장할 수 있다.

이와 같은 트랜잭션 추상화를 통해, 다양한 트랜잭션 관리 기술을 유연하게 사용할 수 있는 아키텍처를 만들 수 있다.

## 외부에서 구체적인 구현체를 결정하는 방법

서비스 코드에서 `TxManager`의 구현체가 `JdbcTxManager`인지 `JpaTxManager`인지 신경 쓰지 않아도 되는 이유는, **외부에서** 그 구체적인 구현체가 주입되기 때문이다.

- **Spring 같은 DI 컨테이너를 사용**
  - `SomeService`는 **생성자 주입**을 통해 `TxManager` 인터페이스를 받습니다. 이때 실제로는 외부에서 `TxManager`의 구현체(`JdbcTxManager` 또는 `JpaTxManager`)가 주입된다.
  - 주입되는 구현체는 외부 설정, 환경에 따라 다르게 결정됩니다. 개발자가 `SomeService` 클래스 내에서 직접적으로 구현체를 바꿀 필요가 없죠.

### Spring을 사용하는 경우 DI 컨테이너가 자동으로 주입할 트랜잭션 관리자를 결정

```java
@Component
@Qualifier("jdbcTxManager")
public class JdbcTxManager implements TxManager {
    public void begin() { /* JDBC 트랜잭션 시작 */ }
    public void commit() { /* JDBC 커밋 */ }
    public void rollback() { /* JDBC 롤백 */ }
}

@Component
@Qualifier("jpaTxManager")
public class JpaTxManager implements TxManager {
    public void begin() { /* JPA 트랜잭션 시작 */ }
    public void commit() { /* JPA 커밋 */ }
    public void rollback() { /* JPA 롤백 */ }
}

```

```java
@Service
public class SomeService {
    private final TxManager txManager;

    @Autowired
    public SomeService(@Qualifier("jdbcTxManager") TxManager txManager) {
        this.txManager = txManager;
    }

    public void executeBusinessLogic() {
        txManager.begin();
        try {
            // 비즈니스 로직 수행
            txManager.commit();
        } catch (Exception e) {
            txManager.rollback();
            throw e;
        }
    }
}

```

Service 클래스는 Spring이 TxManager의 구현체 중 하나를 알아서 주입해 주기 때문에 구체적인 트랜잭션 기술에 의존하지 않는다.

### DI를 통해 구현체를 주입하는 이유

- **유연성**: `SomeService` 클래스는 트랜잭션 관리가 필요하지만, 그게 JDBC인지 JPA인지는 신경 쓸 필요가 없다. 구체적인 구현은 외부에서 주입되므로, `SomeService`는 항상 `TxManager` 인터페이스만 사용하고 트랜잭션 기술에 따라 코드 변경을 하지 않아도 된다
- **OCP 원칙 준수**: `SomeService`가 특정 트랜잭션 기술에 의존하지 않기 때문에, 코드 수정 없이 트랜잭션 기술을 변경할 수 있다. 이로써 OCP(Open-Closed Principle)를 따르게 됩니다. 새로운 트랜잭션 관리 기술을 추가해도 `SomeService`는 수정되지 않는다.

따라서, **외부에서 주입되므로** 실제 코드에서는 `SomeService` 내부에서 `JdbcTxManager`나 `JpaTxManager`를 직접적으로 변경할 필요가 없다. **외부에서 어떤 구현체를 주입할지 결정**하면 되는 것


## Reference

김영한님의 스프링 강의 정리