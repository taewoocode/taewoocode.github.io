---
layout: post
title: Golf - Jmeter를 이용한 회원조회 성능 테스트
subtitle: ""
categories: project
tags: project
comments: false
---

## 개요

주변에서 들어본 성능 테스트 도구로는 k6, nGrinder, JMeter가 있습니다.
JMeter를 선택하게 된 이유는 테스트 후 자동으로 생성되는 HTML 형식의 보고서는 성능 결과를 시각적으로 
빠르게 파악할 수 있게 해주며, 결과를 팀원들과 공유하거나 문서화하는 데도 유용합니다.

또한 기존의 테스트 케이스뿐만이 아닌 실제 가상의 요청을 받아보며 
실제 서비스 운영 환경에서 여러 사용자가 동시에 요청을 보낼 때 시스템이 이를 얼마나 안정적으로 처리할 수 있는지를 검증하는 것이었습니다.

## Active 파일 다운로드

<https://jmeter.apache.org/download_jmeter.cgi>

- 해당 사이트에 접속해서 파일을 다운로드 받습니다.

## Homebrew

```bash
brew install jmeter

# 실행
jmeter
```

- Homebrew로 다운을 받으면 비교적 편해 저는 Homebrew로 다운을 받았습니다.

## Test Plan

![img.png](/assets/img/projects/golf/img_5.png)

우선 Test를 하나 만들어줍니다.

![img.png](/assets/img/projects/golf/img_6.png)

![img.png](/assets/img/projects/golf/img_7.png)

![img.png](/assets/img/projects/golf/img_8.png)

- 100명의 사용자 수(쓰레드 수) 세팅

![img.png](/assets/img/projects/golf/img_9.png)

- HTTP HeaderManager에서 Content-Type을 지정해준 이유 Value는 application/json으로 설정합니다.
- 저는 사용자 조회를 Post로 설정했기 때문에 이와같이 설정을 하였습니다.

![img.png](/assets/img/projects/golf/img_10.png)

- Body Data도 설정해줍니다.

![img.png](/assets/img/projects/golf/img_11.png)

![img.png](/assets/img/projects/golf/img_12.png)

![img.png](/assets/img/projects/golf/img_13.png)

- 100명의 요청 평균 응답 시간은 **2초**로, 웹 애플리케이션에서 정상적인 응답 속도에 비해 빠른 속도를 기록했습니다. **최소 응답 시간**은 1초로, 대부분의 요청이 빠르게 처리되었음을 알 수 있습니다.
- 또한 AOP로 측정한 개별처리 요청 또한 2ms 평균 0.002초 정도의 처리속도를 확인할 수 있습니다.

## Reference

나의 뇌

<https://jmeter.apache.org/download_jmeter.cgi>
