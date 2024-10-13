---
layout: post
title: 쉽게 배우는 쿠버네티스 - 06
subtitle: ''
categories: devops
tags: k8s
comments: false
---

## 컨테이너 런타임에 문제가 생기면 어떻게 될까?

<img width="442" alt="image" src="https://github.com/user-attachments/assets/2f12fa61-489f-4113-bbbc-8851d8f2587b">

- 1.2버전에 맞는 D버전임을 고려한다.
- 워커노드1에서 systemctl stop containerd 를 수행이후 systemctl status containerd로 확인한다.

```java
root@cp-k8s:~# kubectl scale deployment del-deploy --replicas=6
deployment.apps/del-deploy scaled
root@cp-k8s:~# 
root@cp-k8s:~# 
root@cp-k8s:~# 
root@cp-k8s:~# k get pods -o wide -w
NAME                         READY   STATUS    RESTARTS   AGE    IP               NODE     NOMINATED NODE   READINESS GATES
del-deploy-d6c48dfbf-692dh   1/1     Running   0          6m1s   172.16.132.4     w3-k8s   <none>           <none>
del-deploy-d6c48dfbf-hwtvx   1/1     Running   0          6m1s   172.16.103.134   w2-k8s   <none>           <none>
del-deploy-d6c48dfbf-p7vj7   1/1     Running   0          8s     172.16.103.136   w2-k8s   <none>           <none>
del-deploy-d6c48dfbf-xpp9h   1/1     Running   0          8s     172.16.132.6     w3-k8s   <none>           <none>
del-deploy-d6c48dfbf-z5qpn   1/1     Running   0          8s     172.16.103.135   w2-k8s   <none>           <none>
del-deploy-d6c48dfbf-zp28f   1/1     Running   0          6m1s   172.16.132.5     w3-k8s   <none>           <none>
```

- 컨테이너 런타임이 멈췄기 때문에 워커노드1에는 파드가 배포되지 않음을 확인할 수 있다.
- 워커노드 1번은 컨테이너런타임이 5분 정도가 지속되면 Evict라고해서 컨테이너 런타임이 동작하지 않고 있다는 것을 인식해서 다른 워커노드로 옮겨준다.

## 추가 배포를 통해 스케줄러 역할을 확인

- 스케줄러는 어떻게 동작하고 어떤식으로 다시 재배포를 할까?
- 컨테이너D를 다시 시작하고 스케줄러가 동작하는 것을 확인한다.
- replicas의 숫자를 바꿔서 스케줄러가 배포를 가능한 균등하게 하는지 확인한다

<img width="690" alt="image" src="https://github.com/user-attachments/assets/afebd122-fdcc-467e-ac44-fd1dd7c5207a">

- 가능한 w1, w2, w3에 가능하면 균등하게 배포가 되는 것을 확인할 수 있다.
    - 보장하는 것은 Spread Topology Constraint라는 토폴로지 분배 제약 조건이라는 기능을 써야만 균등하게 배포를 보장한다.

```java
root@cp-k8s:~# k scale deployment del-deploy --replicas=0
deployment.apps/del-deploy scaled
root@cp-k8s:~# k get pods -o wide -w
^Croot@cp-k8s:~# k get pods
No resources found in default namespace.
root@cp-k8s:~#  
```

- replicas를 0으로 맞춰주면 Terminating이 빠르게 일어나서 하나도 없는 상태가 된다.

## 쿠버네티스 마스터 노드에 문제가 생기면 어떻게 될까?

- 스케줄러를 삭제해보자

```java
root@cp-k8s:~# k delete pod kube-scheduler-cp-k8s -n kube-system
pod "kube-scheduler-cp-k8s" deleted
```

<img width="692" alt="image" src="https://github.com/user-attachments/assets/810388fc-ae2c-42be-9d0a-7ae0c6fff4f2">

- 파드가 다시 생성되었다.
- 즉 마스터 노드에 존재하는 중요한 요소들은 특별하게 존재되기 때문에 파드라고 할지언정 문제가 생기면 다시 만들어 낸다.

## Reference

<https://www.redhat.com/ko/topics/containers/what-is-kubernetes>

<https://cloud.google.com/kubernetes-engine?hl=ko>

<[https://www.openmaru.io/구글과-쿠버네티스/](https://www.openmaru.io/%ea%b5%ac%ea%b8%80%ea%b3%bc-%ec%bf%a0%eb%b2%84%eb%84%a4%ed%8b%b0%ec%8a%a4/)>