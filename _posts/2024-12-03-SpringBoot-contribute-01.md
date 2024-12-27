---
layout: post
title: SpringBoot Contribute
subtitle: ''
categories: opensource
tags: opensource
comments: false
---

## Issue

<img width="654" alt="image" src="https://github.com/user-attachments/assets/79f345b0-d55c-497f-8e86-06ad21f9bf04" />

스프링에서 Open되어있는 이슈들에서 task를 받아서 기여할 수도 있지만 나는 평소 스프링이 어떻게 구조화 되어있는지 내심 궁금했기에 
하나하나 소스코드들을 읽어 보았다. 그러던 와중에 스프링에 문제아닌 문제? 마이너한 문제를 찾을 수 있었다.

<img width="654" alt="image" src="https://github.com/user-attachments/assets/07134b6a-2b24-4bd5-a93e-dde1c7d2e906" />


SpringBoot/http/client에 ReflectiveComponentsClientHttpRequestFactoryBuilder의 생성자에서 assert 오류 메시지 포맷을 개선한 변경 하였다.
기존의 오류 메시지가 문자열이 하드코딩되어 있어, 메시지 수정이나 로컬라이징 작업이 어려워 보였고 String.format()을 사용하여 동적으로 생성되도록 수정하였다.
사실 개선사항이 크게 필요는 없는 부분이지만 장기적으로 보았을 땐 변경되는 코드에 따라서 메시지의 포맷이 일관되게 유지되면 좋겠다고 생각했다.
그리고 무엇보다 오픈소스 생태계 그것도 스프링 오픈소스 생태계에 기여해볼 수 있다는 것이 가장 큰 동기부여가 되었다.

## 변경

<img width="654" alt="image" src="https://github.com/user-attachments/assets/80281847-748a-4534-9549-0d8e99939b56"/>

매우 작고 간단했던 작업 내용이였지만 내가 직접 세계적인 오픈소스의 컨트리뷰터가 되기 위한 첫 걸음을 나아갔다는 점에서 상당히 뿌듯하다.

<img width="654" alt="image" src="https://github.com/user-attachments/assets/5c2992cb-3b2c-4abb-a4a3-5da7e1eb0b2e" />

그리고 오픈소스들이라면 코딩 및 커밋 컨벤션을 가지고 있다. 해당 규칙을 만족해야 커밋이 반영이 된다. 
SpringBoot 같은 경우에는 [여기](https://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)에서 컨벤션 규칙을 정리해두었다. 꼭 읽고 커밋하자

