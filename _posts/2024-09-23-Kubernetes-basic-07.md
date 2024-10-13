---
layout: post
title: 쉽게 배우는 쿠버네티스 - 07
subtitle: ''
categories: devops
tags: k8s
comments: false
---

## 쿠버네티스에 오브젝트란?

- 쿠버네티스에선 상태를 가지고 있는 것을 오브젝트라고 한다.
- 상태라고 하면 보통 추구하는 상태, 현재 상태를 얘기한다.
- 오브젝트는 원하는 상태가 기술된 것을 의미한다.
- 감시 → 차이발견 → 상태발견 (싸이클 반복)
- 추구하는 상태 = 오브젝트 상태
- 추구하는 상태 = 현재 상태 → 오브젝트가 원하는 상태
- 오브젝트란 선언적으로 어떤 것을 추구하는 방향을 기술해 놓은 상태라고 정의한다.

## 기본적인 오브젝트

- 1차적으로는 Pod
  - api, etcd,c-m,sched,k-proxy
  - 상태값을 가지고 있다.
- svc
  - 이것도 오브젝트임
- namespace
  - 네임스페이스는 추가에 따라서 더 많이 생성가능
  - default namespace
    - pod, svc, deploy
    - 그외에 굉장히 많은 오브젝트들을 default에 배포할 수 있다.
  - kube-system
    - pod, svc, deploy
- vol
  - 영속적인 데이터를 보존하기 위해
  - pod는 가축같은 존재라 언제든 삭제하고 생성한다.
  - pod를 만들 때 volume을 붙여서 만들어야 한다.
    - 이유는 데이터를 추가한다고 했을 때 파드가 이곳 저곳으로 돌아다니면 안되기 때문이다.
- 볼륨을 쓴다는 얘기는 워커노드가 3개가 모두 같이 바라보는 공간이 필요하다
  - NFS서버 네트워크 파일 시스템을 만들면 모두가 같이 쓸수 있는 볼륨을 만들 수 있다.

<img width="697" alt="image" src="https://github.com/user-attachments/assets/0f43ec27-4908-4a78-af0a-de435cd3e8b3">

- 설정파일을 보면 volume이라는 옵션을 볼 수 있다.
- 볼륨을 구성하면 파드를 생성하면 그 컨테이너 안에 오딧이라는 곳에 마운트를 해준다.
- 그리고 레플리카를 3개를 만든다.
- dpy—check 야믈은 접속을 하면 기록을 저장을 하는 역할을 한다.

## Reference

<https://www.redhat.com/ko/topics/containers/what-is-kubernetes>

<https://cloud.google.com/kubernetes-engine?hl=ko>

<[https://www.openmaru.io/구글과-쿠버네티스/](https://www.openmaru.io/%ea%b5%ac%ea%b8%80%ea%b3%bc-%ec%bf%a0%eb%b2%84%eb%84%a4%ed%8b%b0%ec%8a%a4/)>