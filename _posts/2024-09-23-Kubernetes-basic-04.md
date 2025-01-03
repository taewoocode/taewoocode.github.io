---
layout: post
title: 쉽게 배우는 쿠버네티스 - 04
subtitle: ''
categories: devops
tags: k8s
comments: false
---

## 파드 배포 시에 쿠버네티스 구성들이 하는 일

### 쿠버네티스의 기본 철학

- 마이크로서비스 아키텍처
  - 하는 일들이 다 분업이 되어있다.
  - 나는 나의 일을 열심히 한다.
  - 반대되는 개념은 모놀리식 아키텍처이다.

### 동작방식

- 사용자가 파드 생성 요청을 하면 API 서버  & etcd 쪽으로 넘어간다.
  - API서버가 컨트롤러 매니저가 일을 잘하고 있는지 감시한다.
  - API서버가 선언해 놓은 값을 보고 컨트롤 매니저가 그걸 보고 파드를 생성한다.
  - API 서버가 모든 상태의 중심에 있다.
  - 스케줄러가 각 파드들을 배포하도록 담당을 하는데
  - 새로운 파드가 워커 노드에 들어갔는지 API서버가 감시를 한다.
  - 새로운 파드를 워커 노드에 넣도록 스케줄한다.
  - 파드 실제 생성은 kubelet이 한다.
  - API 서버는 또 강요하지 않고 새로운 파드가 노드에 잘 소속되어 있는지 감시를 한다.
  - 쿠버네티스는 컨테이너 런타임을 통해서 파드의 동작이나 생성을 하도록 만든다. 사실 직접 또 kubelet 생성을 하지는 않는다.
  - 생성된 정보나 뭐 파드 상태나 이런 것들은 쿠버네티스 API서버에 알려주는 구조이다.
  - API 서버는 선언된 상태값만을 가지고 있고 그 상태값을 기반으로 매니저, 스케줄러, 큐브렛등이 그 선언된 값에 값을 맞춰 넣으려는 방식으로 동작을 한다. 그런 방식을 통해서 파드가 사용가능한 상태가 되고 그것을 우리는 알게 된다.

  ## 선언적인 시스템

  - 추구하는 상태와 현재상태가 있다.
  - 추구하는 상태는 API서버에 kubectl로 선언해놓은 상태이고 현재 상태는 각각의 스케줄러, 쿠버 컨트롤, 쿠버네티스 이런 현재 상태들을 가지고 있는 것이다.
  - 이것을 계속 보면서 맞추려고 하는 것이 쿠버네티스의 기본적인 알고리즘이다.
  - API가 추구하는 값을 선언하고 다른 역할을 하는 매니저, 컨트롤들이 일을 잘하고 있는지 감시를 하는 형태라고 볼 수있다.
  - 추구하는 상태와 현재 상태를 맞추려고 하는 것

## API 서버와 Etcd는 다르다

- API서버는 가지고 있는 현재 상태 그리고 현재 추구하는 값들을 가지고 있는데 이 값은 휘발될 수 있으니 이 값에 대해서 지금 DB에 저장하는 것처럼 어떤 (구성)정보를 etcd라는 곳에 저장을 하게 되고 즉 kubernetes 클러스터에 업데이트 된 정보가 있다면 API 서버는 항상 etcd에게 저장을 하는 구조가 아닌 API서버가 etcd에 넣는 방식이다.

### 마스터노드

- API 서버
- 컨트롤러 매니저
- 스케줄러

## 실제 쿠버네티스의 파드 배포 흐름

<img width="702" alt="image" src="https://github.com/user-attachments/assets/ffbae762-abc8-4bf2-a92a-eda209c1a0b3">

- 쿠브컨트롤 명령을 통해서 API 서버에 명령이 들어간다.
  - 파드를 생성하거나 디플로이먼트를 생성하거나 서비스를 생성하고 삭제하는 것들을 API서버에 명령을 내린다.
  - 그럼 API서버는 etcd에 해당 정보를 업데이트 한다.
  - API 서버는 etcd와 1대1로 거의 동기화를 한다.
  - 문제가 생기면 etcd에 있는 정보를 복원하면 된다.
  - 하물며 버전까지도 맞춰낸다.
  - 그 다음으로 통신하는 곳은 컨트롤 매니저이다.
  - API 서버의 값을 컨트롤 매니저가 사실 보고 그거에 맞게 자기 값을 바꾸고 API 서버에도 업데이트를 진행한다.
  - 그 다음에는 스케줄러는 워커노드에 파드를 할당하고 각각의 워커노드에  밸런스되게 들어가도록한다. 실제로 파드가 생성되야 하니까 API 서버를 보고 쿠버렛이 파드를 생성해야 겠다는 생각을 한다.
  - 그러면 쿠버랫이 컨테이너 런타임에게 파드를 생성해 달라고 요청하고
  - 그러면 컨테이너 런타임이 파드를 생성하는 구조이다.
  - 이렇게 생성된 파드들은 사용자와 통신하기 위해서 상단에 보이는 쿠버프록시를 통해서 실제로 통신한다.
  - 쿠버프록시를 통해서 사용자가 통신을 하게 되고 이러한 네트워크들은 쿠버네티스에서 기본 제공을 한다기 보단 쿠버네티스에서 사용자에서 직접 선택하도록 되어 있는 영역이다. 그걸 컨테이너 네트워크 인터페이스라고 부르고 Calico를 보통사용한다.
  - API 서버는 쿠버네티스의 클러스터를 이루는 집합체이고 모든 것의 시작이자 끝이다.
    - 보통 게이트웨이 역할을 하고 있다
- 파드를 배포하거나 디플로이먼트를 배포하면 IP는 쿠버네티스가 제공을 한다.
- 어떤 IP가 제공되는지 우리는 알 수 없다.

## Reference

<https://www.redhat.com/ko/topics/containers/what-is-kubernetes>

<https://cloud.google.com/kubernetes-engine?hl=ko>

<[https://www.openmaru.io/구글과-쿠버네티스/](https://www.openmaru.io/%ea%b5%ac%ea%b8%80%ea%b3%bc-%ec%bf%a0%eb%b2%84%eb%84%a4%ed%8b%b0%ec%8a%a4/)>