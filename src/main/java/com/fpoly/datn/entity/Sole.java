package com.fpoly.datn.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.sql.Timestamp;
import java.util.List;

    @AllArgsConstructor
    @NoArgsConstructor
    @Setter
    @Getter
    @Entity
    @Table(name = "sole")
    public class Sole {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(name = "name", nullable = false, unique = true)
        private String name;

        @Column(name = "description")
        private String description;

        @Column(name = "created_at")
        private Timestamp createdAt;

        @Column(name = "modified_at")
        private Timestamp modifiedAt;

        @Column(name = "status", columnDefinition = "BOOLEAN")
        private boolean status;

        @OneToMany(mappedBy = "sole")
        @JsonIgnore
        private List<Product> products;
    }

