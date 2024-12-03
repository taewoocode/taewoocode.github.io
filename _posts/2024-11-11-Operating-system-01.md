---
layout: post
title: CPU Outline
subtitle: ""
categories: cs
tags: OS
comments: false
---

## Central Processing Unit

컴퓨터 시스템을 이루는 3 대 구성이 있다면 CPU, 메리 그리고 디스크이다. 
여기에 I/O 까지 추가 된다면 그것을 컴퓨터를 이루는 기본 골격이라고 할 수 있는데, 
이것을 제안한 것이 폰 노이만이다. 주요 특징은 명령어 → 데이터 로드 → 실행 → 저장을 순차적으로 수행하는 것과 데이터/프로그램을 하나의 버스로 접근하는 구조이다.
폰 노이만 구조는 중앙 처리 장치라는 것이 있고 이 중앙 처리 장치를 통해서 연산을 수행하게 되는 구조이다. 
이 CPU(중앙처리 장치)는 각종 연산을 수행하고 기억장치에 기억되어 있는 명령어들을 수행하는 컴퓨터 시스템을 이루는 핵심 부품이다.

## CPU의 속도 Hz, Clock

CPU는 수를 계산하는 칩정도로 생각하면 된다. 원리가 덧셈기와 같이 동작한다.
컴퓨터의 성능을 CPU의 속도와 메모리의 용량으로 표현할 수 있다. 
시스템내의 CPU 에 전기적으로 공급되는 신호를 Clock 이라고 하는데, 
이것은 주기적으로 일정한 시그널을 보내주는 칩이다. Clock 에서는 일정 볼트로 주기적으로 신호를 발생한다. 
그러면 CPU 는 이 신호를 받고 데이터를 주거나 받고 처리하게 된다. 
전기적 신호 한번에 의해서 CPU에서는 한개의 명령을 처리한다. 
CPU 의 속도를 Hz 로 나타내고 이 Hz 가 높으면 속도가 빠른 성능의 CPU 가 되는 것이다. 
그래서 주사율이 높은 모니터를 쓰려면 CPU의 성능이 좋아야 하나보다.

## CPU의 구성도

<img width="654" alt="image" src="https://github.com/user-attachments/assets/7db9bc08-41b1-4ccd-a1ac-4fc82bebaee0">

CPU 의 내부 구성은 크게 산술/논리 연산 장치(ALU), 제어 장치와 레지스터로 구성되어 있다. 
산술은 덧셈을 수행하는 것이고, 제어 장치는 시그럴을 통해서 데이터 흐름을 통제하는 것이며 레지스터는 CPU 내부의 메모리이다.

- **Instruction Fetcher**
  - 컴퓨터의 **프로세서(Processor)**에서 명령어(Instruction)를 가져오는 역할을 하는 컴포넌트이다. 프로세서는 프로그램의 명령어를 실행하기 위해 메모리에서 명령어를 가져와야 하는데, 이 과정이 Instruction Fetch라고 불린다.
- **Instruction Decoder**
  - 읽어들인 명령어에 대해 수행할 동작을 결정하기 위해 명령어를 해독한다.
- **Register**
  - 프로세서에 위치한 고속 메모리로써 매우 적은 소량의 데이터나 자주 사용되는 결과값들을 미리 저장해두는 공간이다. 프로세서가 빠르게 레지스터를 참조하여 작업 속도를 증가시키는데 목적이 있다.
- **ALU**
  - 산술 논리 장치의 경우에는 덧셈, 뺄셈과 같은 단순 산순연산부터 베타적 논리합, 논리곱과 같은 논리 연산을 수행한다.

## 명령어 구조
<img width="654" alt="image" src="https://github.com/user-attachments/assets/7164732b-bfee-4b0b-a0a1-32afb6aae3fa">

명령어는 시스템이 특정 동작을 수행시키는 작은 단위이다. 명령어는 코드로 되어 있는데 아래와 같이 동작코드(Op-code: Operation Code)와 오퍼랜드(Operand)로 구성되어 있다.

- 명령어 = 동작코드 _ 오퍼랜드
- 동작코드 : 각 명령어의 실행 동작을 구분하여 표현
- 오퍼랜드 : 명령어의 실행에 필요한 자료나 실제 자료의 저장 위치

## 명령어 수행 과정

- CPU가 하나의 명령(Operation)을 처리하는 과정은 다음과 같다.
- FI → DI → EI → WB
- 읽기(Fetch Instruction): 메모리에서 명령을 가져온다.
- 해석(Decode Instruction): 명령을 해석한다.
- 실행(Execute Instruction): 명령을 수행한다.
- 기록(Wrtie Back): 수행한 결과를 기록한다.

Program Counter는 Fetch 할 다음의 명령어 주소를 갖고 있다. 
(여기저기서 Fetch가 정말 많이 등장하는데 Fetch는 가져오다라는 어원을 가지고 있다. ) 
프로세스는 PC(ProgramCounter)가 가리키는 주소위치에서 명령어를 가져오면서 PC를 증가시키고 명령문은 Instruction Register에 Load 된다.
그리고 Load된 명령어는 Execute Cycle Fetch 과정에서 가져온 명령어를 실제 ALU(가산기)에서 처리하게 된다.

## Reference

나의 뇌

<https://en.wikipedia.org/wiki/Arithmetic_logic_unit>
<https://www.techtarget.com/whatis/definition/arithmetic-logic-unit-ALU>