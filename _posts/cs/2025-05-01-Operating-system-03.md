---
layout: post
title: 주소 지정 방식
subtitle: ""
categories: cs
tags: OS
comments: false
---

## 주소 지정 방식

명렁어의 오퍼랜드 필드에 메모리나 레지스터의 주소를 담는다.
명령어는 오퍼랜드와 연산 코드로 이루어져 있는데 여기서 오퍼랜드란 연산에 사용할 데이터가 저장된 위치를 의미한다.

## 오퍼랜드 필드에 메모리나 레지스터의 주소를 담는 이유가 뭘까?

그냥 연산코드, 연산에 사용될 데이터를 직접 추가하면 되는데 굳이 왜 주소를 담을까?
- 이유는 명령어 길이 때문이다.
- 명령어는 n개의 비트로 구성되어있고, 연산 코드 필드가 m비트라고 가정하면 오퍼랜드 필드의 길이는 n - m이 된다.
- 또한 메모리 낭비 이슈를 줄일 수 있다.
  - 메모리 주소만 참조하면 알아서 반복적인 연산을 지속하기 때문에 직접 데이터 포함 방식보다 유지보수가 좋아진다.(Java의 참조)를 생각하면 쉽게 이해가 된다.

### 1. 즉시 주소 지정 방식 (Immediate Addressing)

![img.png](/assets/img/cs/operation/img.png)

연산에 사용할 데이터를 명령어의 오퍼랜드 필드에 **직접 명시하는 방식**이다.

- 메모리 접근이 필요 없기 때문에 가장 빠르다.
- 오퍼랜드 필드에 값을 직접 넣기 때문에 표현할 수 있는 데이터 크기에 제한이 있다.
- 주로 상수를 처리할 때 사용된다.

**비유:** "R1에 숫자 5를 써라." → 데이터를 어디서 가져오는 것이 아니라, 그 자리에서 말한 값을 바로 적는 것이다.

### 2. 직접 주소 지정 방식 (Direct Addressing)

![img.png](/assets/img/cs/operation/img_1.png)

오퍼랜드 필드에 연산에 사용할 데이터가 저장된 **메모리의 실제 주소를 명시하는 방식**이다.

- 메모리에 한 번 접근하여 데이터를 가져오기 때문에 즉시 주소 방식보다는 느리다.
- 표현할 수 있는 데이터 크기가 즉시 방식보다 크다.
- 주소가 고정되어 있기 때문에 구조가 단순하지만 유연성은 낮다.

**비유:** "100번지 서랍을 열어서 그 안에 든 것을 R1에 저장하라." → 주소가 바로 주어지고, 거기서 값을 가져오는 방식이다.

### 3. 간접 주소 지정 방식 (Indirect Addressing)

![img.png](/assets/img/cs/operation/img_2.png)

오퍼랜드 필드에 연산에 사용할 데이터가 저장된 **메모리 주소의 주소를 명시하는 방식**이다.

- 메모리를 두 번 접근해야 하기 때문에 직접 주소 방식보다 느리다.
- 표현할 수 있는 주소 공간이 넓기 때문에 유연성이 크다.
- 포인터나 동적 자료 구조에 자주 사용된다.

**비유:** "100번지 서랍 안에 적힌 주소를 보고, 그 주소에 가서 값을 가져와라."

→ 주소를 한번 더 참조해야 하므로 한 단계 더 돌아가는 방식이다.

### 4. 레지스터 주소 지정 방식 (Register Addressing)

![img.png](/assets/img/cs/operation/img_3.png)

오퍼랜드 필드에 연산에 사용할 데이터를 담고 있는 **레지스터의 이름(주소)를 명시하는 방식**이다.

- 메모리 대신 레지스터를 사용하므로 접근 속도가 매우 빠르다.
- 레지스터 수가 제한되어 있어 데이터 표현 범위는 작다.
- 연산이 빈번하게 수행되는 변수나 임시 값 처리에 적합하다.

**비유:** "내 손에 들고 있는 계산기 메모리에서 바로 꺼내 써라."

→ 가까운 공간에서 바로 꺼내 쓰는 개념이다.

### 5. 레지스터 간접 주소 지정 방식 (Register Indirect Addressing)

![img.png](/assets/img/cs/operation/img_4.png)

오퍼랜드 필드에 **데이터가 저장된 메모리 주소를 담고 있는 레지스터를 명시하는 방식**이다.

- 메모리에 한 번 접근하므로 간접 주소 지정 방식보다 빠르다.
- 주소를 유동적으로 관리할 수 있어 포인터 처리에 적합하다.
- 레지스터를 통해 메모리 주소를 간접적으로 다룰 수 있다.

**비유:** "R2 레지스터에 적힌 주소를 보고, 해당 위치에서 값을 가져와라."

→ 주소가 적힌 쪽지를 들고 해당 장소에 가서 값을 가져오는 느낌이다.

## Reference

<https://m.yes24.com/Goods/Detail/111378840>