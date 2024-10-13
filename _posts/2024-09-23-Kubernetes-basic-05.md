---
layout: post
title: 쉽게 배우는 쿠버네티스 - 05
subtitle: ''
categories: devops
tags: k8s
comments: false
---

## 파드에 문제가 생겼다면?

- 파드를 실수로 지웠다면?
    - 파드만 배포된 경우
        - 난감하다. 그냥 지워진거다.
    - 디플로이먼트 형태라면 ?
        - 파드는 디플로이먼트 형태로 파드를 유지하기 때문에 문제가 생기지 않는다.
        - 파드는 단일객체이지만 디플로이먼트는 파드를 감싸고 있는 객체이다.
        - 파드가 지워지게 되면 다시 만들게 된다.

## 쿠버네티스가 파드를 대하는 자세(애완동물과 가축)

- 파드는 항상 다시 생성되는 경우가 많다
    - 예를들면 업데이트를 한다거나, 노드가 이상해서 노드에 있는 파드를 옮겨야 한다는다든가

파드 배포

```
root@cp-k8s:~# k apply -f ~/_Lecture_k8s_starter.kit/ch5/5.1/del-
del-deploy.yaml  del-pod.yaml
root@cp-k8s:~# k apply -f ~/_Lecture_k8s_starter.kit/ch5/5.1
deployment.apps/del-deploy created
pod/del-pod created

root@cp-k8s:~# k get pods
NAME                         READY   STATUS    RESTARTS   AGE
del-deploy-d6c48dfbf-6crl4   1/1     Running   0          49s
del-deploy-d6c48dfbf-pxvnq   1/1     Running   0          49s
del-deploy-d6c48dfbf-qktx9   1/1     Running   0          49s
del-pod                      1/1     Running   0          49s

```

- 디렉토리 형태로 배포를 지정해주면
- 디렉토리에 있는 yaml을 읽어서 바로 생성한다.

pod로 배포한 것 delete

```java
root@cp-k8s:~# k delete pod del-pod
pod "del-pod" deleted
root@cp-k8s:~# 
root@cp-k8s:~# 
root@cp-k8s:~# 
root@cp-k8s:~# 
root@cp-k8s:~# 
root@cp-k8s:~# 
root@cp-k8s:~# k get pods
NAME                         READY   STATUS    RESTARTS   AGE
del-deploy-d6c48dfbf-6crl4   1/1     Running   0          96s
del-deploy-d6c48dfbf-pxvnq   1/1     Running   0          96s
del-deploy-d6c48dfbf-qktx9   1/1     Running   0          96s
```

- pod로 배포하게 되면 쉽게 delete가 된다.

디플로이먼트로 배포한 것을 지우면?

```java
root@cp-k8s:~# k get pods
NAME                         READY   STATUS    RESTARTS   AGE
del-deploy-d6c48dfbf-6crl4   1/1     Running   0          3m22s
del-deploy-d6c48dfbf-pxvnq   1/1     Running   0          3m22s
del-deploy-d6c48dfbf-qktx9   1/1     Running   0          3m22s
root@cp-k8s:~# k delete pod del-deploy-d6c48dfbf-qktx9
pod "del-deploy-d6c48dfbf-qktx9" deleted
root@cp-k8s:~# 
root@cp-k8s:~# 
root@cp-k8s:~# k get pods
NAME                         READY   STATUS              RESTARTS   AGE
del-deploy-d6c48dfbf-6crl4   1/1     Running             0          3m58s
del-deploy-d6c48dfbf-pxvnq   1/1     Running             0          3m58s
del-deploy-d6c48dfbf-wqhhk   0/1     ContainerCreating   0          2s
root@cp-k8s:~# 
root@cp-k8s:~# k delete deployment del-deploy 
deployment.apps "del-deploy" deleted
root@cp-k8s:~# 
root@cp-k8s:~# 
root@cp-k8s:~# k get pods
No resources found in default namespace.
root@cp-k8s:~# 

```

- 기존의 파드가 사라지고 새로운 파드가 생성되는 것을 볼 수 있다.
- 이것은 deployment가 세 개를 유지해야 된다는 게 이미 규정되어 있기 때문이다.
- 지워지자마자 새로운 것을 다시 생성한다.
- 그래서 deployment를 지우려면 디플로이먼트를 삭제해야 한다.
- 즉 파드는 실수를 하면 날아가는 존재이지만 디플로이먼트는 파드의 숫자를 유지하는 존재이다.

---

## 쿠버네티스 구성 요소에 문제가 생긴다면?

- 대부분의 구성요소들은 문제가 생겨도 대부분 복구가 빠르게 일어난다.
- 통신하는 방식이 선언적으로 API에 선언한 것을 그대로 가져가는 것이 아닌 존재가 있다.
- 쿠버렛
    - 쿠버렛에 문제가 생기면 API서버와 문제가 직접적으로 선언한 것을 가져가는 방식이 아니다.
    - 그리고 선언적인 방식과 쿠버렛이 런타임으로 보내주는 방식이 아니다.

## kubelet종료하기

<img width="680" alt="image" src="https://github.com/user-attachments/assets/9397579f-6cdc-4c18-879a-dfa13653eee1">

```java
root@cp-k8s:~# k get pods -o wide
NAME                         READY   STATUS    RESTARTS   AGE   IP               NODE     NOMINATED NODE   READINESS GATES
del-deploy-d6c48dfbf-692dh   1/1     Running   0          13s   172.16.132.4     w3-k8s   <none>           <none>
del-deploy-d6c48dfbf-hwtvx   1/1     Running   0          13s   172.16.103.134   w2-k8s   <none>           <none>
del-deploy-d6c48dfbf-zp28f   1/1     Running   0          13s   172.16.132.5     w3-k8s   <none>           <none>
```

- w1k8s에는 배포가 되지 않았다.
- 워커노드단에 kubelet에 문제가 생기면 배포가 제대로 이뤄지지 않는다.


## Reference

<https://www.redhat.com/ko/topics/containers/what-is-kubernetes>

<https://cloud.google.com/kubernetes-engine?hl=ko>

<[https://www.openmaru.io/구글과-쿠버네티스/](https://www.openmaru.io/%ea%b5%ac%ea%b8%80%ea%b3%bc-%ec%bf%a0%eb%b2%84%eb%84%a4%ed%8b%b0%ec%8a%a4/)>