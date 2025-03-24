---
layout: post
title: 네이버 Java 코딩 컨벤션 적용
subtitle: ""
categories: language
tags: java
comments: false
---

## 개요

프로젝트를 하면서 컨벤션을 적용하지 않고, merge를 요청 했다가 팀원분이 컨벤션이 적용되지 않은 코드라서 컨벤션 적용 후 다시 merge를 해달라는 요청을 받았다.
해당 프로젝트에서는 Naver 코딩 컨벤션을 적용하고 있었고, 큰 기업들에서는 각각의 코드 스타일에 맞게 컨벤션을 제공해주고 있음을 알 수 있었다.
코딩 컨벤션이란 가독성이 좋고 관리하기 쉬운 코드를 작성하기 위한 코딩 스타일 규악을 말한다.
컨벤션에 대한 xml 파일은 아래의 링크에서 확인이 가능하다.

- naver-checkstyle-rules

<https://github.com/naver/hackday-conventions-java/blob/master/rule-config/naver-checkstyle-rules.xml>

- naver-intellij-formatter.xml

<https://github.com/naver/hackday-conventions-java/blob/master/rule-config/naver-intellij-formatter.xml>

- naver-surpression.xml

<https://github.com/naver/hackday-conventions-java/blob/master/rule-config/naver-checkstyle-suppressions.xml>

## 컨벤션 적용

<img width="654" alt="Image" src="https://github.com/user-attachments/assets/91abb7e6-4c62-4be4-a119-12d8313173f3" />

<img width="654" alt="Image" src="https://github.com/user-attachments/assets/8a01703f-97e1-41a3-a7b3-4ec22ba4100f" />

- File → Settings → Tools에서 Checkstyle 항목을 선택한다.
- Scan scope를 All sources including tests로 설정한다.
- Treat Checkstyle errors as warnings를 체크한다.
- Configuration File에서 + 버튼을 클릭한다.
- Description은 Naver Checkstyle Rules으로 지정하는 것이 권장되지만 프로젝트별로 커스터마이징 했다면 프로젝트 이름 등을 붙인다.
- Use a Local Checkstyle File을 선택하고 Browse 버튼을 눌러서 naver-checkstyle-rules.xml를 지정하고 Next 버튼을 누른다.
- suppressionFile 변수를 설정하라는 창이 뜨면 Value에 **naver-checkstyle-suppressions.xml**를 입력하고 Next 버튼을 누른다.

<img width="654" alt="Image" src="https://github.com/user-attachments/assets/54b2d600-1da7-4fe6-8b28-7204b6e13b19" />

<img width="654" alt="Image" src="https://github.com/user-attachments/assets/3a87badf-5966-417d-92aa-cabe129bcc9f" />

<img width="654" alt="Image" src="https://github.com/user-attachments/assets/01c1f684-3146-4320-8f62-cf50a94d556d" />

<img width="654" alt="Image" src="https://github.com/user-attachments/assets/fbc8f68e-1cbf-4a56-aa4b-c19e7ee26f21" />

컨벤션을 적용하면 이와같이 checkstyle error를 확인할 수 있다.

## Reference

<https://github.com/naver/hackday-conventions-java/blob/master/rule-config/naver-checkstyle-rules.xml>