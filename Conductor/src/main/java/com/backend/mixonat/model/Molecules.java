package com.backend.mixonat.model;

import java.io.Serializable;

import com.backend.mixonat.dto.JsonResponse;
import lombok.Data;

@Data
public class Molecules implements Serializable, JsonResponse
{
    Result result;
    Ranking[] ranking;
}
