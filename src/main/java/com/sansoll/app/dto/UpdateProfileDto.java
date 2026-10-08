package com.sansoll.app.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileDto {
    private String newUsername;
    private String phone;
}