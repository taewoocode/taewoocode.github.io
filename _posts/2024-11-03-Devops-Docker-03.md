---
layout: post
title: Nginx SpringBoot
subtitle: ''
categories: devops
tags: docker
comments: false
---

사내에서 서비스 개발을 진행하게 될 환경을 구축하는 것을 담당하게 되었다.
항상 주어진 환경내에서만 세팅을 하다가 직접 세팅을 하게 되니 얻는 것이 많아서 글을 작성하게 되었다.

<img width="654" alt="image" src="https://github.com/user-attachments/assets/05efb4bc-8fc1-4384-9a4e-cc0bdda90797">

Nginx 기반의 Springboot 서버를 띄우는 것이 이번 환경 구축의 핵심이다.

## Docker network 설정

<img width="654" alt="image" src="https://github.com/user-attachments/assets/9de2ffc1-5787-4d5f-8f40-8e539af8de4a">

Docker 네트워크가 중요한 이유는 **컨테이너 간의 통신**을 가능하게 하기 위해서이다. 
Docker에서 각 컨테이너는 기본적으로 **독립된 네트워크 환경**을 가지고 있어, 
서로 다른 네트워크에 있으면 컨테이너 간에 직접적으로 통신할 수 없다. 
Docker 네트워크를 사용하면 동일한 네트워크 내에 있는 컨테이너들끼리는 서로 쉽게 통신할 수 있다.
따라서 trusted-net 이라는 네트워크를 하나 만들어 두고 컨테이너들을 매핑시켜 주었다.

## Nginx.conf 파일 수정, 과정

처음 해보는 것이라 이게 굉장히 애를 많이 먹었는데 일단 과정을 살펴보자

```bash
docker exec -it nginx-proxy-server /bin/bash
```

먼저 Container안에 접속을 해주고

```bash
cd /etc/nginx/
```

/etc/nginx에 들어가서 default.conf를 확인한다.
그리고 이제 nginx.conf 파일을 수정해야 한다.

## nginx.conf

<img width="654" alt="image" src="https://github.com/user-attachments/assets/e52dd8d9-f261-434c-a525-9f3746372d80">

포트를 다 내부포트로 변경하고, default로 설정되어 있는 include경로를 제거한다.
처음에 이것을 제거해주지 않아서 8083으로 입력했을 때 boot가 나오지 않고 
include에 포함되어 있는 conf파일이 나와서 아래의 경로로 설정한 서버가 나오지 않았었다. 
include 경로를 제거해줘야 한다.
이제 8083포트를 입력해주면 해당 서버가 제대로 나오게 된다.


## Reference

<https://velog.io/@18k7102dy/Docker-Spring-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%EB%A5%BC-Docker%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%B4%EC%84%9C-%EB%B0%B0%ED%8F%AC%ED%95%B4%EB%B4%85%EC%8B%9C%EB%8B%A4>


