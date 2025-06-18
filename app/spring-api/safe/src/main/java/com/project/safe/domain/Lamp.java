package com.project.safe.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "LAMP")
@Getter
@Setter
public class Lamp {

    @Id
    @Column(name = "LAMP_ID", nullable = false)
    private String lampId;

    @Column(name = "LATITUDE", nullable = false)
    private Double latitude;

    @Column(name = "LONGITUDE", nullable = false)
    private Double longitude;

    @Column(name = "LAMP_ADDRESS")
    private String address;
}