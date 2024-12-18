---
layout: post
title: Kotlin In Action 02 - Statement, Expression
subtitle: ""
categories: language
tags: kotlin
comments: false
---

## Statement, Expression

코틀린은 satement보다 expression을 지양하는 언어이다. 
이때 이 둘의 차이는 무엇일까? Expression은 ‘수식’이라는 뜻이다. 
Expression들은 평가(evaluate)가 가능하기 때문에 하나 이상의 값으로 환원될 수 있다. 
Expression은 값을 가지기 때문에 다른 expression의 일부분으로 사용될 수 있다. 
그러나 satement는 ‘서술’이라는 뜻으로, 프로그래밍에서는 실행 가능한(executable) 최소의 독립적인 코드 조각을 일컫는다. 
스스로 값을 가지지 않는다는 점이 expression과의 차이점이 된다.

## **자바의 if (Statement)**

자바에서 `if`는 **Statement**이다. 
즉, `if`는 단순히 조건에 따라 **코드를 실행**하거나 **다른 코드 블록을 선택**하는 역할만 하고, 
그 자체로 값을 반환하지 않는다.

```java
int a = 5, b = 10;
int max;
if (a > b) {
    max = a;
} else {
    max = b;
}
```
위 코드에서 if문은 조건에 따라 `max` 값을 결정하지만, if문 자체는 아무런 값을 반환하지 않는다.
`max`는 if문을 사용하여 계산된 결과로 결정되며, 
if는 단지 **코드를 실행하는 역할**만 한다. 흐름만 제어하는 정도라고 생각하면 된다.

## **코틀린의 if (Expression)**

반면, 코틀린에서 if는 Expression**이다**. 즉, if는 조건에 따라 **결과값을 반환**할 수 있다. 
코틀린에서는 if가 **값을 가지는 표현식**으로 취급되기 때문에, 
if문을 바로 변수에 할당하거나 다른 표현식의 일부로 사용할 수 있다.

```kotlin
val a = 5
val b = 10
val max = if (a > b) a else b
```

- `max` 변수는 `if`문이 반환한 값을 그대로 받는다.

### 왜 이런 차이가 있을까?

- 자바는 기본적으로 모든 조건문이 **Statement**로 작동하며, 실행의 흐름을 제어하는 데 초점을 맞추기 때문에 if문이 값을 반환하지 않는다.
- 코틀린은 **Expression 중심** 언어로 설계되었다. 그래서 if와 같은 조건문도 하나의 **값**으로 취급하여 코드가 더 간결하고, 표현식으로 값을 바로 처리할 수 있도록 한다.

## Reference

<https://www.yes24.com/product/goods/55148593>