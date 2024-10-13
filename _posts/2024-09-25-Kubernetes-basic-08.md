---
layout: post
title: 쉽게 배우는 쿠버네티스 - 08
subtitle: ''
categories: devops
tags: k8s
comments: false
---

## 변경 가능성이 있는 오브젝트

```java
root@cp-k8s:~# cat ~/_Book_k8sInfra/ch3/3.2.4/echo-hname.yaml | grep replicas
  replicas: 6
root@cp-k8s:~# cat ~/_Book_k8sInfra/ch3/3.2.4/echo-hname.yaml | grep replicas
  replicas: 6
root@cp-k8s:~# k create -f ~/_Book_k8sInfra/ch3/3.2.4/echo-hname.yaml 
Error from server (AlreadyExists): error when creating "/root/_Book_k8sInfra/ch3/3.2.4/echo-hname.yaml": deployments.apps "echo-hname" already exists
root@cp-k8s:~# k apply -f ~/_Book_k8sInfra/ch3/3.2.4/echo-hname.yaml 
Warning: resource deployments/echo-hname is missing the kubectl.kubernetes.io/last-applied-configuration annotation which is required by kubectl apply. kubectl apply should only be used on resources created declaratively by either kubectl create --save-config or kubectl apply. The missing annotation will be patched automatically.
deployment.apps/echo-hname configured
root@cp-k8s:~# k get pods
NAME                          READY   STATUS    RESTARTS   AGE
echo-hname-6b7d4f9544-9h8kw   1/1     Running   0          6s
echo-hname-6b7d4f9544-bww64   1/1     Running   0          6s
echo-hname-6b7d4f9544-dzgkb   1/1     Running   0          3m3s
echo-hname-6b7d4f9544-j7fn6   1/1     Running   0          3m3s
echo-hname-6b7d4f9544-w7m6b   1/1     Running   0          6s
echo-hname-6b7d4f9544-xj6hv   1/1     Running   0          3m3s
```

오브젝트를 처음부터 apply로 생성한 것이 아니어서 경고가 뜬다. 경고가 떠도 작동에는 문제가 없지만 일관성에서는 문제가 생길 수 있다. 이처럼 변경 사항이 발생할 가능성이 있는 오브젝트는 처음부터 apply로 생성하는 것이 좋다.

일회성으로 파드를 생성할 때는 run, create를 쓰지만 변경할 가능성이 있는 파드에는 apply로 배포를 하는 것이 좋다.

## exec 살펴보기

```java
root@cp-k8s:~# k get pods -o wide
NAME                          READY   STATUS    RESTARTS   AGE     IP               NODE     NOMINATED NODE   READINESS GATES
echo-hname-6b7d4f9544-9h8kw   1/1     Running   0          3m17s   172.16.132.5     w3-k8s   <none>           <none>
echo-hname-6b7d4f9544-bww64   1/1     Running   0          3m17s   172.16.221.133   w1-k8s   <none>           <none>
echo-hname-6b7d4f9544-dzgkb   1/1     Running   0          6m14s   172.16.103.132   w2-k8s   <none>           <none>
echo-hname-6b7d4f9544-j7fn6   1/1     Running   0          6m14s   172.16.221.132   w1-k8s   <none>           <none>
echo-hname-6b7d4f9544-w7m6b   1/1     Running   0          3m17s   172.16.103.133   w2-k8s   <none>           <none>
echo-hname-6b7d4f9544-xj6hv   1/1     Running   0          6m14s   172.16.132.4     w3-k8s   <none>           <none>
```

- exec : excute는 실행을 의미하며 i 옵션은 stdin(standard input)을 의미하고 -t는 tty를 의미한다.
- tty 란 유닉스나 유닉스와 같은 운영체제에서standard input 에 연결된 터미널의 파일 이름을 출력하기 위한 명령어이다.
- 이 두개를 합친 it는 표준 입력을 명령줄 인터페이스로 작성한다는 의미가 된다.

## 노드 유지보수하기

- drain은 지정된 노드의 파드를 전부 다른 곳으로 이동시켜 해당 노드를 유지보수할 수 있게 합니다.
- kubectl drain 명령을 실행하면 유지보수할 노드를 파드가 없는 상태로 만든다. 그런데 이 명령을 실행하면 w3-k8s에서 데몬셋을 지울 수 없어서 명령을 수행할 수 없다고 나온다.
- drain은 실제로 파드를 옮기는 것이 아니라 노드에서 파드를 삭제하고 다른 곳에 다시 생성한다.
- Daemonset은 각 노드에 1개만 존재하는 파드라서 drain으로는 삭제할 수 없다.

## 파드 업데이트하고 복구하기

- 파드를 운영하다 보면 컨테이너에 새로운 기능을 추가하거나 치명적인 버그가 발생해 버전을 업데이트해야 할 때가 있다. 또는 업데이트하는 도중 문제가 발생해 다시 기존 버전으로 복구해야 하는 일도 발생한다.

root@cp-k8s:~# cat ~/_Book_k8sInfra/ch3/3.2.10/rollout-nginx.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: rollout-nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.15.12
```

```yaml
root@cp-k8s:~# k apply -f  ~/_Book_k8sInfra/ch3/3.2.10/rollout-nginx.yaml --record
Flag --record has been deprecated, --record will be removed in the future
deployment.apps/rollout-nginx created
root@cp-k8s:~# k get pods
NAME                             READY   STATUS    RESTARTS   AGE
rollout-nginx-554dbf8b76-j9xb8   1/1     Running   0          3s
rollout-nginx-554dbf8b76-l7cr5   1/1     Running   0          3s
rollout-nginx-554dbf8b76-qrc4m   1/1     Running   0          3s
```

배포한 파드의 정보는 원하는 옵션으로 확인이 가능함

```java
root@cp-k8s:~# k get pods \
> -o=custom-columns=NAME:.metadata.name,IP:.status.podIP,STATUS:.status.phase,NODE:.spec.nodeName
NAME                             IP               STATUS    NODE
rollout-nginx-554dbf8b76-j9xb8   172.16.103.142   Running   w2-k8s
rollout-nginx-554dbf8b76-l7cr5   172.16.221.141   Running   w1-k8s
rollout-nginx-554dbf8b76-qrc4m   172.16.132.11    Running   w3-k8s
```

rollout history

```java
root@cp-k8s:~# k rollout history deployment rollout-nginx 

deployment.apps/rollout-nginx 
REVISION  CHANGE-CAUSE
1         kubectl apply --filename=/root/_Book_k8sInfra/ch3/3.2.10/rollout-nginx.yaml --record=true

```

- record 옵션으로 기록된 히스토리는 rollout history 명령을 실행해 확인할 수 있다.

nginx 컨테이너 버전 업데이트 해보기

```java
root@cp-k8s:~# curl -I -silent 172.16.103.142 | grep Server
Server: nginx/1.15.12

```

nginx 컨테이너 버전을 1.16으로 업데이트한다.

```java
root@cp-k8s:~# k set image deployment rollout-nginx nginx=nginx:1.16.0 --record
Flag --record has been deprecated, --record will be removed in the future
deployment.apps/rollout-nginx image updated
```

nginx컨테이너를 업데이트하니 파드의 IP정보가 변경됨을 확인할 수 있음

```java
root@cp-k8s:~# k get pods -o=custom-columns=NAME:.metadata.name,IP:.status.podIP,STATUS:.status.phase,NODE:.spec.nodeName
NAME                             IP               STATUS    NODE
rollout-nginx-554dbf8b76-l7cr5   172.16.221.141   Running   w1-k8s
rollout-nginx-6fc666844-4h7zq    172.16.132.12    Running   w3-k8s
rollout-nginx-6fc666844-4rrq8    172.16.103.143   Running   w2-k8s
rollout-nginx-6fc666844-f8np4    <none>           Pending   w1-k8s
```

- 파드들의 이름과 IP가 변경이 되었다.
- 파드는 언제라도 지우고 다시만들 수 있다. 따라서 파드에 속한 nginx 컨테이너를 업데이트하기 가장 쉬운 방법은 파드를 관리하는 replicas의 수를 줄이고 늘려 파드를 새로 생성하는 것이다. 시스템의 영향을 최소하하기 위해 replicas에 속한 파드를 모두 한 번에 지우는 것이 아니라 파드를 하나씩 순차적으로 지우고 생성한다.
    - 파드의 수가 많으면 하나씩 업데이트 하는 것이 아닌 여러개를 한번에 업데이트 한다.

## Reference

<https://www.redhat.com/ko/topics/containers/what-is-kubernetes>

<https://cloud.google.com/kubernetes-engine?hl=ko>

<[https://www.openmaru.io/구글과-쿠버네티스/](https://www.openmaru.io/%ea%b5%ac%ea%b8%80%ea%b3%bc-%ec%bf%a0%eb%b2%84%eb%84%a4%ed%8b%b0%ec%8a%a4/)>