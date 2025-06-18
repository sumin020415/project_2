package com.project.safe.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "CCTV")
@Getter
@Setter
public class CCTV {

    @Id
    @Column(name = "CCTV_ID", nullable = false)
    private String cctvId;

    @Column(name = "LATITUDE", nullable = false)
    private Double latitude;

    @Column(name = "LONGITUDE", nullable = false)
    private Double longitude;

    @Column(name = "CCTV_ADDRESS")
    private String address;
}