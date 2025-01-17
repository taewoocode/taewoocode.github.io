---
layout: post
title: Spring Basic 18 - Prometheus basic
subtitle: ""
categories: framework
tags: spring
comments: false
---

## **프로메테우스** - **기본** **기능**

검색창에 `http_server_requests_seconds_count` 를 입력하고 실행해보자

<img width="654" alt="Image" src="https://github.com/user-attachments/assets/48e9f44f-abfe-4502-9cb0-cdb5f56f6416" />

### **태그(Label 또는 Tag)의 개념**

태그는 메트릭 데이터에 추가 정보를 제공하는 key-value 쌍으로, 데이터를 세부적으로 분류하거나 특정 조건으로 조회할 때 사용된다.

### **Prometheus와 Micrometer의 용어 차이**

- Prometheus: **Label**
- Micrometer: **Tag**

둘은 기능적으로 동일하며, 메트릭 데이터를 필터링하거나 그룹화할 때 사용된다

### **레이블 기반 필터링**

Prometheus에서는 레이블을 기반으로 특정 메트릭 데이터를 선택적으로 조회할 수 있다. 이를 **필터링**이라고 하며, 다음과 같은 연산자를 지원한다.

### **레이블 연산자**

| 연산자 | 설명 | 예시 |
| --- | --- | --- |
| `=` | 제공된 문자열과 **정확히 동일**한 레이블 선택 | `method="GET"` |
| `!=` | 제공된 문자열과 **같지 않은** 레이블 선택 | `method!="POST"` |
| `=~` | 제공된 문자열과 **정규식으로 일치**하는 레이블 선택 | `uri=~"/api/v[0-9]+/.*"` |
| `!~` | 제공된 문자열과 **정규식으로 일치하지 않는** 레이블 선택 | `uri!~"/actuator.*"` |

## **필터 예제**

### **레이블의 정확한 일치 조건**

- 특정 `uri`와 `method`를 가진 메트릭 데이터만 조회

    ```
    http_server_requests_seconds_count{uri="/log", method="GET"}
    ```

### **레이블의 부정 조건**

- 특정 `uri`를 제외한 데이터를 조회

    ```
    http_server_requests_seconds_count{uri!="/actuator/prometheus"}
    ```

### **정규식을 사용한 조건**

- `method`가 `GET` 또는 `POST`인 데이터를 조회

    ```
    http_server_requests_seconds_count{method=~"GET|POST"}
    ```

- `/actuator`로 시작하는 `uri`를 제외한 데이터를 조회:

    ```
    http_server_requests_seconds_count{uri!~"/actuator.*"}
    ```



## Reference

<https://docs.spring.io/spring-boot/api/rest/actuator/prometheus.html>
