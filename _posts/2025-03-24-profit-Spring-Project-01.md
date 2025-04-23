---
layout: post
title: profit- Spring Batch 적용기
subtitle: ""
categories: project
tags: project
comments: false
---

## 한국수출입은행 Open API 발급 방법

Open API는 개발된 공공데이터를 누구나 사용할 수 있도록 공개된 API(Application Program Interface)를 말합니다. 저는 여러 나라의 환율정보를 실시간으로 제공해줘야하기 때문에 SpringBatch를 선택했고, API는 한국수출입은행 API를 활용하였습니다. 하기의 링크에서 확인하실 수 있습니다.

<https://www.koreaexim.go.kr/ir/HPHKIR019M01>

### Open API 개발명세

### 1. 요청 URL (Request URL) + 요청변수

요청 URL (Request URL) + authkey (인증키) + searchdate (검색요청날짜) + data (검색요청 API타입)

## ExchangeDto.java

한국수출입은행 환율정보 API 호출 시 출력결과로 나오는 변수들을 객체로 생성하기 위한 파일을 생성하였습니다.

```java
package com.profitkey.stock.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@ToString
public class ExchangeDto {
		// 결과
    private Integer result; 
    
    // 통화코드
    private String cur_unit;
    
    // 국가/통화명 
    private String cur_nm; 
    
    // 국가/통화명
    private String ttb; 
    
    // 전신환(송금) 보내실 때
    private String tts; 
    
    // 매매 기준율
    private String deal_bas_r; 
    
    // 장부가격
    private String bkpr; 
    
    // 년환가료율
    private String yy_efee_r; 
    
    // 년환가료율
    private String ten_dd_efee_r; 
    
    // 서울외국환중개 매매기준율
    private String kftc_bkpr; 
    
    // 서울외국환중개 매매기준율
    private String kftc_deal_bas_r; 
}

```

## ExchangeUtils.java

배치에 사용될 내 로직 내 기능을 독립적으로 구성했습니다.

### Util(Utils) 클래스/패키지 란 무엇인가요?

`ExchangeUtils.java`는 배치 처리 로직에서 사용하는 여러 기능들을 독립적으로 구성한 클래스입니다. 이런 유틸리티 클래스는 일반적으로 전역적으로 재사용 가능한 로직을 담는 용도로 사용됩니다. 예를 들어 문자열 처리, 날짜 및 시간 계산, 형 변환 등의 기능처럼 특정 도메인이나 비즈니스 로직과는 무관한, 순수한 기능 중심의 메서드들을 담습니다. 이러한 메서드들은 대부분 `static`으로 선언되어 객체 생성 없이도 호출할 수 있어 간편하게 사용할 수 있다는 장점이 있습니다.

처음에는 외부 API를 호출하는 로직도 이러한 Util 패키지에 모아두는 방식으로 설계했습니다. 실제로 API 요청은 단순한 HTTP 호출일 때가 많고, 여러 서비스에서 재사용되기도 하니 Util 클래스에 넣는 것이 그럴듯해 보일 수 있습니다. 하지만 여러 기술 블로그나 개발자 커뮤니티의 논의들을 살펴보면, **API 호출은 단순한 기능처럼 보여도 실제로는 비즈니스 로직과 밀접하게 연결되는 경우가 많기 때문에 Util 클래스보다는 Service 계층에 두는 것이 바람직하다**는 의견이 많습니다. 특히 API 호출 결과에 따라 다른 처리를 하거나, 실패 시의 예외 처리, 재시도 로직, 인증 토큰 갱신 등의 로직이 붙기 시작하면 더 이상 단순한 '기능'이 아니게 됩니다.

저 역시 이러한 고민 끝에 API 관련 코드는 `Util`에서 `Service` 계층으로 옮기는 방향을 고려하고 있습니다. 만약 여러분도 Util 패키지에 넣은 로직이 점점 복잡해지고 있다면, **그 기능이 진짜 '도메인 독립적'인지** 한 번쯤 다시 점검해보시길 추천드립니다. 기술적으로 가능한 구조보다는, 의미상 자연스럽고 유지보수하기 쉬운 구조를 선택하는 것이 장기적으로 더 좋은 설계로 이어질 수 있습니다.

### getSearchdate()

주말(토요일, 일요일) 에는 환율 정보가 들어오지 않습니다. 파라미터에 값을 설정하기 위하여 토요일, 일요일 모두 금요일로 설정하도록 하는 함수입니다. 특정 조건들을 추가하여 특정 일자를 호출하고 싶다면 이 메서드에서 수정하면 됩니다.

```java
private String getSearchdate() {

    LocalDate currentDate = LocalDate.now();
    DayOfWeek dayOfWeek = currentDate.getDayOfWeek();
// 토요일if (dayOfWeek.getValue() == 6)
        return currentDate.minusDays(1).format(DateTimeFormatter.ofPattern("yyyyMMdd"));
// 일요일if (dayOfWeek.getValue() == 7)
        return currentDate.minusDays(2).format(DateTimeFormatter.ofPattern("yyyyMMdd"));

    return currentDate.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
}
```

### @Value("${-- KEY --}")

properties 파일에 작성한 값을 키(명칭)를 통해 가져옵니다. 해당 어노테이션을 통해 작성한 변수에 값을 부여합니다.

```java
@Value("${exchange-authkey}")
private String authkey;

@Value("${exchange-data}")
private String data;
```

### getExchangeDataSync()

- Open API 개발명세의 (Request URL) + 요청변수 형식을 구성하여 Get 방식을 사용하였습니다.
- WebClient를 사용하여 외부 API를 호출할 땐 인코딩을 주의해야 합니다.
- DefaultUriBuilderFactory 객체를 생성하여 인코딩 모드를 None으로 변경하고 이를 아래와 같이 WebClient에 적용했습니다.
- queryParam을 사용할 때, API를 WebClient로 호출하기 위해서 인코딩을 하지 않도록 처리하였습니다.

```java
public JsonNode getExchangeDataSync() {

    DefaultUriBuilderFactory factory = new DefaultUriBuilderFactory();
    factory.setEncodingMode(DefaultUriBuilderFactory.EncodingMode.NONE);
    webClient = WebClient.builder().uriBuilderFactory(factory).build();

    String responseBody = webClient.get()
            .uri(builder -> builder
                    .scheme("https")
                    .host("www.koreaexim.go.kr")
                    .path("/site/program/financial/exchangeJSON")
                    .queryParam("authkey", authkey)
                    .queryParam("searchdate", searchdate)
                    .queryParam("data", data)
                    .build())
            .retrieve()
            .bodyToMono(String.class)
            .block();// 동기적으로 결과를 얻음return parseJson(responseBody);
}
```

### parseJson(String responseBody)

getExchangeDataSync()에서 가져온 결과 값 (String responseBody)을 Json 형식으로 나타내기 위한 작업입니다.

```java
private JsonNode parseJson(String responseBody) {
    try {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readTree(responseBody);
    } catch (IOException e) {
// 예외 처리 필요
        e.printStackTrace();
        return null;
    }
}
```

### ExchageUtils.java

```java
package com.main.exchangeBatch.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.main.exchangeBatch.dto.ExchangeDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.DefaultUriBuilderFactory;

import java.io.IOException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Component
public class ExchangeUtils {

    @Value("${exchange-authkey}")
    private String authkey;

    @Value("${exchange-data}")
    private String data;

    private final String searchdate = getSearchdate();

    WebClient webClient;

    public JsonNode getExchangeDataSync() {

        DefaultUriBuilderFactory factory = new DefaultUriBuilderFactory();
        factory.setEncodingMode(DefaultUriBuilderFactory.EncodingMode.NONE);

// WebClient를 생성합니다.
        webClient = WebClient.builder().uriBuilderFactory(factory).build();

// WebClient를 사용하여 동기적으로 데이터를 요청하고, 바로 parseJson 함수를 호출합니다.
        String responseBody = webClient.get()
                .uri(builder -> builder
                        .scheme("https")
                        .host("www.koreaexim.go.kr")
                        .path("/site/program/financial/exchangeJSON")
                        .queryParam("authkey", authkey)
                        .queryParam("searchdate", searchdate)
                        .queryParam("data", data)
                        .build())
                .retrieve()
                .bodyToMono(String.class)
                .block();// 동기적으로 결과를 얻음return parseJson(responseBody);
    }

    private JsonNode parseJson(String responseBody) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.readTree(responseBody);
        } catch (IOException e) {
// 예외 처리 필요
            e.printStackTrace();
            return null;
        }
    }
    public List<ExchangeDto> getExchangeDataAsDtoList() {
        JsonNode jsonNode = getExchangeDataSync();

        if (jsonNode != null && jsonNode.isArray()) {
            List<ExchangeDto> exchangeDtoList = new ArrayList<>();

            for (JsonNode node : jsonNode) {
                ExchangeDto exchangeDto = convertJsonToExchangeDto(node);
                exchangeDtoList.add(exchangeDto);
            }

            return exchangeDtoList;
        }

        return Collections.emptyList();
    }

    private ExchangeDto convertJsonToExchangeDto(JsonNode jsonNode) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.treeToValue(jsonNode, ExchangeDto.class);
        } catch (JsonProcessingException e) {
// 예외 처리 필요
            e.printStackTrace();
            return null;
        }
    }

    private String getSearchdate() {

        LocalDate currentDate = LocalDate.now();
        DayOfWeek dayOfWeek = currentDate.getDayOfWeek();
// 토요일if (dayOfWeek.getValue() == 6)
            return currentDate.minusDays(1).format(DateTimeFormatter.ofPattern("yyyyMMdd"));
// 일요일if (dayOfWeek.getValue() == 7)
            return currentDate.minusDays(2).format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        return currentDate.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
    }
}
```

## ExchangeBatch.java

배치에 대한 비즈니스 로직을 담은 파일입니다. 간단한 배치 예제이기 때문에, 비교적 Chunk 방식보다 가벼운 Tasklet 방식으로 구성하였습니다.

### ExchangeBatch.java - 전체 코드

```java
package com.main.exchangeBatch.batch;

import com.main.exchangeBatch.dto.ExchangeDto;
import com.main.exchangeBatch.utils.ExchangeUtils;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

import java.util.List;

@Configuration
public class ExchangeBatch {
    @Autowired
    private ExchangeUtils exchangeUtils;

    @Bean
    public Job exchangeJob(JobRepository jobRepository, Step step) {
        return new JobBuilder("exchangeJob", jobRepository)
                .start(step)
                .build();
    }
    @Bean
    public Step step(JobRepository jobRepository, Tasklet tasklet, PlatformTransactionManager platformTransactionManager){
        return new StepBuilder("step", jobRepository)
                .tasklet(tasklet, platformTransactionManager).build();
    }
    @Bean
    public Tasklet tasklet(){
        return ((contribution, chunkContext) -> {
            List<ExchangeDto> exchangeDtoList = exchangeUtils.getExchangeDataAsDtoList();

            for (ExchangeDto exchangeDto : exchangeDtoList) {
                System.out.println("통화 : " + exchangeDto.getCur_nm());
                System.out.println("환율 : " + exchangeDto.getDeal_bas_r());
// 추가적인 필드가 있다면 출력 또는 활용
            }
            return RepeatStatus.FINISHED;
        });
    }
}
```

## 트러블 슈팅

```bash
Parameter 1 of constructor in com.profitkey.stock.handler.BatchScheduler required a single bean, but 2 were found:
	- createStockInfoJob: defined by method 'createStockInfoJob' in class path resource [com/profitkey/stock/config/BatchConfig.class]
	- exchangeJob: defined by method 'exchangeJob' in class path resource [com/profitkey/stock/handler/ExchangeBatchConfig.class]

This may be due to missing parameter name information

Action:

Consider marking one of the beans as @Primary, updating the consumer to accept multiple beans, or using @Qualifier to identify the bean that should be consumed

Ensure that your compiler is configured to use the '-parameters' flag.
You may need to update both your build tool settings as well as your IDE.
(See https://github.com/spring-projects/spring-framework/wiki/Upgrading-to-Spring-Framework-6.x#parameter-name-retention)

Disconnected from the target VM, address: '127.0.0.1:53621', transport: 'socket'

Process finished with exit code 1
```

```bash
Description:

Parameter 1 of constructor in com.profitkey.stock.handler.BatchScheduler required a single bean, but 2 were found:
	- createStockInfoJob: defined by method 'createStockInfoJob' in class path resource [com/profitkey/stock/config/BatchConfig.class]
	- exchangeJob: defined by method 'exchangeJob' in class path resource [com/profitkey/stock/handler/ExchangeBatchConfig.class]

This may be due to missing parameter name information

Action:

Consider marking one of the beans as @Primary, updating the consumer to accept multiple beans, or using @Qualifier to identify the bean that should be consumed
```

이 오류는 BatchScheduler 클래스에서 Job 타입의 빈을 주입받을 때, createStockInfoJob과 exchangeJob 두 개의 Job 빈이 존재해서 Spring이 어떤 빈을 주입할지 모르기 때문에 발생하는 문제입니다.
SpringBean 충돌로 bean name을 지정해서 충돌이 발생하지 않게 분리
코드에서 Bean name을 설정하여 exchangeJob을 기본 빈으로 설정하면 
두 Job(exchangeJob과 createStockInfoJob)이 동일한 타입(Job)으로 등록되어 있을 때, Spring이 어떤 빈을 주입해야 할지 결정하지 못해 발생하는 충돌을 방지합니다.

![img.png](/assets/img/projects/golf/img_2.png)

![img.png](/assets/img/projects/golf/img_3.png)

![img.png](/assets/img/projects/golf/img_4.png)

로그에 잘 출력되는 것을 확인할 수 있습니다.

## 실행 결과

<https://docs.spring.io/spring-batch/reference/step/chunk-oriented-processing/restart.html>