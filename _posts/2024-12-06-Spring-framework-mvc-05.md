---
layout: post
title: Spring MVC 04 - Query Parameter
subtitle: ""
categories: framework
tags: mvc
comments: false
---

## Query

쿼리는 '문의' 또는 '물음표'라는 사전적 의미를 가지고 있다. 쿼리 파라미터는 URL 뒤에 물음표 `?`와 함께 붙는 키-값(key-value)
쌍이다. 여래 개의 파라미터를 전달하려면 파라미터 사이에 앰퍼샌드 `&`를 추가해서 하나의 문자열(string)으로 전달한다.
쿼리 파라미터로는 문자열뿐만 아니라 숫자, 리스트 등 다양한 형태의 데이터를 넣을 수 있다.
쿼리 파라미터는 다양한 용도가 있는데, 웹 서버의 요청에 대한 추가 정보를 제공한다.

## 그럼 언제가 적절할까?

Query parameter는 url에서 특정한 조건을 주고싶을 때 사용하는 것이 적절하다.
같은 API를 호출한다고 해도, 서로 다른 조건을 나열하는 것이 필요한 상황에 사용한다.
같은 신발 목록 데이터를 호출 하는데, 신상품 순, 사이즈가 250인 데이터만 따로, 260인 데이터만 따로, 낮은 가격순으로 데이터를 호출하는
API를 매번 새롭게 생성하는 것은 비효율적이다. 따라서 필요한 조건을 요청에 따라 선택적으로 처리할 수 있는 통일된 API를 구성할 때 사용한다.
쿼리 파라미터는 HTTP [GET], [DELETE] 요청에서만 사용하고, 유일 값을 식별하기 위한 용도가 아닌 옵션을 줄 때 사용한다.

- **사이즈가 230인 신발 요청**

    ```bash
    GET /shoes?size=230
    ```

- **가격이 낮은 순으로 정렬된 신발 요청**

    ```bash
    GET /shoes?sort=price_asc
    ```
  
이처럼 쿼리 파라미터를 사용하면 하나의 API(`/shoes`)로 다양한 조건의 데이터를 요청할 수 있으니 효율적이다.

## Reference

<https://docs.spring.io/spring-framework/reference/web/webmvc.html>
