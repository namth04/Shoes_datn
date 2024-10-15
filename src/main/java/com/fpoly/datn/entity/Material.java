package com.fpoly.datn.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fpoly.datn.model.dto.ChartDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.List;

@SqlResultSetMappings(
        value = {
                @SqlResultSetMapping(
                        name = "chartMaterialDTO",
                        classes = @ConstructorResult(
                                targetClass = ChartDTO.class,
                                columns = {
                                        @ColumnResult(name = "label", type = String.class),
                                        @ColumnResult(name = "value", type = Integer.class)
                                }
                        )
                )
        }
)
@NamedNativeQuery(
        name = "getProductOrderMaterials",
        resultSetMapping = "chartMaterialDTO",
        query = "select m.name as label, count(o.quantity) as value from material m " +
                "inner join product p on p.material_id = m.id " +
                "inner join orders o on p.id = o.product_id " +
                "where o.status = 3 " +
                "group by m.id"
)

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Entity
@Table(name = "material")
public class Material {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "status", columnDefinition = "BOOLEAN")
    private boolean status;

    @Column(name = "created_at")
    private Timestamp createdAt;

    @Column(name = "modified_at")
    private Timestamp modifiedAt;

    @OneToMany(mappedBy = "material")
    @JsonIgnore
    private List<Product> products;
}
