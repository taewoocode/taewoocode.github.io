---
layout: post
title: BIDMALL- auction_status_check - 01
subtitle: ""
categories: project
tags: project
comments: false
---

## 개요

```bash
2025-04-17T20:59:50.504+09:00  WARN 56825 --- [product_auction] [nio-8082-exec-2] o.h.engine.jdbc.spi.SqlExceptionHelper   : SQL Error: 0, SQLState: 23514
2025-04-17T20:59:50.505+09:00 ERROR 56825 --- [product_auction] [nio-8082-exec-2] o.h.engine.jdbc.spi.SqlExceptionHelper   : ERROR: new row for relation "auction" violates check constraint "auction_status_check"
  Detail: Failing row contains (9, 2025-04-25 00:00:00, 0, null, null, null, 2025-04-20 00:00:00, null, 경매 설명, PENDING).
2025-04-17T20:59:50.508+09:00  INFO 56825 --- [product_auction] [nio-8082-exec-2] c.e.p.p.c.AuctionControllerImpl          : 경매 등록 실패=could not execute statement [ERROR: new row for relation "auction" violates check constraint "auction_status_check"
  Detail: Failing row contains (9, 2025-04-25 00:00:00, 0, null, null, null, 2025-04-20 00:00:00, null, 경매 설명, PENDING).] [/* insert for com.example.product_auction.product.domain.Auction */insert into auction (description,end_time,highest_bid,start_time,status,winner_id) values (?,?,?,?,?,?)]; SQL [/* insert for com.example.product_auction.product.domain.Auction */insert into auction (description,end_time,highest_bid,start_time,status,winner_id) values (?,?,?,?,?,?)]; constraint [auction_status_check]

```

경매 시스템에서 상품을 등록하고 경매를 생성하는 과정에서, 요청 포맷에 맞게 데이터를 전달했음에도 불구하고, SQL 실행 중에 `auction_status_check` 제약 조건을 위반하는 오류가 발생했습니다. 이 오류는 `Auction` 테이블에 데이터를 삽입할 때 발생했으며, 경매 상태를 지정하는 과정에서 잘못된 값이 전달된 것과 관련이 있을 수 있습니다.

해당 [코드](https://github.com/BidMall/product_auction/blob/main/src/main/java/com/example/product_auction/product/service/AuctionServiceImpl.java)는 여기 링크에서 확인하실 수 있습니다.

## 문제 발생 경과

경매 등록 시, 클라이언트에서 다음과 같은 데이터 포맷으로 요청을 보냈습니다.

```json
{
  "product": {
    "name": "시바견 간식",
    "description": "저희 대박이가 정말 좋아하는 간식입니다!!",
    "imageUrl": "https://example.com/image.png",
    "startPrice": 1000000,
    "sellerId": 42
  },
  "description": "신제품 경매 시작!",
  "startTime": "2025-04-20T00:00:00",
  "endTime": "2025-04-25T00:00:00"
}
```

서버에서는 이 데이터를 받아 `Product` 객체를 저장한 후, `Auction` 객체를 생성하여 저장하려 했습니다. 하지만 다음과 같은 에러 메시지가 발생했습니다.

```
ERROR: new row for relation "auction" violates check constraint "auction_status_check"
Detail: Failing row contains (9, 2025-04-25 00:00:00, 0, null, null, null, 2025-04-20 00:00:00, null, 경매 설명, PENDING).
```

## 원인 분석

오류 메시지에서 `auction_status_check` 제약 조건을 위반했다고 나옵니다. 이는 `Auction` 테이블에서 `status` 필드가 특정 조건을 만족해야 한다는 제약을 의미합니다.

`Auction` 객체의 `status` 값이  `PENDING`으로 설정되어 있지만, `Auction` 테이블에서 `status` 값에 대한 추가 제약 조건이 적용되어 있어 이 값을 삽입할 수 없었습니다.

`Auction` 테이블의 `status` 필드는 `PENDING`, `AUCTIONING`, `COMPLETED`, `CANCELED` 등의 상태 값만 허용되며, 이 값이 부적절하게 설정되었거나, `status` 값이 제대로 설정되지 않아서 발생한 문제입니다.

## 현재코드

```java
@Override
	@Transactional
	public Auction.RegisterAuctionResponse registerAuction(Auction.RegisterAuctionRequest request) {
		Product product = request.getProduct();

		if (product == null) {
			throw new IllegalArgumentException("상품 정보가 없습니다.");
		}

		Product savedProduct = productRepository.save(product);

		Auction auction = Auction.builder()
			.product(savedProduct)  
			.description(request.getDescription())
			.startTime(request.getStartTime())
			.endTime(request.getEndTime())
			.status(Auction.AuctionStatus.PENDING)  
			.highestBid(0L) 
			.build();

		// 경매 저장
		Auction savedAuction = auctionRepository.save(auction);

		// 응답 반환
		return Auction.RegisterAuctionResponse.builder()
			.auctionId(savedAuction.getId())
			.product(savedProduct)
			.description(savedAuction.getDescription())
			.startTime(savedAuction.getStartTime())
			.endTime(savedAuction.getEndTime())
			.status(savedAuction.getStatus())
			.build();
	}
```

## 기존 코드 분석 및 문제점

```java
.status(Auction.AuctionStatus.PENDING)  // 경매 상태
```

처음 경매를 생성할 때, `PENDING` 상태로 하드코딩되어 있기 때문에, DB에서 허용하는 상태(enum 또는 check constraint에서 정의된 값)가 아닌 경우 오류가 발생할 수 있습니다.

`check constraint`를 enum과 연결해 둘 경우, 지정된 값 외의 상태가 들어오면 다음과 같은 오류가 발생합니다.

## 리팩토링

```java
@Override
@Transactional
public Auction.RegisterAuctionResponse registerAuction(Auction.RegisterAuctionRequest request) {
    Product product = request.getProduct();

    if (product == null) {
        throw new IllegalArgumentException("상품 정보가 없습니다.");
    }

    // 상품 등록
    Product savedProduct = productRepository.save(product);

    Auction auction = Auction.builder()
        .product(savedProduct)
        .description(request.getDescription())
        .startTime(request.getStartTime())
        .endTime(request.getEndTime())
        .status(Auction.AuctionStatus.ONGOING)  
        .highestBid(0L)
        .build();

    Auction savedAuction = auctionRepository.save(auction);

    return Auction.RegisterAuctionResponse.builder()
        .auctionId(savedAuction.getId())
        .product(savedProduct)
        .description(savedAuction.getDescription())
        .startTime(savedAuction.getStartTime())
        .endTime(savedAuction.getEndTime())
        .status(savedAuction.getStatus())
        .build();
}

```

경매를 처음 생성하고 등록할 때는 서버에게 상태값을 할당하도록 설계했습니다. 
클라이언트가 직접 경매 상태를 지정하는 방식은 다양한 예외 상황을 유발할 수 있었기 때문에, 
**경매 등록 시 상태값은 서버에서 자동으로 `ONGOING`으로 설정**되도록 리팩토링을 진행했습니다.

Respuest.JSON

```json
{
  "product": {
    "name": "시바견 간식",
    "description": "저희 대박이가 정말 좋아하는 간식입니다!!",
    "imageUrl": "...",
    "startPrice": 10000,
    "status": "WAITING",
    "sellerId": 1
  },
  "description": "신제품 경매 시작!",
  "startTime": "2025-04-20T00:00:00",
  "endTime": "2025-04-25T00:00:00"
}
```

Response.JSON

```json
{
    "auctionId": 11,
    "product": {
        "id": 11,
        "name": "시바견 간식",
        "description": "저희 대박이가 정말 좋아하는 간식입니다!!",
        "imageUrl": "...",
        "startPrice": 10000,
        "status": "WAITING",
        "sellerId": 1,
        "createdAt": "2025-04-17T21:10:25.992515",
        "auctions": null
    },
    "description": "신제품 경매 시작!",
    "startTime": "2025-04-20T00:00:00",
    "endTime": "2025-04-25T00:00:00",
    "status": "ONGOING"
}
```

잘 등록된 것을 확인이 가능합니다.

## Reference

나의 뇌