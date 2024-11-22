package com.fpoly.entity;

import com.fpoly.enums.BannerType;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "banner")
@Getter
@Setter
public class Banner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    private String image;

    private String pageName;

    private Long idProduct;

    private String linkWeb;

    private BannerType bannerType;
}
