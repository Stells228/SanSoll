package com.sansoll.app.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateReviewDto {
    private String username;
    private Long productId;
    private Integer rating;
    private String text;
}