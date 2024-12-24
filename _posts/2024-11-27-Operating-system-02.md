---
layout: post
title: 운영체제의 역사
subtitle: ""
categories: cs
tags: OS
comments: false
---

## 운영체제 역사

운영체제 역사를 아는 것은 지금의 컴퓨터를 이해하는데 있어서 밑거름이 된다고 한다.

## 1940년대 - 초창기 컴퓨터

![image](https://github.com/user-attachments/assets/0fdaeedd-6269-4fa5-aee5-9470ff51323f)

- 에니악은 펜실베이니아대학의 존 모클리John Mauclily 와 존 에커트Jolin Eckert 가 만들었다. 전선을 잭에 꼽아 회로를 연결하여 구성한 에니악은 30톤 규모의 거대한 계산기로 미사일 탄도를 계산하기 위해 제작
- 진공관이 켜지면 1, 진공관이 꺼지면 0 진공관은 백열전구를 말한다.
- 하드어와이링 방식
- 전선이 18000여개 정도 이어짐

## 1950년대 - 일괄 작업 시스템

![image](https://github.com/user-attachments/assets/c8908e34-6dd8-42ec-9170-79191b1db9ff)

- 옛날 컴퓨터들이라 사진이 다 흑백임..
- 일괄작업시스템(batch-job-system)
  - 현대는 여러가지 작업이 가능하지만 당시에는 한 번에 한 가지 작업만 가능했음
    - batch-job-system, batch-processing-system이라 하는데 프로그램 실행 중간에 사용자는 데이터를 수정할 수 없게 되어있음
- CPU와 메인메모리가 있었으나, 키보드와 모니터와 같은 출력장치가 존재하지 않았음
- 천공카드 리더를 입력장치로 라인 프린터를 출력장치로 사용함
  - 천공카드 리더는 펜으로 표시하여 데이터를 수집하는 방식과는 달리 구멍을 뚫어 숫자를 표현했다.
  - 라인 프린터는 문자만 출력하는 프린터로 한 번에 한 줄씩 출력하기 때문에 라인 프린터라는 이름이 붙여졌다.

## 1960 - 대화형 시스템

- 옛날 컴퓨터의 방식은 천공 카드에 구멍을 뚫어 데이터를 적재하고 그 데이터를 읽는 방식으로 작업을 수행했다 따라서 중간에 데이터를 수정할 수가 없었다. 하지만 컴퓨터와 모니터가 등장한 이후에는 중간에 데이터를 수정할 수 있었다. 또한 중간 결과값을 출력하여 프로그램에 이상이 있는지 혹은 프로그램이 정상적으로 진행되고 있는지도 확인할 수 있게 되었다. 이러한 시스템은 컴퓨터와 사용자의 대화를 통해 작업이 이루어지므로 대화형 시스템(interactive system)이라고 일컫는다.

## 1960 후반 - 시분할 시스템

- 컴퓨터의 크기가 작아지고 계산 능력이 향상되었다. 하지만 허가받은 몇몇 사용자만 사용할 수 있는 데다 고가였다. 값비싼 기계로 한 번에 하나의 작업만 수행하는 것은 낭비라 효율적으로 사용하기 위한 연구가 진행된 결과 다중 프로그래밍multiprogramming 기술이 개발되었다.
- 일괄 작업 시스템은 CPU에서 한번에 하나의 작업만이 가능했지만 후반에는 CPU로 여러 작업을 동시에 실행할 수 있었다. 어떻게 ? 시간을 분할하는 방법으로
- 다중 프로그래밍 시스템에서는 CPU 사용 시간을 아즈 잘게 쪼개어 여러 작업으로 나누어 준다.
- 영화 필름을 생각해보면 된다. 작은 시퀸스 조각으로 여럿 쪼개서 이어 붙이면 동영상이 되듯이 모든 작업을 조금씩 처리하여 작업이 동시에 이루어지는 것처럼 보이게 하는 것이다.

## 1970년대 - 분산 시스템

- 개인용 컴퓨터와 인터넷이 보급되면서 값이 싸고 크기가 작은 컴퓨터들을 하나로 묶어
  대형 컴퓨터에 버금가는 시스템을 만들게 되었는데 이를 분산 시스템distributed system이라고 부
  른다. 분산 시스템은 네트워크상에 분산되어 있는 여러 컴퓨터로 작업을 처리하고 그 결과를
  상호 교환하도록 구성한 시스템이다.
- TCP/IP라는 프로토콜을 정의했다.

## 1990 - 클라이언트 - 서버 시스템

- 작업을 요청하는 클라이언트와 거기에 응답하여 요청받은 작업을 처리하는 서버의 이중
  구조로 나뉜다.
- 클라이언트/서버 구조가 일반인들에게 알려진 것은 웹 시스템이 보급된 이후이다.
- 웹 시스템의 등장으로 그림이나 링크를 통한 다양한 응용 서비스가 가능해졌다.
- 클라이언트/서버 구조의 문제점으로는 서버 과부하가 있다. 모든 요청이 서버로 집중되기 때문에 수십만 명의 클라이언트를 처리하기 위해서는 많은 서버와 큰 용량의 네트워크가 필요하다.
- NOTE_DAEMON
  - 클라이언트/서버 시스템 구조에서 서버가 멈추지 않고 계속 동작하여 클라이언트의 요청을 처리해야 하는데, 이렇게 멈추지 않고 계속 동작하는 프로그램을 데몬이라고 한다. 보통은 데몬을 가진 컴퓨터를 서버라고 부르며, 웹 데몬이 설치된 컴퓨터는 웹 서버, FTP 데몬이 설치된 컴퓨터는 FTP 서버, 이메일 데몬이 설치된 컴퓨터는 이메일 서버라고 한다. 웹 데몬의 역할을 하는 프로그램은 아파티 톰캣, Internet Informantion Service등이 있다.

## 2000년대 초반 - 현재 - P2P 시스템

- 1990년대 말에 전 세계의 MP3 음악 파일을 공유하려는 시도가 있었는데 문제는 클라이언트/서버 시스템의 서버 과부하였다. 웹 페이지는 한 페이지가 수 킬로바이트이지만 MP3 파일은 수 메가바이트에 달하기 때문에 기존의 클라이언트/서버 구조로 MP3 파일 공유 시스템을 구현하면 서버 과부하가 걸림
- 서버의 부하를 줄일 수 있는 새로운 시스템은 P2P 시스템이다.
- peer는 말단 노드, 즉 사용자의 PC를 가르키고, P2P는 서버를 거치지 않고, 사용자와 사용자를 직접 연결을 한다. P2P 시스템에서는 서버가 파일 검색만 맡고 사용자 간에 파일 전송이 이루어지기 때문에 서버의 부하가 적다.

## Reference

<https://en.wikipedia.org/wiki/Arithmetic_logic_unit>
<https://www.techtarget.com/whatis/definition/arithmetic-logic-unit-ALU>