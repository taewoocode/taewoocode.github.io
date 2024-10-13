---
layout: post
title: 쉽게 배우는 쿠버네티스 - 03
subtitle: ''
categories: devops
tags: k8s
comments: false
---

## 디플로이먼트란?

Kubernetes(줄여서 K8S)의 디플로이먼트(Deployment)는 애플리케이션을 컨테이너화하여 Kubernetes 클러스터에 배포하고 관리하는 데 사용되는 주요 오브젝트 중 하나이다. 디플로이먼트를 사용하면 컨테이너화된 애플리케이션의 배포, 업데이트, 롤백, 확장 및 자가 치유(self-healing) 기능을 간편하게 관리할 수 있다.

### 주요 기능

1. **배포 및 업데이트 관리**: 디플로이먼트를 통해 애플리케이션의 새로운 버전을 손쉽게 배포하고, 지속적인 배포 전략(예: 롤링 업데이트)을 사용할 수 있다. 이를 통해 서비스 중단 없이 새로운 버전으로 업데이트할 수 있다.
2. **롤백**: 만약 새로운 버전의 애플리케이션에 문제가 발생하면, 이전 버전으로 손쉽게 롤백할 수 있다.
3. **확장(Scaling)**: 애플리케이션의 트래픽이 증가하면 디플로이먼트를 통해 손쉽게 파드의 개수를 늘릴 수 있습니다. 반대로, 트래픽이 줄어들면 파드의 개수를 줄일 수 있다.
4. **자가 치유(Self-Healing)**: 디플로이먼트는 실행 중인 파드가 장애가 발생하거나 문제가 생길 경우, 이를 감지하고 자동으로 새로운 파드를 생성해 정상 상태를 유지한다.
5. **Pod 템플릿 관리**: 디플로이먼트는 파드를 정의하는 템플릿을 포함하며, 이를 통해 파드의 컨테이너 이미지, 환경 변수, 볼륨, 네트워크 설정 등을 관리한다.

## 디플로이먼트 노출하려면 노드포트 사용

- 노드 포트로 노출

```java
root@cp-k8s:~# k expose deployment deploy-nginx --type=NodePort --port=80
service/deploy-nginx exposed
root@cp-k8s:~# 
root@cp-k8s:~# 
root@cp-k8s:~# 
root@cp-k8s:~# k get svc
NAME           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
deploy-nginx   NodePort    10.103.27.106   <none>        80:31743/TCP   6s
kubernetes     ClusterIP   10.96.0.1       <none>        443/TCP        16h
```

- 뭐가 되었든 로드벨런서 타입으로 노출시키는 것이 유리하다.

## 노드포트보다 로드벨런서가 좋은점

- 노드포트는 노드의 아이피를 알려줘야한다. → 보안상 좋지 않다.
- 로드벨런서는 버츄얼 IP처럼 대표하는 IP를 만들어서 알려줄 수 있다
    - 노드포트를 공개하는 부담이 없다.
- 로드벨런서는 가야되는 경로를 최적화해준다.

## 디플로이먼트를 로드벨런서로 배포

- 로드벨런서를 사용하면 노드포트를 외부에 노출시킬 필요가 없다.
- 로드벨런서가 최선의 방법이다.
- 디플로이먼트는 레플리카셋은 이용해서 파드의 수를 조정한다.
    - 기본적으로는 하나가 배포가 되지만 스캐일을 이용해서 그 갯수를 정할 수 있다.

## 쿠버네티스에서 서비스란? SVC

- 집구조를 생각해보면 안방,서재,책방 이런 곳에 갈라면 거실을 거쳐야 한다.
    - 거실같은 곳이 서비스라고 생각하면 된다.
    - 다른 어떤곳을 넘어가기 위해 항상 거쳐야 하는 곳이다.

## 배포된 파드 삭제하기

```
root@cp-k8s:~# k delete svc chk-hn
service "chk-hn" deleted
root@cp-k8s:~#
root@cp-k8s:~#
root@cp-k8s:~# k get svc
NAME           TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)        AGE
deploy-nginx   NodePort    10.99.97.20           80:32473/TCP   70m
kubernetes     ClusterIP   10.96.0.1             443/TCP        91m
root@cp-k8s:~# k delete svc deploy-nginx
service "deploy-nginx" deleted
root@cp-k8s:~# k get svc
NAME         TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
kubernetes   ClusterIP   10.96.0.1            443/TCP   91m

root@cp-k8s:~# k delete deployment chk-hn 
deployment.apps "chk-hn" deleted
root@cp-k8s:~# k delete deployment deploy-nginx 
deployment.apps "deploy-nginx" deleted
root@cp-k8s:~# k delete pod nginx

root@cp-k8s:~# k delete -f ~/_Lecture_k8s_starter.kit/ch3/3.4/metallb.yaml 
namespace "metallb-system" deleted
serviceaccount "controller" deleted
serviceaccount "speaker" deleted
clusterrole.rbac.authorization.k8s.io "metallb-system:controller" deleted
clusterrole.rbac.authorization.k8s.io "metallb-system:speaker" deleted
role.rbac.authorization.k8s.io "config-watcher" deleted
role.rbac.authorization.k8s.io "pod-lister" deleted
role.rbac.authorization.k8s.io "controller" deleted
clusterrolebinding.rbac.authorization.k8s.io "metallb-system:controller" deleted
clusterrolebinding.rbac.authorization.k8s.io "metallb-system:speaker" deleted
rolebinding.rbac.authorization.k8s.io "config-watcher" deleted
rolebinding.rbac.authorization.k8s.io "pod-lister" deleted
rolebinding.rbac.authorization.k8s.io "controller" deleted
daemonset.apps "speaker" deleted
deployment.apps "controller" deleted
configmap "config" deleted

```

## Reference

<https://www.redhat.com/ko/topics/containers/what-is-kubernetes>

<https://cloud.google.com/kubernetes-engine?hl=ko>

<[https://www.openmaru.io/구글과-쿠버네티스/](https://www.openmaru.io/%ea%b5%ac%ea%b8%80%ea%b3%bc-%ec%bf%a0%eb%b2%84%eb%84%a4%ed%8b%b0%ec%8a%a4/)>