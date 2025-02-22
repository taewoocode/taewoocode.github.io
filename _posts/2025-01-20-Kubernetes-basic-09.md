---
layout: post
title: Kubernetes - 파드를 외부에서 접속
subtitle: ''
categories: devops
tags: k8s
comments: false
---

## 파드를 외부에서 접속하게 하는 서비스

## 외부에서 접속하게 하려면?

- **서비스(SVC)**는 Kubernetes에서 클러스터 내 파드들에 대한 접근 지점을 제공한다.
서비스는 클러스터 내부의 여러 파드들을 추상화하고, 외부에서 그 서비스에 접근할 수 있도록 연결하는 역할을 한다.
- 서비스는 파드를 찾는 경로를 제공하며, 외부 요청을 적절한 파드로 로드벨런싱하여 전달한다.

## NodePort

- NodePort는 Kubernetes에서 서비스가 외부와 통신할 수 있도록 만드는 방법 중에 하나이다. 
- 클러스터 내 파드는 외부와 직접 연결되지는 않지만, 서비스가 노트포트를 통해 외부 트래픽을 수신한다.
  - 즉 서비스가 파드들로 트래픽을 전달하는 구조를 맡고있다.

## 서비스를 통해서 외부와 연결되는 파드

```bash
root@cp-k8s:~# kubectl run nginx --image=nginx
pod/nginx created
root@cp-k8s:~# k get pods
NAME    READY   STATUS              RESTARTS   AGE
nginx   1/1     Running   0          11s

```

## 배포한 파드의 IP 확인

```bash
root@cp-k8s:~# kubectl get pods -o wide
NAME    READY   STATUS    RESTARTS   AGE   IP               NODE     NOMINATED NODE   READINESS GATES
nginx   1/1     Running   0          77s   172.16.103.129   w2-k8s   <none>           <none>
```

파드의 IP는 172.17.103.129임을 확인할 수 있다.

## curl을 통해 확인

```bash
root@cp-k8s:~# curl 172.16.103.129
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
</html>
```

## 파드를 노출

```bash
root@cp-k8s:~# kubectl expose pod nginx --type=NodePort --port=80
service/nginx exposed

root@cp-k8s:~# kubectl get svc
NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE
kubernetes   ClusterIP   10.96.0.1      <none>        443/TCP        41m
nginx        NodePort    10.99.57.196   <none>        80:31102/TCP   18s
```

노드에 접속을 해서 파드에 접속한다. 그래서 노드에 대한 정보가 필요하다

```bash
root@cp-k8s:~# kubectl get nodes -o wide
NAME     STATUS   ROLES           AGE   VERSION   INTERNAL-IP     EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION       CONTAINER-RUNTIME
cp-k8s   Ready    control-plane   42m   v1.30.1   192.168.1.10    <none>        Ubuntu 22.04.4 LTS   5.15.0-107-generic   containerd://1.6.28
w1-k8s   Ready    <none>          40m   v1.30.1   192.168.1.101   <none>        Ubuntu 22.04.4 LTS   5.15.0-107-generic   containerd://1.6.28
w2-k8s   Ready    <none>          38m   v1.30.1   192.168.1.102   <none>        Ubuntu 22.04.4 LTS   5.15.0-107-generic   containerd://1.6.28
w3-k8s   Ready    <none>          37m   v1.30.1   192.168.1.103   <none>        Ubuntu 22.04.4 LTS   5.15.0-107-generic   containerd://1.6.28
```

- **80**: Kubernetes 클러스터 내에서 서비스가 수신하는 **내부 포트이다**. 클러스터 내부에서 다른 파드나 서비스가 이 포트로 접근한다.
- **31102**: 외부에서 이 서비스를 접근할 때 사용하는 **노드 포트이다(외부포트)**. 외부에서 클러스터 노드의 IP와 함께 이 포트로 접근할 수 있다.

## 브라우저(외부) 접속 확인
<img width="654" alt="Image" src="https://github.com/user-attachments/assets/c1e18538-9536-4988-a70d-44bee911b751" />


## Reference

<https://www.redhat.com/ko/topics/containers/what-is-kubernetes>

<https://cloud.google.com/kubernetes-engine?hl=ko>

<[https://www.openmaru.io/구글과-쿠버네티스/](https://www.openmaru.io/%ea%b5%ac%ea%b8%80%ea%b3%bc-%ec%bf%a0%eb%b2%84%eb%84%a4%ed%8b%b0%ec%8a%a4/)>