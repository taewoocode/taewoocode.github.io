---
layout: post
title: Spring Basic 14 - 라이브러리 직접 만들어 보기
subtitle: ""
categories: framework
tags: spring
comments: false
---

## 

## 순수 라이브러리

스프링부트가 직접 제공해주는 @AutoConfiguration을 이해하기 위해서는 그 전에 먼저 라이브러리가 어떻게 사용되는지 이해하는 것이 필요하다.
그리고 직접 라이브러리를 만들어 보면서 스프링 부트가 얼마나 위대한지 알 수 있었다.

<img width="654" alt="image" src="https://github.com/user-attachments/assets/61384a2f-0a19-4356-b5b8-1e7d093ec679" />

우선 라이브러리로 사용할 프로젝트에서 jar를 만들어 준다.

<img width="654" alt="image" src="https://github.com/user-attachments/assets/71978aa7-529a-48c2-9449-12cdba1928ff" />

그리고 실제 라이브러리를 사용하는 프로젝트에서 루트 디렉토리 아래에 libs 폴더를 생성해 준다.

<img width="654" alt="image" src="https://github.com/user-attachments/assets/3a7770af-51d5-4198-9ef8-aee960c25169" />

그리고 gradle에 가서 방금 추가한 jar의 경로를 gradle에 추가한다.

<img width="654" alt="image" src="https://github.com/user-attachments/assets/5837456f-ba1b-4ada-b460-b7e677b963f5" />

사실 여기가 제일 난감하다. 지금은 프로젝트가 소규모 프로젝트이고, 학습을 위한 프로젝트라서 간단하지 실제로 이게 대규모 프로젝트였다면 라이브러리를 등록하기
위한 Bean을 다 설정해 줘야 하는데 어디서부터 건드려야 할지 굉장히 어려워진다고 한다.

그래서 우리는 Springboot가 제공해주는 AutoConfiguration이 있기에 라이브러리를 편리하게 사용할 수 있다.

## Reference

<https://stackoverflow.com/questions/61506907/how-can-a-library-module-of-a-spring-application-add-additional-configuration-to>