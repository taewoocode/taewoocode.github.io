---
layout: post
title: 프로세스
subtitle: ""
categories: cs
tags: OS
comments: false
---

## 프로세스란?

- 프로세스는 프로그이 실행 중인 상태로 특정 메리 공간에 프로그의 코드가 적재되고 CPU 가 해당 명령어를 하나씩 수행하고 있는 상태를 의미한다. 운영 체제에서는 프로세스를 사용하여 프로그램을 수행한다. 쓰레드는 운영 체제에서 프로세서 시간을 할당하는 기본 단위로 하나 이상의 쓰레드가 해당 프로세스 내에서 코드를 실행한다.

## 프로세스의 구성요소

- 프로세스의 구조체에는 프로세스마다 독립적으로 관리해야 하는 유저 메리 영역이나 프로세스가 사용하는 각종 객체들의 포인터를 관리하는 핸들 테이블을 가지고 있다.
- *프로세스(Process)**란, 단순히 실행 가능한 코드(blob of code)를 넘어, **프로그램의 실행을 위해 운영체제가 생성하고 관리하는 실행 단위(Execution Context)**다. 이는 CPU 스케줄링, 메모리 보호, 입출력 자원 관리 등 운영체제의 다양한 자원 관리 정책의 핵심 단위로 작동한다.
  - **코드(Context of Code):** 실행 대상이 되는 명령어들의 집합.
  - **자원(Resource Set):** 실행에 필요한 메모리 공간, 파일 핸들, I/O 장치 핸들 등.
  - **실행 상태(Execution State):** CPU 레지스터 정보, 프로그램 카운터, 스택 포인터 등 현재 실행의 문맥을 구성하는 정보.

### 유저 메모리 영역 관리 (Virtual Address Descriptors)

프로세스별로 독립된 영역을 가지게 되는 곳은 유저 메모리 공간이다. 커널 메모리 공간의 경우 모든 프로세스가 공유하여 사용하지만, 유저 메모리 영역은 각 프로세스에 고유하게 할당된다. 이 유저 메모리 영역을 효율적으로 관리하기 위해 운영체제는 VAD(Virtual Address Descriptors)라는 관리 테이블을 사용한다.
VAD는 프로세스에서 `VirtualAlloc` 또는 `MapViewOfFile`과 같은 가상 메모리 할당 함수를 통해 할당된 영역이나, 파일 매핑을 통해 생성된 메모리 블록 등의 정보를 **이진 트리(Binary Tree)** 구조로 관리한다. 이 구조를 통해 프로세스가 어떤 가상 주소 범위를 어떻게 사용하는지 추적할 수 있으며, 메모리 해제 시에도 이를 참조하여 정확한 영역을 회수할 수 있다.

### 핸들 테이블 (Handle Table)

핸들 테이블은 프로세스에서 사용하는 모든 핸들에 대한 **커널 객체 포인터** 정보를 배열 형태로 저장하고 있는 공간이다. 여기서 핸들이란 파일, 이벤트, 세마포어, 쓰레드, 프로세스 등 커널 리소스에 접근하기 위한 추상화된 식별자이다.
핸들 테이블은 각 프로세스마다 독립적으로 유지되며, 운영체제는 이 테이블을 통해 프로세스가 접근 가능한 커널 객체들을 추적하고 관리한다. 프로세스가 종료할 경우, 이 테이블의 정보를 기반으로 프로세스가 보유하고 있던 커널 객체들을 자동으로 정리하고 자원을 반환한다.

### 독립적인 메모리 공간

프로세스 단위로 관리되는 자원 중 가장 중요한 특징은 바로 **독립적인 가상 메모리 공간**이다. 현대 운영체제에서는 **페이징 기법**을 활용하여 각 프로세스마다 고유한 가상 주소 공간을 부여하며, 이를 통해 다른 프로세스의 메모리에 직접 접근하지 못하도록 보호한다.
이러한 구조는 메모리 보호뿐 아니라, 동일한 물리 메모리를 각 프로세스가 서로 다른 주소로 매핑하여 사용할 수 있는 유연성도 제공한다. 특히 Windows 운영체제에서는 사용자 공간과 커널 공간을 명확히 구분하여, 안정성과 보안성을 확보하고 있다.


## Reference

<https://m.yes24.com/Goods/Detail/111378840>