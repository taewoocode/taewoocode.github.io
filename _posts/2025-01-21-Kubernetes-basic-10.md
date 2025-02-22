---
layout: post
title: Kubernetes - 파드와 디플로이먼트 차이
subtitle: ''
categories: devops
tags: k8s
comments: false
---
## 파드와 디플로이먼트는 무슨 차이가 있을까?

<img width="654" alt="Image" src="https://github.com/user-attachments/assets/018405f8-897b-4298-bd29-7bca900f315f" />

- run과 create deployment로 파드를 생성하는 것은 무슨차이가 있을까?
- run으로 파드를 생성하면 단일 파드 1개만 생성되고 관리된다. 그리고 create deployment로 파드를 생성하면 디플로이먼트(deployment)라는 관리 그룹 내에서 파드가 생성된다. 비유를 들자면, run으로 생성한 파드는 초코파이 1개이고, create deployment로 생성한 파드는 초코파이 상자에 들어있는 초코파이 1개가 된다.
- kubectl run은 사실 테스트 목적으로 자주사용된다. 그냥 간편한 목적으로 사용된다.

## 디플로이먼트로 배포하기

```bash
root@cp-k8s:~# kubectl create deployment deploy-nginx --image=nginx
deployment.apps/deploy-nginx created
```

```bash
root@cp-k8s:~# kubectl get pods
NAME                            READY   STATUS    RESTARTS   AGE
deploy-nginx-74d7d6d848-jz428   1/1     Running   0          19s
nginx                           1/1     Running   0          74m
```

- 파드가 한개만 있을 수 있는 것은 아니기 때문에 hash 코드를 이용해서 랜덤하게 고유 이름을 지정해준다.

```bash
root@cp-k8s:~# kubectl get pods -o wide
NAME                            READY   STATUS    RESTARTS   AGE    IP               NODE     NOMINATED NODE   READINESS GATES
deploy-nginx-74d7d6d848-jz428   1/1     Running   0          114s   172.16.132.1     w3-k8s   <none>           <none>
nginx                           1/1     Running   0          75m    172.16.103.129   w2-k8s   <none>           <none>
```

```bash
root@cp-k8s:~# curl 172.16.132.1
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
html { color-scheme: light dark; }
body { width: 35em; margin: 0 auto;
font-family: Tahoma, Verdana, Arial, sans-serif; }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html
```

## 여러개 배포한다면서 왜 하나만 배포되는가?

<img width="654" alt="Image" src="https://github.com/user-attachments/assets/84135c3f-13c7-4b35-b0cc-3f8cff24bc8a" />

- 여러개를 배포하기 위해서는 내부에 레플리카 셋이라는 것에 대한 도움을 받아야 한다.
- 예를 들어 파드를 3개 만들겠다고 레플리카셋에 선언함녀 컨트롤러 매니저와 스케줄러가 워커 노드에 파들 3개를 만들도록 선언한다. 그러나 레플리카셋은 파드 수를 보장하는 기능만 제공하기 때문에 롤링 업데이트 기능 등이 추가된 디플로이먼트를 사용해 파드 수를 관리하기를 권장한다.

```bash
root@cp-k8s:~# kubectl scale deployment deploy-nginx --replicas=3
deployment.apps/deploy-nginx scaled
root@cp-k8s:~# 
root@cp-k8s:~# 
root@cp-k8s:~# kubectl get pods
NAME                            READY   STATUS              RESTARTS   AGE
deploy-nginx-74d7d6d848-jz428   1/1     Running             0          5m51s
deploy-nginx-74d7d6d848-rzptz   1/1     Running             0          6s
deploy-nginx-74d7d6d848-zts8t   1/1     Running             0          6s
nginx                           1/1     Running             0          79m
root@cp-k8s:~# 
```

## Reference

<https://www.redhat.com/ko/topics/containers/what-is-kubernetes>

<https://cloud.google.com/kubernetes-engine?hl=ko>

<[https://www.openmaru.io/구글과-쿠버네티스/](https://www.openmaru.io/%ea%b5%ac%ea%b8%80%ea%b3%bc-%ec%bf%a0%eb%b2%84%eb%84%a4%ed%8b%b0%ec%8a%a4/)>