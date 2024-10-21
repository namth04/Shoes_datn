package com.fpoly.datn.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fpoly.datn.model.dto.ChartDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.ColumnResult;
import javax.persistence.ConstructorResult;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedNativeQuery;
import javax.persistence.OneToMany;
import javax.persistence.SqlResultSetMapping;
import javax.persistence.SqlResultSetMappings;
import javax.persistence.Table;
import java.sql.Timestamp;
import java.util.List;

@SqlResultSetMappings(
        value = {
                @SqlResultSetMapping(
                        name = "chartSoleDTO",
                        classes = @ConstructorResult(
                                targetClass = ChartDTO.class,
                                columns = {
                                        @ColumnResult(name = "label",type = String.class),
                                        @ColumnResult(name = "value",type = Integer.class)
                                }
                        )
                )
        }
)
@NamedNativeQuery(
        name = "getProductOrderSoles",
        resultSetMapping = "chartSoleDTO",
        query = "select s.name as label, count(o.quantity) as value  from sole s " +
                "inner join product p on p.sole_id = s.id " +
                "inner join orders o on p.id = o.product_id " +
                "where o.status = 3 " +
                "group by s.id"
)

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
    @Column(name = "name",nullable = false,unique = true)
    private String name;
    @Column(name = "description")
    private String description;
    @Column(name = "status",columnDefinition = "BOOLEAN")
    private boolean status;
    @Column(name = "created_at")
    private Timestamp createdAt;
    @Column(name = "modified_at")
    private Timestamp modifiedAt;
    @OneToMany(mappedBy = "sole")
    @JsonIgnore
    private List<Product> products;
}
