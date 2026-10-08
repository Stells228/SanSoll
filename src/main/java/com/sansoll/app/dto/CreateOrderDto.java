package com.sansoll.app.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CreateOrderDto {
    private String username;
    private String address;
    private List<OrderItemDto> items;
}