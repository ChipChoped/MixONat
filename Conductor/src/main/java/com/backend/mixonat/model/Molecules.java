package com.backend.mixonat.model;

import java.io.Serializable;

import lombok.Data;

@Data
public class Molecules implements Serializable
{
    Result result;
    Ranking[] ranking;
}
